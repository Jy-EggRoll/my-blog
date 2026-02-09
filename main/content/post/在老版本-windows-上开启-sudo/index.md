---
title: 在老版本 Windows 上开启 sudo
description: 
date: 2026-02-09
lastmod: 2026-02-09
image: 
categories:
    - 技术
tags:
    - sudo
    - windows
weight: 
---

下载[提取自官方 24H2 版本的 sudo.exe](sudo.exe)，为了方便，我直接将其嵌入了我博客的静态文件，供我自己日后下载。

将 sudo.exe 加入可以被 Path 访问到的地方。

以管理员身份打开终端，运行：

```pwsh
sudo config --enable enable
```

即可以内联模式启用 sudo。
