---
title: GNOME 按住 Super 用右键调整窗口大小
description: 用一条 gsettings 命令，让 GNOME 在按住 Super 时用右键直接调整窗口大小，而不是弹出窗口菜单。
date: 2026-10-22
lastmod: 2026-10-22
image: 
categories:
    - 技术
tags:
    - GNOME
    - Mutter
    - Linux
    - 桌面操作
weight: 
---

## 引言

我平时把 Super 键当作窗口操作的修饰键。按住 Super 再用右键点窗口，我原本以为会直接进入调整大小的状态，实际每次弹出的都是窗口菜单。这不是 GNOME 出了故障，而是 Mutter 的默认分工：按住修饰键时，右键负责弹菜单，中键负责调整大小。

查 Mutter 源码时我确认了这一点，也发现这两个按钮的角色可以互换。改一个布尔开关，右键就变成调整大小，菜单挪到中键。

## 一条命令

```shell
gsettings set org.gnome.desktop.wm.preferences resize-with-right-button true
```

这个键定义在 `org.gnome.desktop.wm.preferences` 里，类型是布尔值，默认是 false。设为 true 之后，按住 `mouse-button-modifier` 时，右键用来调整窗口大小，中键用来弹出窗口菜单。

`mouse-button-modifier` 决定按住的修饰键，GNOME 默认是 `<Alt>`，我的系统里被改成了 `<Super>`，所以下文都按 Super 说。

## 生效之后的操作

按住 Super 在窗口任意位置按下右键并拖动，窗口就跟着改变大小。窗口哪条边被调整，取决于按下右键时指针的位置：靠左边就调左边，靠右上角就同时调右边和上边。拖动过程中窗口大小实时变化，松开右键结束。

原来用来调整大小的中键，现在改为弹出窗口菜单。按配置键的分工，标题栏上不加修饰键直接点右键，仍然是窗口菜单。键盘上的 Alt+Space 也仍然可以打开窗口菜单。

这个改动立即生效，不需要注销或重启 Shell。X11 和 Wayland 会话都适用：X11 下 Mutter 在窗口上抓取按钮来接收事件，Wayland 下它本身就是合成器，事件会直接交给它，两种会话都能走到这段按钮分派。

## Mutter 里这个开关做了什么

修饰键本身由 `mouse-button-modifier` 决定，按住它之后，Mutter 按按钮分派三种操作：按钮 1 用于移动窗口；resize 按钮进入调整大小的抓取状态；菜单按钮弹出窗口菜单。

`resize-with-right-button` 只改一件事：resize 按钮和菜单按钮分别是哪个。Mutter 42 的源码里，`src/core/prefs.c` 的两个函数把这件事写得很直白：

- `meta_prefs_get_mouse_button_resize()` 返回 `resize_with_right_button ? 3 : 2`
- `meta_prefs_get_mouse_button_menu()` 返回 `resize_with_right_button ? 2 : 3`

也就是说，开关打开时按钮 3（右键）负责调整大小，按钮 2（中键）负责菜单；关闭时反过来。

真正处理按钮事件的代码在 `src/core/window.c`。按住修饰键时，按钮 1 进入移动，`meta_prefs_get_mouse_button_resize()` 返回的那个按钮进入调整大小的抓取状态，`meta_prefs_get_mouse_button_menu()` 返回的那个按钮调用窗口菜单。调整大小的方向由指针位置决定，源码里按指针在窗口中的位置挑出要调整的边或角。调整大小的抓取状态一直保持到松开按钮，所以这是按住拖动的操作。

## 限制

第一，只能把中键和右键互换。左键在按住修饰键时永远是移动窗口，想把它改成调整大小做不到，按钮 4 和 5 也没有对应的分派。源码里只有这三个按钮的分支。

第二，它是按住拖动的操作。按下开始，松开结束，单击之后松开不会让窗口停在某种等待拖动的状态。

第三，窗口菜单换了触发方式。如果你习惯在窗口内容区域按住修饰键点右键找菜单，现在会变成调整大小；要找菜单得换中键，或者去标题栏直接右键，或者用 Alt+Space。

## 回退

```shell
gsettings set org.gnome.desktop.wm.preferences resize-with-right-button false
```

改回去之后，右键弹菜单、中键调整大小的默认分工就恢复了，同样是立即生效。

## 我查了但没有逐项核实的部分

我只对照了 Mutter 42 的源码（gnome-42 分支）。GNOME 44 及更高版本我没有逐行读过，`resize-with-right-button` 这个键在各版本里是否一直保留、行为是否完全一致，我不确定。如果你用的是更新的 GNOME，值得先确认这个键还在。

“立即生效”这一条，我在自己的系统上改完没有重启 Shell，操作当场就是新行为，源码里也有对应的机制：配置变化会回写到静态变量，事件处理时再读取。但我没有对生效时间做过精确测量，也没有反复切换来观察边界情况。

我在 GNOME 扩展站点上找过有没有现成的“右键直接调整大小”扩展，没有找到符合要求的。GitHub 上有一个思路类似的项目，我看了源码，里面有明显的遗漏（用到了没有导入的模块），但没有在真实的 GNOME 里安装验证过，所以不推荐。

标题栏上的普通右键是否和这个开关完全独立，我是从两个配置键的职责推断的：`action-right-click-titlebar` 默认是 menu，与按钮分派是两个不同的配置项。但我没有逐行确认两者在事件流程里的先后顺序。

还有一点：X11 和 Wayland 两种会话我都写成了适用，这是从 Mutter 作为合成器的机制推断的。我实际只用过自己系统的会话，另一种会话没有亲手验证。

这个开关是 Mutter 的，只对 GNOME 以及同样使用 Mutter 的桌面有效。KDE、Xfce 或其他窗口管理器有自己的窗口操作配置，不在本文范围内。
