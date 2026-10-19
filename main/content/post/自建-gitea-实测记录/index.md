---
title: 自建 Gitea 实测记录
description: 我在本机实际执行过的 Gitea 试验记录：官方二进制、SQLite、HTTP 推拉、Cloudflare Tunnel 发布与推送免密，以及我查了但没验证的部分。
date: 2026-10-19
lastmod: 2026-10-19
image:
categories:
    - 记录
tags:
    - Git
    - Gitea
    - Cloudflare Tunnel
    - 自建服务
---

## 引言

起因是我在查 Gitea 官方那个免费公共实例 gitea.com 的额度，结果查到官方维护者 lunny 在[论坛的原话](https://forum.gitea.com/t/gitea-com-is-up/992/8)是“Everyone can only create 5 repositories.”，也就是一个账号只能建 5 个仓库。官方仓库的 [README](https://github.com/go-gitea/gitea/blob/main/README.md) 也承认这个实例的仓库数量有限制，只是没写数字。一个账号 5 个仓库显然不够用，于是就有了在自己机器上跑一个 Git 服务的念头。

这篇记录只写我在这台机器上实际执行过的命令和实际观察到的结果。凡是我查到、但没有亲自跑过的内容，一律集中在最后一节，明确标注为未验证，不会混进正文冒充步骤。文中出现的密钥、令牌、我的公网 IP 都用占位符替换过，域名也已改写成示例域名。

## 先说清楚我这次的形态

这一点很重要，因为它决定了这篇记录能支持什么结论、不能支持什么结论。

我这次是**试验形态**，不是正式部署。二进制直接放在临时目录，用 `chmod` 加执行权限就运行，没有安装到系统目录；Gitea 进程用**我自己的账号**跑，没有创建专用系统用户；配置文件放在临时目录，不是 `/etc/gitea`；数据落在临时目录；HTTP 端口用 **55459**，不是默认的 3000；全程**没有碰 systemd**；`INSTALL_LOCK` 从一开始就是 `true`，所以**没有走过网页安装向导**；Git LFS 也没有启用。

也就是说，我验证到的范围是“这个二进制能不能在零外部依赖的情况下跑起来，以及能不能通过 Cloudflare Tunnel 正常推拉代码”。我没有验证“如何把这套东西长期、规范地部署在一台服务器上”，那一部分在最后一节。

## 下载与校验

官方下载站的地址按版本组织，文件名带平台后缀。我下载的是 28.2.0 的 Linux amd64 版本：

```shell
curl -sSL -o gitea-28.2.0-linux-amd64 https://dl.gitea.com/gitea/28.2.0/gitea-28.2.0-linux-amd64
curl -sSL -o gitea-28.2.0-linux-amd64.sha256 https://dl.gitea.com/gitea/28.2.0/gitea-28.2.0-linux-amd64.sha256
chmod 755 gitea-28.2.0-linux-amd64
```

下载到的文件是 119488672 字节。哈希文件里给出的值是 `15681fc615d56611c274f52803fef4d6d5316b620f93b677dd4b831a74e50b9f`，我用 `sha256sum` 算出来的结果与它一致。

```shell
./gitea-28.2.0-linux-amd64 --version
```

输出是 `gitea version 28.2.0 built with go1.27.2`，说明二进制可以在这台机器上直接执行。这台机器上的 Git 是 2.34.1。

需要说明的是，哈希文件本身也是从同一个站点下载的。它能挡住传输损坏，但挡不住站点被整体替换。官方另外提供了 sigstore 与 GPG 签名，我没有验证那两种方式，所以这里不做评价。

## 生成密钥

`SECRET_KEY` 与 `INTERNAL_TOKEN` 这一类值必须自己生成，不能沿用任何示例。二进制自带生成命令：

```shell
./gitea-28.2.0-linux-amd64 generate secret SECRET_KEY
./gitea-28.2.0-linux-amd64 generate secret INTERNAL_TOKEN
./gitea-28.2.0-linux-amd64 generate secret JWT_SECRET
./gitea-28.2.0-linux-amd64 generate secret LFS_JWT_SECRET
```

四条都跑通了，输出是随机字符串。`JWT_SECRET` 对应的是 `[oauth2]` 段，`LFS_JWT_SECRET` 对应 `[lfs]` 段。

## 我用的配置文件

下面是这次实际使用的那份配置，密钥值已替换成占位符，路径按临时目录的真实形状保留：

```ini
APP_NAME = Gitea binary smoke test
RUN_USER = <我自己的登录名>
WORK_PATH = <临时目录>/work

[server]
PROTOCOL = http
DOMAIN = 127.0.0.1
HTTP_ADDR = 127.0.0.1
HTTP_PORT = 55459
ROOT_URL = https://<示例域名>/
DISABLE_SSH = true
OFFLINE_MODE = true

[database]
DB_TYPE = sqlite3
PATH = <临时目录>/work/data/gitea.db

[repository]
ROOT = <临时目录>/work/data/gitea-repositories

[lfs]
PATH = <临时目录>/work/data/lfs
JWT_SECRET = <generate secret LFS_JWT_SECRET 的输出>

[log]
MODE = console
LEVEL = info
ROOT_PATH = <临时目录>/work/log
logger.access.MODE = console

[security]
INSTALL_LOCK = true
SECRET_KEY = <generate secret SECRET_KEY 的输出>
INTERNAL_TOKEN = <generate secret INTERNAL_TOKEN 的输出>

[oauth2]
JWT_SECRET = <generate secret JWT_SECRET 的输出>
```

几个值的由来：

`RUN_USER` 填的是我自己的登录名，因为我就是用这个账号跑进程的，它必须与运行进程的账号一致。

`HTTP_ADDR` 只监听回环地址，因为后面由 Cloudflare Tunnel 从本机连入，不需要对公网监听。

`ROOT_URL` 最初写的是 `http://127.0.0.1:55459/`，配置隧道时改成了公网域名，两种我都跑过。

`DISABLE_SSH = true` 是因为隧道下 22 端口不可达，留着只会给出连不上的克隆地址。

`[database]` 用 SQLite，`PATH` 指向临时目录。官方二进制自带 SQLite 支持，不需要装数据库。

`INSTALL_LOCK = true` 跳过网页安装向导，直接从已有配置启动。

`logger.access.MODE = console` 不是默认值，是我为了验证“Gitea 能否看到真实客户端 IP”而临时打开的。

`[lfs]` 段只填了 `JWT_SECRET`，而 `LFS_START_SERVER` 保持默认的 `false`，也就是说这份配置里的 LFS 实际上没有启用，我也没用过 LFS。

## 启动，以及它实际做了什么

```shell
./gitea-28.2.0-linux-amd64 web --config app.ini
```

我是把它放到后台跑的，好腾出手做别的事。它启动后，日志里依次出现这些内容（节选）：

```
InitDBEngine() [I] Beginning ORM engine initialization.
serveInstalled() [I] PING DATABASE sqlite3
InitWebInstalled() [I] ORM engine initialization successful!
InitIssueIndexer.1() [I] PID 3856727: Initializing Issue Indexer: bleve
listen() [I] Listen: http://127.0.0.1:55459
listen() [I] AppURL(ROOT_URL): https://<示例域名>/
NewServer() [I] Starting new Web server: tcp:127.0.0.1:55459 on PID: 3856727
```

也就是说，SQLite 数据库是它自己建的，各个存储目录（仓库、附件、头像、包、Actions 的日志与产物等）也是它自己建的，我没有预先创建任何目录。从执行命令到可以访问，大概 5 秒。

`INSTALL_LOCK = true` 的效果我顺手验证了一下：访问 `/install` 返回 404，说明安装向导确实被关掉了。

真正部署时这里还应该注意：Gitea 在启动时会重写运行用户家目录下的 `~/.ssh/authorized_keys`，详见后面单独的一节。

## 建管理员与建仓库

我第一次用二进制自带的命令建管理员，没有走网页注册：

```shell
./gitea-28.2.0-linux-amd64 admin user create --config app.ini \
  --username <用户名> --password <密码> --email <邮箱> \
  --admin --must-change-password=false \
  --access-token --access-token-name smoke
```

`--access-token` 让它在建用户的同时直接生成一个访问令牌并打印出来，省掉了登录网页再手动建令牌的步骤。这个令牌后面用得到。

接着用这个令牌通过接口建仓库：

```shell
curl -sS -X POST -H "Authorization: token <令牌>" -H "Content-Type: application/json" \
  -d '{"name":"smoke-repo","private":true}' \
  http://127.0.0.1:55459/api/v1/user/repos
```

返回里同时给出了 `clone_url` 和 `ssh_url`。这里出现了一个值得记下的现象：**我已经设了 `DISABLE_SSH = true`，接口仍然返回了 `ssh_url`**，内容是一个 `用户名@域名:仓库路径` 形式的地址，而这个地址在隧道下根本连不上。接口返回这个字段，不代表那条路径可用。

## 走 HTTP 的推拉

这一步是整套东西的核心，因为经 Cloudflare Tunnel 访问的协作者用的就是这个协议：

```shell
git init -q -b main .
git add -A
git commit -qm "first commit"
git remote add origin "http://<用户名>:<令牌>@127.0.0.1:55459/<用户名>/smoke-repo.git"
git push origin main
```

推送成功。为了确认不是假象，我删掉本地目录，从零再克隆一次，拿到的是完整的提交内容。后来配置好隧道之后，我又用公网域名把同样的推拉做了一遍，同样成功。

## 一次推送到底对应多大的请求

这一节是为了搞清楚 Cloudflare 的上传上限到底卡在什么粒度上。[Cloudflare 官方文档](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/4xx-client-error/error-413/)写明单个请求体上限是免费版与 Pro 版 100MB、Business 200MB、Enterprise 最高可到 5GB。

我用 `GIT_TRACE_CURL` 把一次推送的 HTTP 行为完整抓了下来，推的是一个 20MiB 的提交，关键的请求头是：

```
=> Send header: POST /<用户名>/big-push.git/git-receive-pack HTTP/1.1
=> Send header: Transfer-Encoding: chunked
```

整个包在这**一个** POST 请求里以分块传输发出，没有 `Content-Length` 头。Git 官方的 [HTTP 协议文档](https://git-scm.com/docs/http-protocol)也说明 `git-receive-pack` 是把对象数据整体跟在上传命令之后，协议本身没有分块续传的机制。

所以可以确定的是：那个上限约束的是**一次请求的请求体**，落到 Git 上就是“一次推送所发送的新对象总量”，而不是仓库里最大的那个文件多大。日常增量提交只发送新增对象，通常很小；可能出问题的是首次导入一个大仓库，或者一次性推送大量历史。下载方向不受这个上限约束。

至于超过上限时是否真的会被拒，我没有打隧道实测过，这一条列在最后一节。

顺带一个实验上的教训：我第一次抓这个日志时，把输出接了 `head`，结果管道提前关闭，`git push` 被信号打断，仓库里什么也没收到。第二次改成把日志完整写进文件才拿到完整数据。

## 用 Cloudflare Tunnel 发布

这台机器没有公网 IP，也没有在任何路由器上开放入站端口。cloudflared 是个纯用户态程序，启动时主动向外连到 Cloudflare 的边缘节点，外部请求再由边缘沿着这条连接转发回来，所以不需要公网 IP。

```shell
cloudflared tunnel create gitea-smoke
cloudflared tunnel route dns <隧道 UUID> <示例域名>
```

这里有个必须注意的地方：**`route dns` 要传隧道的 UUID，不要传隧道名**。cloudflared 处理这条命令时并不按名字查找隧道，而是直接读取本机凭据文件里记录的隧道 ID。这台机器上本来就有一条正在服务其他域名的隧道，如果传名字，DNS 记录会被建到那条隧道上，而日志照样显示成功，不会有任何报错。UUID 用 `cloudflared tunnel list --output json` 取。

隧道配置我单独写了一个文件，用 `--config` 指定，没有动机器上已有的那份全局配置：

```yaml
tunnel: gitea-smoke
credentials-file: <隧道 UUID 对应的凭据文件>

ingress:
  - hostname: <示例域名>
    service: http://127.0.0.1:55459
  - service: http_status:404
```

```shell
cloudflared tunnel --config cloudflared.yml run <隧道 UUID>
```

启动日志里开头那一屏 `CONNECTIVITY PRE-CHECKS` 出现了若干 FAIL，紧接着又有连接失败的告警，这在网络刚就绪时很常见。真正的判据是这一行：

```
INF Registered tunnel connection connIndex=0 ... protocol=quic
```

我这边注册到了三个节点，标识分别是 `hkg01`、`hkg08`、`hkg09`。

## 实测结果

以下都是我在这次试验里量到的数值。

| 项目 | 结果 |
| --- | --- |
| 公网访问首页 | 返回 200，TLS 校验通过 |
| 证书 | 由 Cloudflare 边缘签发，一级子域名也被覆盖 |
| 首次访问耗时 | 5.08 秒（含边缘签发证书与隧道预热） |
| 稳定访问耗时 | 0.45 至 0.55 秒，偶发尖刺 1.3 至 1.6 秒 |
| 经公网克隆 | 成功 |
| 经公网推送 | 成功 |
| 克隆地址 | 页面与接口给出的都是公网 HTTPS 地址，与 `ROOT_URL` 一致 |
| 客户端真实 IP | Gitea 访问日志记到的是访客真实公网 IP |
| 动态页面缓存 | 响应头为 `cf-cache-status: DYNAMIC`，没有被缓存 |

客户端真实 IP 这一条我单独验证过。我打开了访问日志，然后带一个可识别的 User-Agent 从公网发了一次请求，日志里记到的是我的真实公网 IP，不是 `127.0.0.1`：

```
<访客真实公网 IP> - - [19/Oct/2026:17:12:18 +0800] "GET / HTTP/1.1" 200 15840 "" "smoke-ip-check"
```

它之所以能正确还原，是因为 Gitea 默认信任来自 `127.0.0.0/8` 与 `::1/128` 的转发头，而 cloudflared 正是从本机连入的。这一点有实际意义：fail2ban 之类的防护依赖真实 IP，如果全部记录成转发节点的地址，那些防护就不起作用了。

延迟方面，这次的路径是本地到香港边缘再回到本地，所以数值里包含了绕行到 Cloudflare 节点的往返开销。

## 推送免密

走 HTTPS 推送时，Git 需要一对用户名与密码，这里的关键点是密码位置要填**访问令牌**，不是登录密码。不用每次输入这件事不靠 Git 自己记住，而是靠一个凭据助手代为保管。

我把这个机制两个方向都试了一遍。先往一个独立的凭据文件里写入令牌：

```shell
printf 'protocol=https\nhost=%s\nusername=%s\npassword=%s\n\n' "<域名>" "<用户名>" "<令牌>" \
  | git credential-store --file=<凭据文件> store
```

然后用凭据助手、不给地址带令牌、且禁用交互提示的方式克隆：

```shell
GIT_TERMINAL_PROMPT=0 git -c credential.helper="store --file=<凭据文件>" clone https://<域名>/<用户名>/smoke-repo.git demo
```

克隆成功。接着做反向对照，去掉凭据助手、同样禁用交互提示：

```shell
GIT_TERMINAL_PROMPT=0 GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null git clone https://<域名>/<用户名>/smoke-repo.git demo2
```

这次失败了，报 `fatal: could not read Username for 'https://<域名>': terminal prompts disabled`，退出码 128。两个方向合起来才能确认起作用的就是凭据助手本身。

这台机器上可选的助手只有两种：`cache`（[内存中保留一段时间](https://git-scm.com/docs/git-credential-cache)，官方默认 900 秒）与 `store`（[明文写到磁盘](https://git-scm.com/docs/git-credential-store)，官方明确警告它不加密，只靠文件权限保护）。系统里虽然装了 `libsecret` 这个库，但并没有随 Git 提供 `git-credential-libsecret` 这个助手程序，`secret-tool` 也不存在。macOS 的 `git-credential-osxkeychain`、Windows 的 `git-credential-wincred` 与跨平台的 Git Credential Manager 我都没有在这台机器上验证过。

凭据助手是客户端配置，每一台会推送代码的机器都要各配一次。第一次推送时它才会提示输入，用户名填 Gitea 账号，密码位置粘贴访问令牌。

## 多远端与一次推多个目标

一个仓库可以有任意多个远端，这一点是基本用法。我实测的是“让一条命令同时推给两个地址”那种写法：

```shell
git remote add origin <第一个仓库>
git remote set-url --add --push origin <第一个仓库>
git remote set-url --add --push origin <第二个仓库>
```

配置好之后 `git remote -v` 会显示一行取用地址与多行推送地址。我用两个本地裸仓库做了验证，一次 `git push origin main` 之后两边都收到了同一个提交。

然后我把失败的情况也测了，结论比预想的更需要小心。

推送是**按顺序依次进行**的，遇到第一个失败的目标就停止。我把一个不存在的地址放在最前面，后面的有效地址一个都没收到；把它放在最后，前面的地址都已经收到了数据，而命令仍然以非零状态退出。也就是说这不是一次原子操作，可能出现只推了一部分的状态。

更需要注意的是，这种情况下本地的远端跟踪引用仍然会被更新。那次部分成功的推送结束后，`refs/remotes/origin/main` 已经指向了新提交，`git status` 看起来是干净的，很容易让人误以为全部成功了。**判断是否全部成功只能看退出码与报错，不能看本地状态。**

Git 官方文档里对这个配置的[说明](https://git-scm.com/docs/git-config#Documentation/git-config.txt-remoteltnamegtpushurl)是“同一个远端可以配置多个推送地址，此时一次推送会推给全部”，同时还有一条容易被忽略的说明：同一个远端的推送地址与取用地址“must still refer to the same place”，也就是应当指向同一个仓库。把两个不同的仓库挂在同一个远端上做镜像，其实偏离了这条假设，实际后果就是上面说的：本地的跟踪引用只能反映其中一个目标。

## 一个副作用：它会改写运行用户家目录的 authorized_keys

这是我这次碰到的最需要注意的行为。Gitea 启动时会重写**运行用户家目录**下的 `~/.ssh/authorized_keys`，日志里对应这一行：

```
syncAppConfForGit() [I] re-write ssh public keys ...
```

我用的是自己的账号，所以它动的是我的家目录。过程记录如下。

先说明一个限制：这个文件在我第一次启动 Gitea **之前**的哈希我没有记录，所以不能断言第一次启动没有改动过它。我能确认的是它没有清空这个文件。真正干净的对照是后面这组：我通过接口注册了一把测试公钥，重启之后文件里原有那一行被完整保留，Gitea 只是在文件末尾追加了自己管理的块：

```
<我原有的那一行公钥>
# gitea public key
command="<二进制路径> --config=<配置路径> serv key-1",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty,no-user-rc,restrict <测试公钥>
```

然后我通过接口删掉那把测试公钥并重启，文件又回到了与追加之前完全相同的哈希。所以它的行为是“保留原有内容、只追加和清理自己管理的部分”。

对应的配置项是 `SSH_CREATE_AUTHORIZED_KEYS_FILE`，默认开启。如果你使用 `AuthorizedKeysCommand` 之类的方式管理这个文件，可以把它设为 `false`。另外，如果用专用用户跑 Gitea，它操作的就是那个用户的家目录，不会碰你个人账号的。

## 我查了但没在本机验证的部分

下面这些都是我查阅官方文档得到的信息，**我没有亲自执行或观察过**，写在这里是为了不丢信息，不是可以照抄的步骤。

**正式部署的目录与用户布局。** 官方文档给出的做法是建一个专用的系统用户（例如 `git`），目录用 `/var/lib/gitea/{custom,data,log}`，配置放 `/etc/gitea/app.ini`，二进制装到 `/usr/local/bin/gitea`，并对这些目录设 `chown` 与 `chmod`。我这次全部绕开了这套布局。相关文档：<https://docs.gitea.com/installation/install-from-binary>

**用 systemd 常驻。** 官方仓库里有一份服务模板（注意它的路径是 `contrib/service/systemd/`，不是网上常见文章写的 `contrib/systemd/`），我没有安装成服务，所以没有验证它在系统上能否正常拉起。相关模板：<https://github.com/go-gitea/gitea/blob/main/contrib/service/systemd/gitea.service>

**网页安装向导。** 我把 `INSTALL_LOCK` 直接设成了 `true`，只验证了向导会被关掉，没有走过它的完整流程。

**Git LFS。** 我只填了 `[lfs]` 的密钥，没有启用它，也没有推送过任何 LFS 对象。

**Gitea 自带的仓库推送镜像。** 官方文档说可以在仓库设置里配置一个目标地址，让 Gitea 主动把变更推出去，1.18 起还有“推送新提交时同步”的选项；文档同时用一个警示框写明它会强制推送、覆盖目标仓库上的改动。另外拉取镜像只能为尚未在实例上创建的仓库设置。这些我都没有实测。相关文档：<https://docs.gitea.com/usage/repository/repo-mirror>

**超过上传上限时的实际表现。** 我只确认了“一次推送的包在一个请求里”，没有构造超过 100MB 的推送去打隧道，所以不知道它是否真的返回 413。

**Cloudflare 的 100 秒超时。** 官方文档里这个限制对应 524 错误，我这次仓库很小，没有触发过。相关文档：<https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/error-524/>

**SSH 经隧道的其他走法。** Cloudflare 官方文档说隧道原生只转发 HTTP 与 HTTPS，非 HTTP 服务需要客户端侧也运行 cloudflared；Spectrum 可以代理任意 TCP，计划表里 SSH 在 Pro、Business、Enterprise 套餐下可用，但自定义 TCP 与 UDP 属于企业版付费附加。这些我没有验证过。相关文档：<https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/protocols/>

**WebSocket。** Gitea 在 `/-/ws` 上有一个用于实时更新的 WebSocket 连接。我探测过这个路径，返回了 426，但我的探测走的是 HTTP/2，curl 做不出真正的 WebSocket 握手，所以这个结果不能用来说明隧道的好坏，等于没测出来。Gitea 在 WebSocket 不工作时会退回轮询，所以它不影响基本使用。

**Cloudflare 服务条款里关于大文件的那一条。** 常被引用为 2.8 节，但公开条款页是脚本渲染的，我抓不到正文，所以没有引用任何条文原文，也不对 Git 托管流量是否受它约束下结论。

## 结语

把这次的结果总结成一句：**官方二进制可以零外部依赖地在普通账号下跑起来，数据用 SQLite 落在本机目录，再通过 Cloudflare Tunnel 发布到公网，公网侧的克隆与推送都能正常工作。** 这就是我验证过的全部范围。

两个附带的结论值得记下来。一是自建服务器并不等于“账号被封的保险”，因为 Git 是分布式的，每一次克隆本来就是一份完整历史的副本，真正抗封号的手段是本地多留一份镜像，成本接近零；自建带来的实际好处是“有一个规则和额度都由自己定的远端”。二是这次只验证了它能跑起来、能公网推拉，长期运维的那部分——备份、升级、机器可靠性——我一点都没有验证，那才是自建真正的成本所在。

关于 Git 本身的日常用法，可以看 [Git 使用指南](https://eggroll.pages.dev/p/git-使用指南/)。