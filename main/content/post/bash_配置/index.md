---
title: Git Bash 配置
description: 
date: 2025-02-21
lastmod: 2025-02-21
image: bash.png
categories:
    - 技术
tags:
    - 
---

Windows 上的默认终端改成 `Git Bash` 也已经有一段时间了，解决几个痛点。

在个人目录新建 `.inputrc` 文件，写入以下配置：

```config
set bell-style audible
set colored-completion-prefix on
set colored-stats on
set completion-ignore-case on
set show-all-if-ambiguous on
"\e[A": history-search-backward
"\e[B": history-search-forward
```

详细说明如下：

## 变量设置部分

### `set bell-style audible`

- **功能**：此配置用于控制当 Readline 想要发出提示信号时的响铃行为。`audible` 表示 Readline 会尝试使终端发出可听见的铃声。当你在命令行进行某些操作触发提示（如无法完成补全）时，终端会发出声音提醒你。
- **默认值**：我觉得是 `visible`，若终端支持可视响铃，会以可视方式提示，我就是因为删个文字，屏幕哗哗闪才改这个的。`audible`，会发出声音。如果设置为 `none`，则不会有任何效果。

### `set colored-completion-prefix on`

- **功能**：开启该配置后，在进行命令或文件补全操作，列出补全项时，Readline 会使用不同的颜色来显示可能补全项集合的公共前缀。

### `set colored-stats on`

- **功能**：当此配置开启，Readline 在显示可能的补全项时，会使用不同的颜色来区分它们的文件类型。例如，目录、可执行文件等可能会以不同颜色显示。通过颜色区分，能快速了解补全项的文件类型。

### `set completion-ignore-case on`

- **功能**：设置为 `on` 后，Readline 在进行文件名匹配和命令补全时将不区分大小写。这意味着你在输入命令或文件名的一部分进行补全时，不管输入的字母是大写还是小写，都能找到匹配项，大大提高了补全的便利性。
- **默认值**：默认是 `off`，补全时区分大小写。

### `set show-all-if-ambiguous on`

- **功能**：当按下 <kbd>Tab</kbd> 键进行补全，出现多个可能的补全选项（即存在歧义）时，此配置会让 Readline 直接列出所有可能的选项，而不是像默认情况那样再次按 <kbd>Tab</kbd> 才显示。这样你能第一时间看到所有可能的补全结果，方便选择。
- **默认值**：默认是 `off`，遇到歧义时需要再次按 <kbd>Tab</kbd> 才会显示所有选项。

## 键绑定部分

### `"\e[A": history-search-backward`

- **功能**：这里的 `"\e[A"` 代表键盘上的上箭头键 <kbd>↑</kbd>。此配置将上箭头键绑定到 `history-search-backward` 功能，即向前搜索历史命令。当你在命令行输入了部分命令内容后，按下上箭头键，Readline 会在历史命令中搜索以当前输入内容开头的命令，并逐步向前显示。
- **默认行为**：默认情况下，上箭头键只是简单地按顺序浏览历史命令，不考虑当前输入的内容。

### `"\e[B": history-search-forward`

- **功能**：`"\e[B"` 对应键盘上的下箭头键 <kbd>↓</kbd>。该配置把下箭头键绑定到 `history-search-forward` 功能，也就是向后搜索历史命令。当你使用上箭头键搜索历史命令后，再按下下箭头键，Readline 会反向搜索以当前输入内容开头的历史命令。
- **默认行为**：默认下箭头键同样是按顺序浏览历史命令，不关联当前输入内容。
