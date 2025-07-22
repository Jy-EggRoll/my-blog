---
title: Git 个人使用指南
description:
date: 2025-06-27
lastmod: 2025-07-17
image: 终端.png
categories:
    - 技术
tags:
    - git
    - 浅克隆
    - 命令行
---

## 浅克隆的问题

最近在浅克隆的时候发现了一个问题，那就是默认只克隆 `main` 分支，而不会克隆其他分支，这为我引入了额外的工作量。好在，查阅 Git 官方文档，我找到了一个解决方案，即加上 `--no-single-branch` 参数。

Recently, I encountered a problem while performing a shallow clone, which is that it only clones the `main` branch by default and does not clone other branches, adding extra workload for me. Fortunately, after consulting the official Git documentation, I found a solution: adding the `--no-single-branch` parameter.

实际的命令类似：

The actual command is similar to:

```powershell
git clone --depth 1 --no-single-branch <repository-url>
```

## 进一步的说明 | Further Explanation

`Git` 的官方文档表述如下：

The official documentation of `Git` states:

> `--depth <depth>`
>
> Create a shallow clone with a history truncated to the specified number of commits. Implies `--single-branch` unless `--no-single-branch` is given to fetch the histories near the tips of all branches. If you want to clone submodules shallowly, also pass `--shallow-submodules`.
>
> `--depth <depth>`
>
> 创建一个浅克隆，保留特定数量的提交历史。默认情况下，会使用 `--single-branch`，除非使用 `--no-single-branch` 参数来获取所有分支的历史记录。如果你想要浅克隆子模块，也需要传递 `--shallow-submodules`。

所以，为了支持更多的情况，更加成熟的命令是：

A more mature command to support various situations is:

```powershell
git clone --depth 1 --no-single-branch --recurse-submodules --shallow-submodules <repository-url>
```

## 个人对于浅克隆的理解 | My Understanding of Shallow Clone

浅克隆在速度上，类似于直接下载代码的压缩包。这是因为，常规的克隆通常会把所有历史记录都克隆下来，而其中可能包含被删除的文件。常规克隆的大小一般显著大于浅克隆。所以，使用浅克隆可以提升克隆的速度。然而，使用浅克隆会带来一些问题。比如，在开发过程中，如果签出到新分支，完成开发后再合并，可能会遇到没有共同提交历史而无法合并的问题。这其实很好解决，只需要使用 `git fetch --unshallow` 命令即可。该命令的意思是，以完整历史（unshallow，即非浅）的形式，抓取远程仓库的所有提交记录。

Shallow clone is similar to downloading a code archive in terms of speed. This is because a regular clone typically fetches all historical records, which may include deleted files. The size of a regular clone is generally significantly larger than that of a shallow clone. Therefore, using shallow clone can improve the cloning speed. However, using shallow clone can lead to some issues. For example, during development, if you check out a new branch and then merge after completing development, you may encounter issues with merging due to the lack of common commit history. This can be easily resolved by using the `git fetch -unshallow` command. This command means to fetch all commit records from the remote repository in a complete history (unshallow) manner, rather than a shallow one.
