---
title: Sunshine 入门
date: 2024-12-10
lastmod: 2025-02-07
image: sun-979325.jpg
categories:
    - 技术
tags:
    - 技术
    - 串流
    - 软件
---

## Sunshine 介绍

Sunshine 是一款用于串流的软件。

## 校园网串流部署

管理员运行 `PowerShell` 分别输入以下命令放行 `Moonlight` 所需要的端口：

```powershell
netsh advfirewall firewall add rule name="GameStream UDP" dir=in protocol=udp localport=5353,47998-48010 action=allow
netsh advfirewall firewall add rule name="GameStream TCP" dir=in protocol=tcp localport=47984,47989,48010 action=allow
```

如果你想删除这两个规则请分别输入以下命令：

```powershell
netsh advfirewall firewall delete rule name="GameStream UDP"
netsh advfirewall firewall delete rule name="GameStream TCP"
```

以上方法参考自：<https://www.gmero.com/p/13>

## 禁用自启动

在服务中将 Sunshine 相关改为“手动”即可。
