---
title: Git 个人使用指南
description:
date: 2025-06-27
lastmod: 2025-07-17
image: 终端.png
categories:
    - 技术
tags:
    - Git
    - 浅克隆
    - 命令行
---

## 引言

Git 是一个很好用的工具，不过目前的 Git 教程大多比较复杂，难以入门。在我看来，学习一个工具最好的方式就是从简单的使用开始，逐步深入。不管三七二十一，开始使用起来，才是最重要的。本文将介绍 Git 的一些基本用法，帮助你快速上手。

## 基本用法

从我目前的使用经历来看，新手入门不需要使用命令行。下载一个 VS Code，其内置了完善的 Git 图形化支持。新建一个仓库，再把按钮都点点、都查查，自然就能掌握很多基础用法。

在掌握一些基本术语后，就可以来玩一些进阶的、非命令不可的工具了。

### 克隆仓库

基本用法：

```powershell
git clone <repository-url>
```

#### 浅克隆

为什么要使用浅克隆？网络环境不佳时，克隆一个大仓库可能需要很长时间。浅克隆可以只克隆最新的提交记录，从而大幅度减少克隆时间和数据量。

```powershell
git clone --depth 1 <repository-url>
```

克隆的深度可以自行指定。

#### 浅克隆的问题

最近在浅克隆的时候发现了一个问题，那就是默认只克隆 `main` 分支，而不会克隆其他分支，这为我引入了额外的工作量。好在，查阅 Git 官方文档，我找到了一个解决方案，即加上 `--no-single-branch` 参数。

实际的命令类似：

```powershell
git clone --depth 1 --no-single-branch <repository-url>
```

`Git` 的官方文档表述如下：

> `--depth <depth>`
>
> Create a shallow clone with a history truncated to the specified number of commits. Implies `--single-branch` unless `--no-single-branch` is given to fetch the histories near the tips of all branches. If you want to clone submodules shallowly, also pass `--shallow-submodules`.
>
> `--depth <depth>`
>
> 创建一个浅克隆，保留特定数量的提交历史。默认情况下，会使用 `--single-branch`，除非使用 `--no-single-branch` 参数来获取所有分支的历史记录。如果你想要浅克隆子模块，也需要传递 `--shallow-submodules`。

所以，为了支持更多的情况，更加成熟的命令是：

```powershell
git clone --depth 1 --no-single-branch --recurse-submodules --shallow-submodules <repository-url>
```

浅克隆在速度上，类似于直接下载代码的压缩包。这是因为，常规的克隆通常会把所有历史记录都克隆下来，而其中可能包含被删除的文件。常规克隆的大小一般显著大于浅克隆。所以，使用浅克隆可以提升克隆的速度。然而，使用浅克隆会带来一些问题。比如，在开发过程中，如果签出到新分支，完成开发后再合并，可能会遇到没有共同提交历史而无法合并的问题。这其实很好解决，只需要使用 `git fetch --unshallow` 命令即可。该命令的意思是，以完整历史（unshallow，即非浅）的形式，抓取远程仓库的所有提交记录。

### 分支

分支是很重要、很有用的概念。分支可以让你在不影响主分支的情况下进行开发。创建分支的命令如下：

```powershell
git branch <branch-name>
```

切换分支的命令如下：

```powershell
git checkout <branch-name>
```

此部分教程日后再完善。
