---
title: 现代化系统重装教程
description: 个人向系统重装完全指南，仅具有参考价值
date: 2025-02-09
lastmod: 2025-02-09
image: keyboard.jpg
categories:
    - 技术
tags:
    - 
---

## 说明

本文完全参照个人习惯，做不到事无巨细，但会逐步修改完善。

## 备份驱动

采用 Dism++：<https://github.com/Chuyu-Team/Dism-Multi-language/releases>。

## 下载系统镜像

<https://massgrave.dev/genuine-installation-media>

## 下载 Ventoy

<https://www.ventoy.net/cn/download.html>

## Ventoy 的使用

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
