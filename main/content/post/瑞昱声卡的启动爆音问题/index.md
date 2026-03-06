---
title: 瑞昱声卡的启动爆音问题
description: 
date: 2026-03-06
lastmod: 2026-03-06
image: 
categories:
    - 技术
tags:
    - 瑞昱
    - 声卡
weight: 
---

进入注册表项

```txt
计算机\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Class\{4d36e96c-e325-11ce-bfc1-08002be10318}\
```

瑞昱声卡在某个四位数字下，在我的电脑上，为

![位置](image.png)

判断方法就是图中红框处。

进入该条目后，将红框标出位置改为 `ffffffff`，重启即可。

![修改](image-1.png)
