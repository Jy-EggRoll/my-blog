---
title: Windows 完整特性的内存硬盘
description: 
date: 2026-03-18
lastmod: 2026-03-18
image: 
categories:
    - 技术
tags:
    - 内存
    - 内存盘
weight: 
---

## 引言

自从有了 32 GB 的内存的电脑之后，就可以使用内存的一部分挂载为硬盘，用于放置一些大的临时文件，用于减少固态硬盘的磨损。

最开始，选择了 [ImDisk](https://github.com/LTRData/ImDisk)，这个是官方仓库。ImDisk 的仓库并没有用户界面封装，所以采用了 <https://sourceforge.net/projects/imdisk-toolkit/files/>。

自此，我开始使用 RamDisk。

## 问题

当时在使用之初，只是对这个技术有初步的了解，并没有预料到会出现的问题。随着对 RamDisk 的深度使用，我遇到了以下问题：

- Listary 无法自动索引 RamDisk，因为 Listary 未将 RamDisk 视为真正的硬盘，而只是一个常规位置
  - Everything 是可以索引的，虽然二者本质一致（都是读取 NTFS 索引表），但是 Everything 默认可以索引特性不完整的 RamDisk（自然必须是 NTFS 文件系统），而 Listary 需要付费升级到高级版
- 使用 yazi 浏览 RamDisk 内的文件时，经常出现诡异的文件丢失和文件夹丢失问题（只是在 yazi 内消失）
- 将用户 `TEMP` 和 `TMP` 定向到 RamDisk 后，AMD 驱动安装失败
- pnpm 完全无法在 RamDisk 上使用
- 没有回收站

## 思考

上述问题中的最后一点尤其使我疑惑，这引导我开始深究这个问题。通过研究，我发现 ImDisk 的硬盘实现是不完整的，一些在磁盘级、文件系统级的高级操作无法在 RamDisk 上进行，如编程语言中封装的磁盘处理和信息获取函数。

pnpm 使用了大量 NTFS 文件系统级的高级操作，比如硬链接的前置检测（ImDisk 的硬链接、符号链接特性是可用的）不可用，从而导致 pnpm 完全不能运行。

## 解决

以上情况，大概率是因为 ImDisk 特性实现不完整，那么，如果能找到特性完整、能被识别为真实硬盘的 RamDisk 驱动，大多数问题都是可以解决的。

经过查找，我了解到 ImDisk 作者开发的后继软件 AIM，但是该软件本身大而全，封装了大量非必要的功能，显然是不合适的。让我惊喜的是，我发现了 <https://sourceforge.net/projects/aim-toolkit/>。

它的操作逻辑和 ImDisk Toolkit 没有任何区别，只是替换了底层驱动。

我安装了它并开始使用。

现在，磁盘管理器中，一个内存磁盘已经可见。

- Listary 无法自动索引 RamDisk，因为 Listary 未将 RamDisk 视为真正的硬盘，而只是一个常规位置【已解决，现在 Listary 可以自动索引】
  - Everything 是可以索引的，虽然二者本质一致（都是读取 NTFS 索引表），但是 Everything 默认可以索引特性不完整的 RamDisk（自然必须是 NTFS 文件系统），而 Listary 需要付费升级到高级版
- 使用 yazi 浏览 RamDisk 内的文件时，经常出现诡异的文件丢失和文件夹丢失问题（只是在 yazi 内消失）【已解决，未发现任何消失问题】
- 将用户 `TEMP` 和 `TMP` 定向到 RamDisk 后，AMD 驱动安装失败【未测试】
- pnpm 完全无法在 RamDisk 上使用【已解决，完全正常】
- 没有回收站【已解决，但是释放内存还需要彻底删除文件】
