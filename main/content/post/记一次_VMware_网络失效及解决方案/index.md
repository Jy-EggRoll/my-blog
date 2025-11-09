---
title: 记一次 VMware 网络失效及解决方案
description: 
date: 2025-09-21
lastmod: 2025-11-05
image: 
categories:
    - 记录
tags:
    - VMware
weight: 
---

安装 VMware 不要开 TUN 模式或者同类技术，如果开启，将有可能导致 VMware 的 DHCP 服务和 NAT 服务不可用（甚至无法手动启动），此时将不得不在 VMware 网络选项中重置网络。

第一，这非常不方便。第二，我难以预估是否还出现了其他的问题。所以，在安装 VMware 时手动关闭**所有**网络相关软件是明智的选择。
