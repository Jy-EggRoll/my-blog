---
title: PowerShell 配置
description: 
date: 2025-07-26
lastmod: 2025-07-26
image: 截图.png
categories:
    - 技术
tags:
    - PowerShell
    - 终端
    - 美化
weight: 
---

## 引言

本文适用于 PowerShell7。

## 我的配置

### 颜色与主题

颜色与主题在 `settings.json` 中配置。鉴于 PowerShell 的配置比较复杂，我不会直接给出完整的配置文件，而是提供一些关键的配置片段。

- 以最大化窗口启动（一级配置）

```json
    "launchMode": "maximized",
```

- 主题（一级配置 profiles 下的配置）

```json
        "defaults": 
        {
            "adjustIndistinguishableColors": "indexed",
            "colorScheme": 
            {
                "dark": "Catppuccin Frappe",
                "light": "Catppuccin Latte"
            },
            "experimental.rightClickContextMenu": true,
            "font": 
            {
                "face": "Maple Mono Normal NL NF"
            }
        },
```

- 配色方案与主题跟随系统（一级配置）

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
    "theme": "system",
```

### `$PROFILE` 配置

本配置实现了 Windows 下亮色暗色主题的自动切换。

```ps1
Import-Module Catppuccin

# 读取注册表中的主题设置
$themeMode = Get-ItemProperty -Path "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize" | Select-Object -ExpandProperty AppsUseLightTheme

# 转换为易读的状态描述
if ($themeMode -eq 1) {
    # "当前系统主题为：亮色模式"
    $Flavor = $Catppuccin['Latte']
} else {
    # "当前系统主题为：暗色模式"
    $Flavor = $Catppuccin['Frappe']
}
$PSStyle.FileInfo.Directory = $Flavor.Maroon.Foreground()

Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward
Invoke-Expression (&starship init powershell)

```
