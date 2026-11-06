---
title: 微软账户改密后，远程桌面为什么还认旧密码
description: 云端改了密码，本机的凭据不会跟着变。记一次排查，以及 Windows Hello 那个开关到底在管什么。
date: 2026-11-06
lastmod: 2026-11-06
image: 
categories:
    - 技术
tags:
    - Windows
    - 远程桌面
    - Windows Hello
weight: 
---

改完微软账户密码，远程桌面用新密码连不上，用旧密码反而进去了。第一反应是改错了密码，或者是缓存没清。查下来都不是，Windows 一直如此，微软也明确说过这是设计。

## 现象

账户是拿微软账户登录的，远程桌面的登录框里显示的身份形态是 `MicrosoftAccount\你的邮箱`。在 account.microsoft.com 上改完密码之后：

- 远程桌面输入新密码，认证失败。
- 输入旧密码，正常进入。
- 本机锁屏界面里没有“密码”这一项，只有 PIN 之类的方式。

第三条不是巧合，它和第一条是同一件事的两面。

## 本机存的是密码的派生值

Windows 做本地登录和网络认证时，不会每次都去问微软服务器。它在本机存了一份密码派生出来的数据，登录时把你输入的东西算一遍，跟这份数据比对。

官方文档写得很直接：

> When a user performs a local logon, their credentials are verified locally against a cached copy before being authenticated with an identity provider over the network. If the cache verification is successful, the user gains access to the desktop even if the device is offline. However, if the user changes their password in the cloud, the cached verifier isn't updated, which means that they can still access their local machine by using their old password.
>
> —— [Windows logon scenarios](https://learn.microsoft.com/en-us/windows-server/security/windows-authentication/windows-logon-scenarios)

翻译过来就是：云端改密，本机这份数据不跟着变，旧密码仍然能进。

## 远程桌面为什么也绕不开

远程桌面在认证阶段会把凭据送到目标机，由目标机自己验证。微软 Windows 认证团队的 Steve Syfuhs 写过完整流程：先做 NLA，再用 SPNEGO 协商，最后 CredSSP 把凭据加密送到目标机，目标机解密后交给自己的登录流程。

同一篇文章里还有一句：remote connections never go through cached logon。

所以远程桌面并不走“缓存登录”那条路，它走目标机自己的 SAM/NTLM。但结论一样：目标机拿来比对的，仍然是它自己存的那份派生值。旧密码没被换掉，新密码就进不来。

顺带解释一个常见误解：远程桌面验证的既不是“令牌”，也不是“实时向云端询问的密码”，而是本机保存的派生值。这也解释了为什么 PIN 不能用于远程桌面，它只在本机解锁。

## 微软的态度

2025 年 4 月，安全研究员 Daniel Wade 把这件事报告给微软安全响应中心。微软的答复是这属于设计决策，理由是保证设备长期离线时至少还有一个账户能登录，并称改代码会影响大量应用的兼容性。[Ars Technica 的报道](https://arstechnica.com/security/2025/04/windows-rdp-lets-you-log-in-using-revoked-passwords-microsoft-is-ok-with-that/)里有完整经过。

微软后来在文档里补了上面那段注解，但没有改变行为。

这意味着一个现实后果：改密码在短时间内削减不了旧密码的访问能力。如果怀疑密码泄露才去改，这段时间的风险是实打实的。

## 让本机跟上新密码

核心只有一件事：让本机用新密码完成一次在线的交互式密码验证。

前置条件是关掉“设置 → 账户 → 登录选项 → 为了提高安全性，在此设备上仅允许使用 Windows Hello 登录 Microsoft 账户”。这个开关打开时，登录界面不提供密码入口，也就没机会做这次验证。

然后锁屏，在登录界面选择“密码”，输入新密码登录一次。这一步会联网向微软账户服务核对，成功后本机那份派生值会被换掉。

之后再从别的设备连远程桌面：新密码应当通过，旧密码应当被拒。这一条一定要实测，不能只看登录界面是否放行。

需要说明的是，“交互式登录会把本机派生值写回”这句是推断。官方文档只写了“云端改密不会更新缓存”，没有写刷新时机或触发条件。实践里也有反例：有人本机已经能用新密码，远程桌面却仍然只认旧密码。所以做完务必验证。

## 那个开关到底在管什么

官方对它的描述是“remove the password option”：开启后，下次登录“你将没有使用密码的选项，只留下 Windows Hello 的面部、指纹或 PIN”。见 [Go passwordless in Windows](https://support.microsoft.com/en-us/windows/security/go-passwordless-in-windows)。

它的本质是设备级的凭据方式开关，不是账户设置：

- 它只影响这台机器的登录界面提供哪些认证方式。
- 它不删除密码本身，也不动 PIN。
- 它管不到远程桌面，那里本来就在收密码。
- 它和 account.microsoft.com 上的“无密码账户”不是一回事，后者才是账户级、会真的删掉密码。

微软推荐它，是因为对本地登录而言 PIN 更强：绑定设备、不出设备、由 TPM 保护。详见 [Windows Hello FAQ](https://learn.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/faq)。

关闭它的风险要分场景看：

- 物理接触设备：确实多出一条可猜的密码通道。
- 网络访问：没有新增。远程桌面本来就接受密码。
- 密码在别处泄露：关闭后，拿到密码的人可以在本机登录界面直接用。

有一点必须讲清楚：微软的官方文档里只有这个开关的收益，没有任何一段论述关闭它的风险。标成“推荐”是产品取向，不是有文档支撑的风险结论。上面的分析是按机制推的。

## PIN 比密码强在哪

官方给的理由有三条：PIN 绑定设备，拿到 PIN 没有设备也没用；PIN 只在本机，不上传，服务器没有副本；PIN 由 TPM 保护。

真正拉开差距的是第三条。TPM 的防猜解机制是：连续失败 32 次后锁定，之后每 10 分钟才恢复一次尝试机会，见 [TPM 基础文档](https://learn.microsoft.com/en-us/windows/security/hardware-security/tpm/tpm-fundamentals#anti-hammering)。

而密码这一侧，客户端默认的账户锁定阈值是 0，也就是永不锁定，见[账户锁定阈值文档](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/security-policy-settings/account-lockout-threshold)。差别不在密码复杂度，而在有没有硬件限速。

两个限定不能说漏。一，这套锁定策略管的是本机账户；微软账户的密码是在线验证，服务端有没有限速、限到什么程度，没有公开文档。二，账户锁定策略不防离线攻击，官方原文写着 offline password attacks are not countered by this policy setting。

## 忘记 PIN 之后

登录界面的 PIN 输入框下方，如果出现“我忘记了我的 PIN”，点它，验证账户身份，再设置新 PIN。这个选项只对微软账户可用，本地账户没有，见 [Change or reset your PIN in Windows](https://support.microsoft.com/en-us/windows/security/change-or-reset-your-pin-in-windows)。

如果那个链接没出现，官方给的路是先用密码登录，再去设置里重置。而“仅允许 Windows Hello”打开时，密码方式正好被移除。这就是这个开关唯一的实际风险：忘了 PIN、登录界面又没有那个链接、密码方式又被关掉，三条同时成立就进不去。

所以打开它之前，值得锁屏亲自看一眼链接在不在。

## 小结

- 改微软账户密码，不会立刻改变本机的登录凭据。
- 远程桌面验证的是本机保存的派生值，不是云端密码。
- 要让本机跟上，需要一次在线的密码登录；这一步官方没有写明，做完要实测。
- “仅允许 Windows Hello”是设备级开关，推荐的理由是 PIN 有 TPM 限速；关闭的风险主要是物理接触时多一条可猜的通道。
- 想用远程桌面入站，就必须留着密码方式，因为 Windows Hello 的凭据不能作为远程桌面的凭据。

如果长期用远程桌面，给远程访问单独建一个本地账户，比让它依赖微软账户的缓存更可控：本地账户的密码改了立刻生效，行为是文档化的，不会出现“云端改了、本机没动”这种时间差。
