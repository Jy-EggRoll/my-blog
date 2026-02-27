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
