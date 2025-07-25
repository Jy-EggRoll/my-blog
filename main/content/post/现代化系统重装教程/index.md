---
title: 现代化系统重装教程
description: 个人向系统重装完全指南，仅具有参考价值
date: 2025-02-09
lastmod: 2025-07-22
image: keyboard.jpg
categories:
    - 技术
tags:
    - 重装
weight: 1
---

## 说明

目前网络上鲜有使用全新技术、完善的系统重装教程。本文操作方式完全参照个人习惯，做不到事无巨细，但会逐渐更新完善。这也是我重装系统多年以来经验的系统梳理。

## 准备工作

### 备份驱动

推荐采用 Dism++：<https://github.com/Chuyu-Team/Dism-Multi-language/releases>。最好在原本的系统内备份驱动，会得到更多友好的驱动名称而非乱码。当系统崩溃，不得不在 PE 中备份时，也是可以的，最终恢复起来效果应该一致。在系统内备份驱动可以剔除一些无关驱动，比如 VMware 安装的虚拟网卡。

以下是详细说明：

![压缩包内容](压缩包内容.png)

解压全部内容到一个文件夹下。

![本体](本体.png)

根据系统体系架构选择，我选择 x64。弹出“是否允许更改”的 UAC 窗口，请选择“是”。

![协议](协议.png)

接受协议。

![驱动管理](驱动管理.png)

在首页如图位置打开驱动管理。

![一般情况](一般情况.png)

一般情况下，按照图示，选择某个文件夹导出即可完成备份。

然而，可能有一些由软件加载的驱动是我们不想要的，我总结了一些剔除原则：

1. 是否可以斩钉截铁地确认是“无用驱动”
2. 是否是“关键驱动”

![案例一](案例一.png)

经查看，该驱动是博通公司的，类型为网络适配器，非关键驱动。如果可以确认自己的电脑网卡不是博通的，那么该驱动就有可能是 VMware 的驱动之一（VMware 已被博通收购），此时就可以取消勾选。

![案例二](案例二.png)

此驱动是我自己加载的虚拟显示器驱动，显然不应该保留。

![案例三](案例三.png)

该驱动是 VMware 附属驱动，虽然是关键驱动，但是我可以保证之后不会用到或者需要重新安装 VMware，那么也需要移除。

> 值得注意的是，内置驱动通常不需要更改。在某些特殊情况下，建议备份内置驱动（比如安装 Windows on ARM），但是除非出现问题如无法开机，不要导入内置驱动。

### 下载系统镜像

下载系统镜像的方式多种多样，在如今，我已经完全不再推荐使用第三方修改过的系统。一个可供下载原版镜像的链接如下：<https://massgrave.dev/genuine-installation-media>

如果您希望使用更小的 ESD 格式，那么使用该网站：<https://worproject.com/esd>

下载时若弹出安全提示，请始终允许。上述两个网站的安全性是可以保障的。

> 下载结束后，务必校验，一旦镜像由于网络问题损坏，将产生无法预料的后果。

### 下载 Ventoy

Ventoy 是我个人很喜欢的一款轻量化工具，几乎可以启动任何 ISO 镜像，这包括 Windows ISO、其他系统的 ISO，甚至是 PE 的 ISO。这一点大大简化了装系统工具的制作，也不再影响该 U 盘的日常使用，可谓终结了每做一次就要格式化一次 U 盘的时代。其下载链接如下：<https://www.ventoy.net/cn/download.html>

如果您的电脑开启了安全启动，请参照这篇文章：<https://www.ventoy.net/cn/doc_secure.html>

#### Ventoy 的使用

![制作 Ventoy 介质](制作.png)

1. 制作 Ventoy 盘
2. 放入镜像（PE ISO、系统 ISO、ESD 等）
3. 放入备份的驱动包

## 系统安装

![微 PE](微_PE.png)

![生成 ISO](生成_ISO.png)

1. 推荐：下载其他 PE ISO 镜像，再使用 PE 完成系统安装，推荐`微 PE`
2. 直接调用微软原版镜像完成安装（不推荐，若采用此方法，后文驱动注入步骤将在一定程度上失去意义）

在 PE 中，使用 CGI 或 Windows NT 安装器安装镜像即可。

### 驱动注入

在 PE 中用 Dism++ 向刚安装好系统的分区注入驱动。

完成此步后即可拔下 U 盘。事实上，由于 PE 通常只是写入内存，如果您的镜像、驱动在其他硬盘分区，进入 PE 后，U 盘就已经是非必要的了。

### 重启

重启系统并等待驱动完成加载。

## 激活 Windows

管理员启动`终端`或者`PowerShell`，输入

```powershell
irm https://get.activated.win | iex
```

## 常用软件部署

以下是我常用的一些软件。

### Office

激活 Office：

管理员启动`终端`或者`PowerShell`，输入

```powershell
irm https://get.activated.win | iex
```

### MyKeymap

<https://xianyukang.com/MyKeymap.html>

### PixPin

<https://pixpin.cn/>

### Listary

<https://www.listary.com/>

### InputTip

<https://inputtip.abgox.com/>

### TrafficMonitor

<https://github.com/zhongyang219/TrafficMonitor/releases/>
