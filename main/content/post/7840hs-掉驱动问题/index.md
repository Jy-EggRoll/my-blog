---
title: 7840HS 掉驱动问题
description: 
date: 2026-02-27
lastmod: 2026-02-28
image: 
categories:
    - 技术
    - 记录
tags:
    - AMD
    - 驱动
weight: 
---

## 重置显卡的快捷键

快速重置显卡的快捷键：<kbd>Win</kbd> + <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>

## 描述

主要出现问题的机型信息如下：

```txt
Host Name:                 UM780XTX
OS Name:                   Microsoft Windows 11 专业工作站版
OS Version:                10.0.22631 N/A Build 22631
OS Manufacturer:           Microsoft Corporation
OS Configuration:          Standalone Workstation
OS Build Type:             Multiprocessor Free
Registered Owner:          EggRoll
Registered Organization:   N/A
Original Install Date:     26.02.25 周三, 下午 16:56:22
System Boot Time:          26.02.28 周六, 上午 08:59:17
System Manufacturer:       Micro Computer (HK) Tech Limited
System Model:              Venus series
System Type:               x64-based PC
Processor(s):              1 Processor(s) Installed.
                           [01]: AMD64 Family 25 Model 116 Stepping 1 AuthenticAMD ~3801 Mhz
BIOS Version:              American Megatrends International, LLC. 1.06, 24.03.28 周四
Windows Directory:         C:\Windows
System Directory:          C:\Windows\system32
Boot Device:               \Device\HarddiskVolume1
System Locale:             zh-cn;Chinese (China)
Input Locale:              zh-cn;Chinese (China)
Time Zone:                 (UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi
Total Physical Memory:     30,513 MB
Available Physical Memory: 24,362 MB
Virtual Memory: Max Size:  35,377 MB
Virtual Memory: Available: 27,200 MB
Virtual Memory: In Use:    8,177 MB
Page File Location(s):     C:\pagefile.sys
Domain:                    WORKGROUP
Logon Server:              \\UM780XTX
Hotfix(s):                 4 Hotfix(s) Installed.
                           [01]: KB5066133
                           [02]: KB5027397
                           [03]: KB5066793
                           [04]: KB5066792
Network Card(s):           5 NIC(s) Installed.
Hyper-V Requirements:      A hypervisor has been detected. Features required for Hyper-V will not be displayed.
```

当前，已经测试性地开启了 BIOS 设置中的“性能模式”，待观察。

当前，每次出现掉驱动的时候，总是在 opencode 运行中的时候，不得不怀疑该软件可能会影响显卡驱动的稳定性，这有待进一步观察测试。
