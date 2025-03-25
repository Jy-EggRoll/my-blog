---
title: 串流入门 | Getting started with Streaming
date: 2024-12-10
lastmod: 2025-03-19
image: 
categories:
    - 技术
tags:
    - 串流
    - 软件
    - Streaming
    - Software
---

## Sunshine 介绍 | Introduction to Sunshine

Sunshine 是一款用于串流的软件，可以理解为发送端。

Sunshine is a software for streaming, we can think it a software that push data.

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

<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>X</kbd> 用于决定显示模式为全屏还是窗口化，如果 Moonlight 启动后，Windows 的状态栏没有正常隐藏，该快捷键将会有助于解决此问题。
