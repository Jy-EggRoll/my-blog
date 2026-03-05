---
title: Windows 远程桌面
description: 
date: 2026-02-27
lastmod: 2026-02-27
image: 
categories:
    - 技术
    - 杂谈
tags:
    - 
weight: 
---

启用远程桌面后，建议重启一次电脑，再评估远程桌面是否生效。

注册表中，远程连接的历史记录保存的位置为：`计算机\HKEY_CURRENT_USER\Software\Microsoft\Terminal Server Client\Servers`，其中每个条目的 `CertHash` 决定着是否发出证书警告。

远程桌面存在一些问题，在 Windows 连接到需要依靠用户名和密码登录的网络时，常常出现第一次开机后无法调用远程桌面的情况，需要在锁屏界面连接一次网络后才可以恢复正常，直到下次重启，都不会再出现连接问题。
