---
title: 现代化系统重装教程 | Modern System Reinstallation Guide
description: 个人向系统重装完全指南，仅具有参考价值 | A personal system reinstallation guide, for reference only.
date: 2025-02-09
lastmod: 2025-07-01
image: keyboard.jpg
categories:
    - 技术
tags:
    - 重装
    - reinstallation
    - windows
    - pe
---

## 1. 说明 | Note

本文完全参照个人习惯，做不到事无巨细，但会逐渐更新完善。

This article is based entirely on personal habits and cannot cover every detail, but it will be gradually updated and improved.

## 2. 准备工作 | Preparation

### 2.1 备份驱动 | Backup Drivers

推荐采用 Dism++：<https://github.com/Chuyu-Team/Dism-Multi-language/releases>。最好在原本的系统内备份驱动，会得到更多有好的驱动名称而非乱码。当系统崩溃，不得不在 PE 中备份时，也是可以的，最终恢复起来效果应该一直。在系统内备份驱动可以剔除一些无关驱动，比如 VMware 安装的虚拟网卡。

I recommend using Dism++: <https://github.com/Chuyu-Team/Dism-Multi-language/releases>. It is best to back up drivers within the original system, as this will yield more meaningful driver names rather than garbled text. If the system crashes and you have to back up drivers in PE, it should still work well. Backing up drivers within the system can exclude irrelevant drivers, such as virtual network interfaces installed by VMware.

### 2.2 下载系统镜像 | Download System Image

下载系统镜像的方式多种多样，在如今，我已经完全不再推荐使用第三方修改过的系统。一个可供下载原版镜像的链接如下：<https://massgrave.dev/genuine-installation-media>

The method for downloading system images is varied, and nowadays, I no longer recommend using third-party modified systems. A link for downloading genuine installation media is as follows: <https://massgrave.dev/genuine-installation-media>

### 2.3 下载 Ventoy | Download Ventoy

Ventoy 是我个人很喜欢的一筐轻量化工具，几乎可以启动任何 ISO 镜像，这包括 Windows ISO、其他系统的 ISO，甚至是 PE 的 ISO。这一点大大简化了装系统工具的制作，也不再影响该 U 盘的日常使用，可谓终结了每做一次就要格式化一次 U 盘的时代。其下载链接如下：<https://www.ventoy.net/cn/download.html>

Ventoy is a lightweight tool that I personally like very much. It can boot almost any ISO image, including Windows ISO, other system ISOs, and even PE ISOs. This greatly simplifies the process of creating system installation tools and no longer affects the daily use of the USB drive, effectively ending the era of having to format the USB drive every time you want to install a system. The download link is as follows: <https://www.ventoy.net/cn/download.html>

#### 2.3.1 Ventoy 的使用 | Using Ventoy

1. 制作 Ventoy 盘
2. 放入镜像
3. 放入备份的驱动包

## 系统安装

1. 推荐：下载其他 PE ISO 镜像，再使用 PE 完成系统安装，推荐`微 PE`
2. 直接调用微软原版镜像完成安装（不推荐，若采用此方法，后文驱动注入步骤将在一定程度上失去意义）

## 驱动注入

在 PE 中用 Dism++ 注入驱动。

完成此步后即可拔下 U 盘。

## 重启

重启系统。

## 激活 Windows

管理员启动`终端`或者`PowerShell`，输入

```powershell
irm https://get.activated.win | iex
```

## 常用软件部署

### Clash Verge Rev

<https://www.clashverge.dev/install.html>

### Bandzip

<https://www.bandisoft.com/bandizip/>

### Office

<https://gravesoft.dev/office_c2r_links#chinese-simplified-zh-cn>

#### 激活 Office

管理员启动`终端`或者`PowerShell`，输入

```powershell
irm https://get.activated.win | iex
```

### MyKeymap

<https://xianyukang.com/MyKeymap.html>

### Pot

<https://pot-app.com/>

### PixPin

<https://pixpin.cn/>

### Listary

<https://www.listary.com/>

### InputTip

<https://inputtip.abgox.com/>

### TrafficMonitor

<https://github.com/zhongyang219/TrafficMonitor/releases/>
