---
title: 记一次 VMware 网络失效及解决方案
description: 
date: 2025-09-21
lastmod: 2025-09-21
image: 
categories:
    - 记录
tags:
    - 
weight: 
---

装 VMware 不要开 TUN 模式或者同类技术，如果开启，将有可能导致 VMware 的 DHCP 服务和 NAT 服务不可用，此时将不得不重置网络。
