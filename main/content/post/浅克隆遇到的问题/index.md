---
title: Git 浅克隆遇到的问题以及解决方案
description:
date: 2025-06-27
lastmod: 2025-06-27
image:
categories:
    - 技术
tags:
    - git
    - 浅克隆
    - shallow clone
    - command
---

最近在浅克隆的时候发现了一个问题，那就是默认只克隆 main 分支，而不会克隆其他分支，这为我引入了额外的工作量。好在，经过对各种资料的查阅，我找到了一个解决方案，即加上 `--no-single-branch` 参数。

Recently, I encountered a problem while performing a shallow clone, which is that it only clones the main branch by default and does not clone other branches, adding extra workload for me. Fortunately, after consulting various resources, I found a solution: adding the `--no-single-branch` parameter.

实际的命令类似：

The actual command is similar to:

```powershell
git clone --depth 1 --no-single-branch <repository-url>
```
