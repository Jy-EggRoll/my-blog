---
title: 简易串流教程
date: 2024-12-10
lastmod: 2025-07-27
image: 
categories:
    - 技术
tags:
    - 串流
    - 软件
    - Sunshine
    - Moonlight
---

## 引言

串流是指将数据从一个地方传输到另一个地方的过程。在计算机领域，串流通常指的是将音频、视频或其他数据从服务器传输到客户端的过程。本文将介绍如何在校园网环境下使用 Sunshine 和 Moonlight 进行串流。哔哩哔哩上有不少的串流教程，讲的基本很详细，所以有不少相关重复的内容我暂不会再赘述。

## Sunshine 介绍

Sunshine 是一款用于串流的软件，可以理解为发送端。该软件是开源软件，建议在具有高性能显卡（独立显卡或者核心显卡，建议独立显卡）的 x64 Windows 平台上使用。

### 校园网串流部署

校园网可以视为一个覆盖范围很广的内网，由于作者本人就读于北京邮电大学，该校校园网不收费且速度较快，在进行串流时具有得天独厚的优势。不过，如果不做任何处理，是无法查找到设备的。设置方法如下。

**管理员** 运行 `PowerShell` 输入以下命令放行串流所需要的端口：

> [!TIP]
>
> 如果您使用较新的 Windows 11，可以使用 `sudo`（需要开启）

```powershell
netsh advfirewall firewall add rule name="GameStream UDP" dir=in protocol=udp localport=5353,47998-48010 action=allow
netsh advfirewall firewall add rule name="GameStream TCP" dir=in protocol=tcp localport=47984,47989,48010 action=allow
```

如果你想删除这两个规则请输入以下命令：

```powershell
netsh advfirewall firewall delete rule name="GameStream UDP"
netsh advfirewall firewall delete rule name="GameStream TCP"
```

以上方法参考自：<https://www.gmero.com/p/13>

### 禁用自启动

在服务中将 Sunshine 相关改为“手动”即可。不过，很具我对相关资料的查找，如果您需要在串流中对宿主机进行重启操作，那么极不推荐关闭自启动。

## Moonlight 介绍

Moonlight 可以视为对 Sunshine 数据的接收端。该软件同样是开源软件，对性能的要求不高，且支持的平台极多，如 ARM64 Windows、ARMv7/v8/x86/x64 Android 等非主流平台。

### Windows 端 Moonlight 常用快捷键

<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>Q</kbd> 用于在串流过程中结束串流。

<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>X</kbd> 用于决定显示模式为全屏还是窗口化，如果 Moonlight 启动后，Windows 的状态栏没有正常隐藏，该快捷键将会有助于解决此问题。

## 其他用法

当作高清电脑副屏（可以达到原生最合适的分辨率）。注意，该情况下由于 Sunshine 的更新，目前互联网上其他教程有可能出现问题。

[TODO]

使用到的软件为 parsec-vdd，该软件还有一个妙用，可以用来防止高分屏切换时出现的窗口跳变问题。该问题不属于串流内容，我会新开一篇文章来介绍。
