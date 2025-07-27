---
title: 串流教程
date: 2024-12-10
lastmod: 2025-06-27
image: 
categories:
    - 技术
tags:
    - 串流
    - 软件
    - sunshine
    - moonlight
---

## 引言

串流是指将数据从一个地方传输到另一个地方的过程。在计算机领域，串流通常指的是将音频、视频或其他数据从服务器传输到客户端的过程。本文将介绍如何在校园网环境下使用 Sunshine 和 Moonlight 进行串流。

## Sunshine 介绍

Sunshine 是一款用于串流的软件，可以理解为发送端。

### 校园网串流部署 | How to use it in School Net

管理员运行 `PowerShell` 输入以下命令放行串流所需要的端口：

You should run `PowerShell` with the right of administrator, and put in commands below to ensure you enable the streaming.

```powershell
netsh advfirewall firewall add rule name="GameStream UDP" dir=in protocol=udp localport=5353,47998-48010 action=allow
netsh advfirewall firewall add rule name="GameStream TCP" dir=in protocol=tcp localport=47984,47989,48010 action=allow
```

如果你想删除这两个规则请输入以下命令：

If you want to delete them, put in commands below.

```powershell
netsh advfirewall firewall delete rule name="GameStream UDP"
netsh advfirewall firewall delete rule name="GameStream TCP"
```

以上方法参考自：<https://www.gmero.com/p/13>

The methods is from <https://www.gmero.com/p/13>, thanks the author.

### 禁用自启动 | How to disable self-start

在服务中将 Sunshine 相关改为“手动”即可。

You should set the servers of sunshine in the server.msc to

## Moonlight 介绍 | Introduction to Moonlight

Moonlight 可以视为对 Sunshine 数据的接收端。

We can take Moonlight a reciever of Sunshine.

### Windows 端 Moonlight 常用快捷键 | Useful shortkeys of Moonlight on Windows

<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>Q</kbd> 用于在串流后结束串流。

<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>Q</kbd> is used to end the streaming after you start it.

<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>X</kbd> 用于决定显示模式为全屏还是窗口化，如果 Moonlight 启动后，Windows 的状态栏没有正常隐藏，该快捷键将会有助于解决此问题。

<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>X</kbd> is used to toggle the display mode between fullscreen and windowed. If the Windows taskbar is not hidden properly after starting Moonlight, this shortcut can help resolve the issue.
