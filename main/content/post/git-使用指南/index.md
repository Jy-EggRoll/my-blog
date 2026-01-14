---
title: Git 使用指南
description:
date: 2025-06-27
lastmod: 2026-01-14
image: 终端.png
categories:
    - 技术
tags:
    - Git
    - 浅克隆
    - ignore 规则
    - 代理
---

## 引言

Git 是一个很好用的工具，不过目前的 Git 教程大多比较复杂，难以入门。在我看来，学习一个工具最好的方式就是从简单的使用开始，逐步深入。不管三七二十一，用起来，才是最重要的。本文将介绍 Git 的一些基本用法，帮助您快速上手。该教程完全以**实用**为出发点，且会不断更新。

当您使用 Git 一段时间后，可能就会被 Git 的一些写法所困扰，这时本文仍然有用，可以用作一些参考。

## 命令速览


```shell
git clone --depth 1 --no-single-branch --recurse-submodules --shallow-submodules https://github.com/Jy-EggRoll/
```

这将快捷复制我名下的仓库（在后面加上仓库名即可），并保持“一层浅克隆”“多分支克隆（每个分支都是浅的）”“递归子模块克隆”“子模块浅克隆”，直接解决基本的仓库初始化问题，又能保证克隆的性能。

## 基本用法

从我目前的使用经历来看，新手入门若使用命令行会大大增加入门的难度。我的建议是使用 VS Code，其内置了完善的 Git 图形化支持。

新建一个仓库，熟悉每个按钮、每个功能，自然就能掌握很多基础用法。

在掌握基本操作语后，就可以学习进阶操作了。

### 克隆仓库

基本用法：

```shell
git clone <repository-url>
```

倘若您希望更改文件夹的名字，只需要在仓库连接后面追加参数即可。不过，我不推荐直接克隆仓库，详细阐述见下文。

#### 浅克隆

为什么要使用浅克隆？网络环境不佳（[参见此节](#设置代理)）时，克隆一个大仓库可能需要很长时间。浅克隆可以只克隆最新的提交记录，从而大幅度减少克隆时间和数据量。

举个例子，假设某个仓库的文件结构有过极大的变动，克隆完整仓库可能要下载 100 MB 数据，而浅克隆可能只需要下载 10 MB。

```shell
git clone --depth 1 <repository-url>
```

克隆的深度可以自行指定。

#### 浅克隆的问题

浅克隆默认只克隆主分支，而不会克隆其他分支，这为会引入了额外的工作量。好在，查阅 Git 官方文档，我找到了一个解决方案，即加上 `--no-single-branch` 参数。

实际的命令类似：

```shell
git clone --depth 1 --no-single-branch <repository-url>
```

`Git` 的官方文档表述如下：

> `--depth <depth>`
>
> Create a shallow clone with a history truncated to the specified number of commits. Implies `--single-branch` unless `--no-single-branch` is given to fetch the histories near the tips of all branches. If you want to clone submodules shallowly, also pass `--shallow-submodules`.
>
> `--depth <depth>`
>
> 创建一个浅克隆，保留特定数量的提交历史。默认情况下，会使用 `--single-branch`，除非使用 `--no-single-branch` 参数来获取所有分支的历史记录。如果你想要浅克隆子模块，也需要传递 `--shallow-submodules`。

所以，为了支持更多的情况，更加成熟的命令是：

```shell
git clone --depth 1 --no-single-branch --recurse-submodules --shallow-submodules <repository-url>
```

浅克隆在速度上，类似于直接下载代码的压缩包。这是因为，常规的克隆通常会把所有历史记录都克隆下来，而其中可能包含被删除的文件。常规克隆的大小一般显著大于浅克隆。所以，使用浅克隆可以提升克隆的速度。然而，使用浅克隆会带来一些问题。比如，在开发过程中，如果签出到新分支，完成开发后再合并，可能会遇到没有共同提交历史而无法合并的问题。这其实很好解决，只需要使用 `git fetch --unshallow` 命令即可（或者对 `fetch` 追加 `--depth <number>` 参数）。该命令的意思是，以完整历史（unshallow，即非浅）的形式（或指定深度）抓取远程仓库的提交记录。

### `.gitignore` 文件规则速查表

熟练的 Git 用户总是避免不了使用 `.gitignore`文件，这是很重要的，我在这里放一个速查表：

| **匹配模式** | **说明** | **示例** |
|--------------|----------|----------|
| （空行） | 空行将被忽略 | 没有示例 |
| `# text comment` | 以 `#` 开头的行将被忽略 | 没有示例 |
| `name` | 所有名为 `name` 的文件、文件夹，以及任意 `name` 文件夹下的所有文件和子文件夹<br>**请注意，如果您想要忽略名为 `name` 的文件夹，请务必在其后加上 `/`，否则您会不小心忽略掉任意后缀名的以 `name` 为名的文件，如 `name.txt`，这可能是意料之外的情况** | `/name.log`<br>`/name/file.txt`<br>`/lib/name.log` |
| `name/` | 末尾带 `/` 表示该模式仅匹配文件夹，会匹配任意 `name` 文件夹下的所有文件和子文件夹 | `/name/file.txt`<br>`/name/log/name.log`<br><br>**不匹配：**<br>`/name.log` |
| `name.file` | 所有名为 `name.file` 的文件 | `/name.file`<br>`/lib/name.file` |
| `/name.file` | 以 `/` 开头表示该模式仅匹配**根目录**下的 `name.file` 文件 | `/name.file`<br><br>**不匹配：**<br>`/lib/name.file` |
| `lib/name.file` | 指定特定文件夹下文件的匹配模式，始终**相对于根目录**（即使不以 `/` 开头） | `/lib/name.file`<br><br>**不匹配：**<br>`name.file`<br>`/test/lib/name.file` |
| `**/lib/name.file` | `/` 前加 `**` 表示匹配仓库中的**任意层级文件夹**，不局限于根目录 | `/lib/name.file`<br>`/test/lib/name.file` |
| `**/name` | 所有名为 `name` 的文件夹，以及任意 `name` 文件夹下的所有文件和子文件夹 | `/name/log.file`<br>`/lib/name/log.file`<br>`/name/lib/log.file` |
| `/lib/**/name` | 所有位于 `lib` 文件夹及其任意子文件夹下的 `name` 文件夹，以及这些 `name` 文件夹内的所有文件和子文件夹 | `/lib/name/log.file`<br>`/lib/test/name/log.file`<br>`/lib/test/ver1/name/log.file`<br><br>**不匹配：**<br>`/name/log.file` |
| `*.file` | 所有**后缀为 `.file`** 的文件 | `/name.file`<br>`/lib/name.file` |
| `*name/` | 所有**名称以 `name` 结尾**的文件夹 | `/lastname/log.file`<br>`/firstname/log.file` |
| `name?.file` | `?` 匹配**单个任意字符** | `/names.file`<br>`/name1.file`<br><br>**不匹配：**<br>`/names1.file` |
| `name[a-z].file` | `[范围]` 匹配**范围内的单个字符**（此例为 a-z 的字母，也可匹配数字） | `/names.file`<br>`/nameb.file`<br><br>**不匹配：**<br>`/name1.file` |
| `name[abc].file` | `[字符集]` 匹配**字符集中的单个字符**（此例为 a、b、c 中的任意一个） | `/namea.file`<br>`/nameb.file`<br><br>**不匹配：**<br>`/names.file` |
| `name[!abc].file` | `[!字符集]` 匹配**不在字符集中的单个字符**（此例为除 a、b、c 外的任意字符） | `/names.file`<br>`/namex.file`<br><br>**不匹配：**<br>`/namesb.file` |
| `*.file`<br>`!name/secret.log` | `!` 表示**取反或例外规则**，匹配所有 `name` 文件夹下的文件和子文件夹，但排除 `name/secret.log` | `/name/file.txt`<br>`/name/log/name.log`<br><br>**不匹配：**<br>`/name/secret.log` |
| `*.file`<br>`!name.file` | `!` 表示取反或例外规则，匹配所有后缀为 `.file` 的文件，但排除 `name.file` | `/log.file`<br>`/lastname.file`<br><br>**不匹配：**<br>`/name.file` |
| `*.file`<br>`!name/*.file`<br>`junk.*` | 在取反规则后添加新的匹配模式，会重新忽略之前被排除的文件<br>匹配所有后缀为 `.file` 的文件，但排除 `name` 文件夹下的 `.file` 文件；若文件名为 `junk` 开头则仍会匹配 | `/log.file`<br>`/name/log.file`<br><br>**不匹配：**<br>`/name/junk.file` |

### 分支

分支是很重要、很有用的概念。分支可以让你在不影响主分支的情况下进行开发。创建分支的命令如下：

```shell
git branch <branch-name>
```

切换分支的命令如下：

```shell
git checkout <branch-name>
```

倘若熟悉 VS Code，分支的切换可以在提交框的小按钮中完成。

### 设置代理

由于网络原因，经常会出现克隆、拉取、推送失败的情况。这是由于 Git 默认不使用系统代理（通常情况下，浏览器基本都严格遵循系统代理，但其他软件不能保证）。最简单的方法是在相关软件中开启“Tun”模式（或称虚拟网卡模式）。该模式的原理是，为电脑创建一张虚拟网卡，一切要访问互联网的请求都要经过这张虚拟网卡的处理。所以，对于不走系统代理的 Git，自然也可以被妥善处理。该方法的缺点是，判断一切流量，所以性能较差。纵使如此，这仍然是我最推荐的方法。

如果读者实在难以实现上述方法，有没有办法为 Git 单独设置代理呢？如果在中文搜索引擎查阅，恐怕你要失望了。查到的内容错漏百出，几乎全部来源于复制粘贴与 AI 生成。知乎的评论区下面，有这么一条评论：

![评论](image.png)

我深表赞同。

本博客初心不改，我们来看看如何解决这个问题。我的配置是：

```shell
git config --global proxy.http localhost:10808
```

对于此选项的分析，我更愿意留到之后做系统梳理，今天先写到这里。

读者只需要知道，`localhost` 代表一个特定的本机环回地址，而 10808 是如 Clash、V2RayN 等软件使用的 HTTP 端口或混合端口，需要自行根据实际情况修改。

可以尝试此方法，但是在 VS Code 中的终端使用可能会有诡异的问题。不出意外的话，VS Code 终端对于该代理的相应需要重启电脑才能生效。我已经见怪不怪了，毕竟 VS Code 对于环境变量的更新也是需要重启电脑才能生效的。我曾多次查找为什么会出现这个问题，但始终没有找到合理的答案。如果您对此有了解，欢迎和我邮件探讨（<JyEggRoll@outlook.com>）。
