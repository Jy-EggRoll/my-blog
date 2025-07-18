---
title: Windows on ARM 系统重装指南
description: 
date: 2025-02-14
lastmod: 2025-02-24
image: woa.png
categories:
    - 技术
tags:
    - WoA
    - Windows
    - 系统
    - 重装
    - 教程
---

## 引言

在 2025 年 2 月 14 日，我第一次通过 PE 的方式完成了 Windows on ARM 的重装，写一篇文章分享一下我的心得。

之前写过一篇类似的文章，请见[现代化系统重装教程](https://eggroll.pages.dev/p/%E7%8E%B0%E4%BB%A3%E5%8C%96%E7%B3%BB%E7%BB%9F%E9%87%8D%E8%A3%85%E6%95%99%E7%A8%8B/)。

## 前置工作

必须先备份设备的驱动。ARM 设备的驱动比较罕见，完全不带驱动重装系统极有可能出现严重问题。建议使用 Dism++。系统内和 PE 内进行驱动备份工作都是可以的。建议在系统内备份驱动，系统损坏到无法启动再考虑使用 PE 备份驱动。

## 使用的 PE

我使用的是：[CDBYDJ PE](https://bydjpe.winos.me/)。

![PE](PE.png)

感谢作者的付出，这也许是目前网络上能找到的唯一一款兼容众多 ARM 电脑的 PE。

## 下载最新镜像

推荐网址：<https://worproject.com/esd>

选择最新 ARM 镜像下载。

## 写入后导入备份好的全部驱动

这点和常规的 PE 内安装系统的步骤是一致的，大家自行选择喜欢的方法。

安装完成后，使用 Dism++ 向目标系统导入备份好的全套驱动。

重启。

自此，就完成了 ARM 系统的重装。
