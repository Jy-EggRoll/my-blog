---
title: Windows 远程桌面
description: 
date: 2026-02-27
lastmod: 2026-11-06
image: 
categories:
    - 技术
    - 杂谈
tags:
    - 
weight: 
---

启用远程桌面后，建议重启一次电脑，再评估远程桌面是否生效。

注册表中，远程连接的历史记录保存的位置为：`计算机\HKEY_CURRENT_USER\Software\Microsoft\Terminal Server Client\Servers`，其中每个条目的 `CertHash` 决定着是否发出证书警告。

远程桌面曾经出现过数次连接问题：Windows 11 23H2 连接北京邮电大学的 BUPT-mobile 时，开机后第一次往往连不上远程桌面，需要在锁屏界面手动连接一次网络才恢复，之后直到下次重启都不再出现。换成 BUPT-portal 之后没有再复现。

两个接入方式的技术路径不同。按[北邮迎新网的说明](https://welcome.bupt.edu.cn/info/1002/1001.htm)，BUPT-portal 用网页（Portal）认证，BUPT-mobile 用 802.1X 认证，首次连接要输入用户名和密码。802.1X 的用户级认证依赖用户登录之后的上下文，而 Windows 的网络配置文件默认只对当前用户生效，登录前连接（Single Sign On，原称 PLAP）默认关闭，所以开机后、登录前，网络通常还没有完成认证。远程桌面的 NLA 要求目标机在网络层可达，网络不通，连接就失败。锁屏时手动连一次，相当于在登录前的上下文里完成了一次认证，之后这个会话周期内都能用。BUPT-portal 是开放关联加网页认证，不依赖 802.1X 的用户凭据，开机即可关联，所以没有这个问题。

这不是 23H2 特有的缺陷。查 Windows 23H2 的 release health 页面，没有与远程桌面、NLA 或网络凭据相关的已知问题，现有证据指向 Windows 的通用行为，也就是无线配置文件的用户作用域与登录前连接开关，和系统版本关系不大。

但是实测，在 24H2 似乎又没有这个问题，暂时作为疑难杂症留档吧，短期不再探索。
