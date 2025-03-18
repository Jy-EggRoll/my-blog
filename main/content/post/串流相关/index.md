---
title: Sunshine 入门
date: 2024-12-10
lastmod: 2025-03-18
image: 
categories:
    - 技术
tags:
    - 技术
    - 串流
    - 软件
---

## Sunshine 介绍

Sunshine 是一款用于串流的软件，可以理解为发送端。

### 校园网串流部署

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

### 禁用自启动

在服务中将 Sunshine 相关改为“手动”即可。

## Moonlight 介绍

Moonlight 可以视为对 Sunshine 数据的接收端。

### Windows 端 Moonlight 常用快捷键

<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>Q</kbd> 用于在串流后结束串流。

<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>E</kbd> 用于决定显示模式为全屏还是窗口化，如果 Moonlight 启动后，Windows 的状态栏没有正常隐藏，该快捷键将会有助于解决此问题。
