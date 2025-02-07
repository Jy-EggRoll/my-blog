---
title: 用于博客自动构建的脚本
description: 仅有参考价值
date: 2025-02-06
image: computer.jpg
categories:
    - 技术
tags:
    - hugo
    - bash
---

## 说明

本文只供作者本人使用，仅有参考价值。

踩了无数次的坑，终于把这个脚本写好了；误删了好几次文件，幸好有 `Git`！

此脚本必须在 `main` 文件夹内使用！

## 思想及脚本代码

```bash
# 检测当前目录是否为 main 目录
current_dir=$(basename "$(pwd)")
if [ "$current_dir" != "my-blog" ]; then
    echo "当前不在 main 目录内，防止误删文件，脚本终止。"
    exit 1
fi

# 先删除已有的发行文件
rm -rf public

# 再执行 hugo 创建出公开发布的文件
hugo

# 回到上一级目录
cd ..

# 强制删除和 main 同级的所有文件和文件夹（main、my-blog.code-workspace、隐藏文件夹和 README.md 除外）
find . -maxdepth 1 \( ! -name 'main' -a ! -name 'my-blog.code-workspace' -a ! -name '.' -a ! -name '.*' -a ! -name 'README.md' \) -exec rm -rf {} +

# 把 main 里的 public 文件夹的内容复制到和 main 同级
cp -r main/public/. .

# 回到 main 目录
cd main

echo "执行完成！"
```
