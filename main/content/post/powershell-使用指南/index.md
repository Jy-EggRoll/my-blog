---
title: PowerShell 使用指南
description: 主环境为 Windows Terminal
date: 2025-07-26
lastmod: 2025-08-10
image: 
categories:
    - 技术
tags:
    - PowerShell
    - 终端
    - 美化
weight: 
---

## 引言

Windows Terminal 是一个现代化的终端应用程序，支持多种命令行工具和 shell，包括 PowerShell。通过对 PowerShell 的配置，可以提升使用体验，使其更符合个人喜好。

## 我的配置

### Windows Terminal 颜色与主题

- 主题（放入 profiles 下的 defaults）

```json
"colorScheme": 
{
    "dark": "Catppuccin Frappe",
    "light": "Catppuccin Latte"
},
```

- 配色方案

```json
"schemes": 
    [
        {
            "background": "#303446",
            "black": "#51576D",
            "blue": "#8CAAEE",
            "brightBlack": "#626880",
            "brightBlue": "#8CAAEE",
            "brightCyan": "#81C8BE",
            "brightGreen": "#A6D189",
            "brightPurple": "#F4B8E4",
            "brightRed": "#E78284",
            "brightWhite": "#A5ADCE",
            "brightYellow": "#E5C890",
            "cursorColor": "#F2D5CF",
            "cyan": "#81C8BE",
            "foreground": "#C6D0F5",
            "green": "#A6D189",
            "name": "Catppuccin Frappe",
            "purple": "#F4B8E4",
            "red": "#E78284",
            "selectionBackground": "#626880",
            "white": "#B5BFE2",
            "yellow": "#E5C890"
        },
        {
            "background": "#EFF1F5",
            "black": "#5C5F77",
            "blue": "#1E66F5",
            "brightBlack": "#ACB0BE",
            "brightBlue": "#1E66F5",
            "brightCyan": "#179299",
            "brightGreen": "#40A02B",
            "brightPurple": "#EA76CB",
            "brightRed": "#D20F39",
            "brightWhite": "#BCC0CC",
            "brightYellow": "#DF8E1D",
            "cursorColor": "#DC8A78",
            "cyan": "#179299",
            "foreground": "#4C4F69",
            "green": "#40A02B",
            "name": "Catppuccin Latte",
            "purple": "#EA76CB",
            "red": "#D20F39",
            "selectionBackground": "#ACB0BE",
            "white": "#ACB0BE",
            "yellow": "#DF8E1D"
        }
    ],
```

### PowerShell `$PROFILE` 配置

由终端调用的 PowerShell 和在装了 PowerShell 扩展的 VS Code 中调用的 PowerShell 有所不同，初始化配置文件是不同的。您可以简单地在终端中输入 `$profile` 来获取当前 PowerShell 初始化配置文件的精确位置。值得注意的是，PowerShell 变量名不区分大小写，`$PROFILE`、`$Profile`、`$profile` 指向的文件路径都是一致的，只不过根据调用者的不同，可能是全局或 VS Code 专属的。

我的配置文件繁多，并且，随着我的使用，我在不断地调整我的配置，所以目前配置都在 GitHub 的私有仓库中。一旦开发成熟，我就同步到文章之中。
