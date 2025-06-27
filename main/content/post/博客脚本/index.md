---
title: 用于博客自动构建的脚本 | A Script for Automatic Blog Build
description: Bash 脚本，仅有参考价值 | Bash script, for reference only
date: 2025-02-06
lastmod: 2025-06-027
image:
categories:
    - 技术
tags:
    - hugo
    - bash
    - 脚本
    - script
---

## 最新说明 | Latest Note

目前，作者的主力 Shell 已经变为 PowerShell 7，此文章的内容不再维护。

Now, the author's main shell has changed to PowerShell 7, so the content of this article is no longer maintained.

## 说明 | Note

本文代码只供作者本人使用，仅有参考价值。

The code in this article is for the author's personal use only and has reference value only.

踩了无数次的坑，终于把这个脚本写好了；误删了好几次文件，幸好有 `Git`！

I have stepped into countless pitfalls and finally wrote this script; I accidentally deleted files several times, but fortunately I had `Git`!

此脚本必须在 `main` 文件夹内使用！

This script must be used within the `main` folder!

## 思想及脚本代码 | Idea and Script Code

```bash
# 检测当前目录是否为 main 目录 | Check if the current directory is the main directory
current_dir=$(basename "$(pwd)")
if [ "$current_dir" != "main" ]; then
    echo "当前不在 main 目录内，防止误删文件，脚本终止。"
    exit 1
fi

# 先删除已有的发行文件 | First, delete existing release files
rm -rf public

# 再执行 hugo 创建出公开发布的文件 | Then execute hugo to create the public release files
hugo

# 回到上一级目录 | Go back to the parent directory
cd ..

# 强制删除和 main 同级的所有文件和文件夹（main、my-blog.code-workspace、隐藏文件夹和 README.md 除外） | Force delete all files and folders at the same level as main (except for main, my-blog.code-workspace, hidden folders, and README.md)
find . -maxdepth 1 \( ! -name 'main' -a ! -name 'my-blog.code-workspace' -a ! -name '.' -a ! -name '.*' -a ! -name 'README.md' \) -exec rm -rf {} +

# 把 main 里的 public 文件夹的内容复制到和 main 同级 | Copy the contents of the public folder in main to the same level as main
cp -r main/public/. .

# 回到 main 目录 | Go back to the main directory
cd main

echo "执行完成！"
```
