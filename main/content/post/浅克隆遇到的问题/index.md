---
title: Git 浅克隆遇到的问题以及解决方案
description:
date: 2025-06-27
lastmod: 2025-06-27
image: 终端.png
categories:
    - 技术
tags:
    - git
    - 浅克隆
    - shallow clone
    - command
weight: 1
---

最近在浅克隆的时候发现了一个问题，那就是默认只克隆 main 分支，而不会克隆其他分支，这为我引入了额外的工作量。好在，经过对各种资料的查阅，我找到了一个解决方案，即加上 `--no-single-branch` 参数。

Recently, I encountered a problem while performing a shallow clone, which is that it only clones the main branch by default and does not clone other branches, adding extra workload for me. Fortunately, after consulting various resources, I found a solution: adding the `--no-single-branch` parameter.

实际的命令类似：

The actual command is similar to:

```powershell
git clone --depth 1 --no-single-branch <repository-url>
```

`Git` 的官方文档表述如下：

The official documentation of `Git` states:

> `--depth <depth>`
>
> Create a shallow clone with a history truncated to the specified number of commits. Implies `--single-branch` unless `--no-single-branch` is given to fetch the histories near the tips of all branches. If you want to clone submodules shallowly, also pass `--shallow-submodules`.
>
> `--no-single-branch`
>
> 创建一个浅克隆，保留特定数量的提交历史。默认情况下，会使用 `--single-branch`，除非使用 `--no-single-branch` 参数来获取所有分支的历史记录。如果你想要浅克隆子模块，也需要传递 `--shallow-submodules`。

如此，更加成熟的命令是：

So the more mature command is:

```powershell
git clone --depth 1 --no-single-branch --recurse-submodules --shallow-submodules <repository-url>
```
