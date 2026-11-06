---
title: Sandboxie Plus 删除沙盒出错：卡住的是一个没卸载的注册表 hive
slug: sandboxie-删除沙盒出错
description: 一次“删不掉沙盒内容”的排查记录，报错指向单个文件，真正的原因是沙盒注册表仍挂在 HKEY_USERS 下没有被卸载。
date: 2026-10-29
lastmod: 2026-10-29
image: 
categories:
    - 技术
    - 记录
tags:
    - Sandboxie
    - Windows
    - 注册表
weight: 
---

## 引言

右键沙盒选择“删除沙盒内容”，弹出来的是“删除沙盒文件夹出错：R:\Sandbox\EggRoll\RamDiskTest”，反复点，每次都停在同一个地方。到资源管理器里手动清理，整棵目录都能删，只有一个文件不行，提示“操作无法完成，因为文件已在 System 中打开”，它是盒根下的 RegHive，256 KB。

这篇记录一下最后查到的原因。

## 真正的原因

沙盒不只重定向文件，也重定向注册表。每个盒的注册表存成盒根下的 RegHive，运行时被加载成一个挂在 HKEY_USERS 下的配置单元，键名格式是 Sandbox_用户名_沙盒名。

我这台机器上就是这样一条：

```powershell
PS> reg query HKU | findstr /i Sandbox_
HKEY_USERS\Sandbox_EggRoll_RamDiskTest
```

Sandboxie 官方对 SBIE2208 的说明写得很直接：卸载沙盒注册表失败，典型状态码是 C0000121，含义是沙盒之外有程序正在使用它。说明里还有一句关键的话，只要注册表仍然加载在系统里，沙盒就无法被删除。

## 为什么它不会自己恢复

卸载动作只在盒内最后一个进程退出时尝试一次。按我读到的源码（commit 427c5b7），驱动把 hive 路径交给服务的同时，就把“待卸载”标记清掉了；服务那边重试一段时间仍然失败，只在消息日志里记一条 SBIE2208 就结束。想让它再试一次，得重新让进程进入这个盒再退出，或者注销、重启。

而“删除沙盒内容”这条路径里没有任何卸载 hive 的步骤，它只是从盒根开始递归删文件，碰到第一个失败项就整体中止。所以只要 RegHive 还被占用，点多少次删除都是同一个结果。

还有一处容易出问题的地方：判断盒内是否还有进程时，是按会话过滤的。别的会话里还留着这个盒的进程，当前会话就会认为盒已经空了，照样发起卸载，于是失败。

## 内存盘有关系吗

这次没有关系。hive 被占用与卷在哪里无关，RegHive 只是恰好放在内存盘上，换成系统盘一样会卡住。

不过内存盘会让后果更麻烦：如果内存盘在 hive 仍加载时被卸载或重建，它对应的后备文件就不见了，而关机时系统仍要把它写回，可能因此报错。

## 对系统有损害吗

没有。这只是 Windows 正常的“用户配置单元已加载”状态，与登录后加载的用户 hive 是同一回事，不涉及系统的 HKEY_LOCAL_MACHINE，也不影响开机。

要留意的只有两点。沙盒清不掉会一直占着空间；另外不要用强制解锁一类的工具去删一个已加载 hive 的后备文件，那会让这个 hive 变成半损坏状态，之后卸载时报错。影响范围仍限于这个沙盒。

## 处置

管理员命令行先确认键名：

```bat
reg query HKU | findstr /i Sandbox_
```

再卸载它：

```bat
reg unload "HKU\Sandbox_EggRoll_RamDiskTest"
```

成功后回 Sandboxie 点“删除沙盒内容”，一次就通过。我这边就是这两条命令解决的。

如果卸载时报拒绝访问，说明仍有进程持有它。可以用 Sysinternals 的 handle64 定位，或者直接注销当前账户、重启。

排障时还有一条建议：先把“监视盒大小”关掉。这个功能会在盒根挂一个目录句柄，而删除前的等待是以独占方式打开盒根，两者冲突时会一直等到超时，现象上像是删到一半卡住了。

## 如何避免再遇到

- 切换 Windows 账户或者用远程桌面之前，确认盒内进程已经退出。
- 不要跨账户共用同一个盒。
- 别让注册表监视、备份一类的工具长期挂着 HKEY_USERS 树。
- 再碰到“删除沙盒出错”，先去 HKEY_USERS 下找 Sandbox_ 开头的键，不要急着换版本或者找解锁工具。

## 补充

这个问题在仓库里有人报过，编号 #4985，至今仍是 open，也没有修复版本。我查了 1.18.8 的完整更新日志，其中没有相关条目。所以升级不能指望绕过去。

## 参考资料

- [SBIE2208 官方说明](https://sandboxie-plus.github.io/sandboxie-docs/Content/SBIE2208/)
- [issue #4985：Registry not unloaded before deleting sandbox causing error](https://github.com/sandboxie-plus/Sandboxie/issues/4985)
- [Sandboxie 源码](https://github.com/sandboxie-plus/Sandboxie)
