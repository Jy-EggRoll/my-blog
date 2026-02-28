---
title: AMD 驱动问题记录
description: 
date: 2026-02-28
lastmod: 2026-02-28
image: 
categories:
    - 技术
    - 记录
tags:
    - 
weight: 
---

## 公认的稳定版本

- 2025.9.1
- 2025.12.1【当前尚未发现问题的版本】
- 2024.5.1

## UM780XTX

- 2025.9.1 版，在 23H2 上，使用 opencode 时，会频繁掉驱动
- 2026.1.1 版，存在严重问题，显示器 DDC/CI 失效，无游戏是 AMD Software 吃满核心、严重卡顿

驱动恢复后，鼠标无法点击的解决方法：<kbd>Win</kbd> + <kbd>L</kbd> 锁屏，再进入桌面，有概率恢复正常。

## 注意事项

AMD 驱动的安装程序可能有用户 `TEMP` 目录的判断逻辑，安装、升级驱动前，需要将用户 `TMP` 和 `TEMP` 改回 `%USERPROFILE%\AppData\Local\Temp`。
