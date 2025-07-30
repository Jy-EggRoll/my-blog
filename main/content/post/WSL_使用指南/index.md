---
title: WSL 使用指南
description: 
date: 2025-07-30
lastmod: 2025-07-30
image: 
categories:
    - 技术
tags:
    - WSL
weight: 
---

## 引言

WSL 是 Windows Subsystem for Linux 的缩写，它允许用户在 Windows 上运行 Linux 环境，包括大多数命令行工具、应用程序和服务。WSL 的出现使得开发者可以在 Windows 系统中无缝地使用 Linux 工具，提高了开发效率。本文的 WSL 指 WSL2。目前网上的其他教程和微软官方的翻译其实具有一定误导性（尤其是在安装 WSL 这个方面），本文将以英文原文为基础，提供更准确的 WSL 使用指南。

参考的英文原文的链接：

- <https://learn.microsoft.com/en-us/windows/wsl/install>

还有一些不吐不快的地方，就是微软的官方中文文档。这些文档大量使用 AI 翻译，有不少不准确、过时的文档内容，如果一直参阅中文文档，确实会出现一些显著的被误导的情况。

我的个人建议是始终参考英文文档，可以配合翻译插件如“沉浸式翻译”，但是在关键信息上一定要参考英文原文。获得英文原文的方法比较简单，把连接中的 `zh-ch` 换为 `en-us` 即可获得“一手”资料。

同样地，阅读完本文后，建议把参考链接中的内容同样阅读一次，作为本文的补充。

## WSL 的安装

WSL 在完全未安装时，可以通过 `wsl --install` 命令来安装。

> 注：需要管理员权限。虽然在非管理员情况下，该命令会自动提权，但是我遇到了一些奇怪的问题。所以还是建议直接以管理员身份运行 PowerShell 或 CMD。

该命令会自动安装 WSL 的各个组件，比如本体和虚拟机平台，无需手动启用功能。可是，安装后会默认捆绑 Ubuntu 发行版，而该发行版还可能会自动安装其商店软件（我在 Win 10 上遇到了这个问题）。首先，我对 Ubuntu 发行版不感兴趣且没有好感；其次，不经过我的同意，在我的软件列表中偷偷添加了我不想要的应用，更是令我深恶痛绝。为解决此问题，我从英文原文中查找到了相关信息：

> `--no-distribution`: Do not install a distribution when installing WSL.

在 WSL 尚未安装时，可以在 `wsl --install` 后面追加 `no-distribution` 参数，这样就可以取消掉默认安装 Ubuntu 发行版的行为。

在安装上，需要注意的点已经基本说明完毕。如果有其他问题，欢迎给我发邮件咨询（<JyEggRoll@outlook.com>）或者自行参阅官方的英文文档。

## WSL 的使用

有一些常用命令对应有缩写，可以简化输入。

- `wsl`：启动默认的发行版
- `wsl --help`：显示帮助信息
- `wsl --list --online`：列出可供安装的发行版，在线获取。简写为 `wsl -l -o`
- `wsl -list --verbose`：列出所有已安装的发行版及其状态，简写为 `wsl -l -v`
- `wsl -set-default <NameofDistribution>`：设定默认的发行版，简写为 `wsl -s <NameofDistribution>`

读者大可直接使用 `wsl --help`，wsl 的命令并不多，且该帮助是中文的，要比本文的参考性更强一些。相关的简写也完全列在帮助中。在撰写文章时，帮助菜单如下，供参考：

```text
用法: wsl.exe [Argument][Options...][CommandLine]

运行 Linux 二进制文件的参数:

    如果未提供命令行，wsl.exe 将启动默认 shell。

    --exec, -e <CommandLine>
        在不使用默认 Linux shell 的情况下执行指定的命令。

    --shell-type <standard|login|none>
        使用提供的 shell 类型执行指定的命令。

    --
        按原样传递剩余的命令行。

选项:
    --cd <Directory>
        将指定目录设置为当前工作目录。
        如果使用 ~，则将使用 Linux 用户的主路径。如果路径以
        / 字符开始，它将被解释为绝对 Linux 路径。
        否则，该值必须是绝对 Windows 路径。

    --distribution, -d <DistroName>
        运行指定的分发版。

    --distribution-id <DistroGuid>
        运行指定的分发版 ID。

    --user, -u <UserName>
        以指定用户身份运行。

    --system
        为系统分发版启动 shell。

用于管理适用于 Linux 的 Windows 子系统的参数:

    --help
        显示使用情况信息。

    --debug-shell
        出于诊断目的打开 WSL2 调试 shell。

    --install [Distro] [Options...]
        安装适用于 Linux 的 Windows 子系统分发版。
        有关有效分发版的列表，请使用 'wsl.exe --list --online'。

        选项:
            --enable-wsl1
                启用 WSL1 支持。

            --fixed-vhd
                创建固定大小的磁盘来存储分发版。

            --from-file <Path>
                从本地文件安装分发版。

            --legacy
                使用旧分发版清单。

            --location <Location>
                设置分发版的安装路径。

            --name <Name>
                设置分发版的名称。

            --no-distribution
                仅安装所需的可选组件，不安装分发版。

            --no-launch, -n
                安装后不要启动分发版。

            --version <Version>
                指定要用于新分发的版本。

            --vhd-size <MemoryString>
                指定用于存储分发版的磁盘的大小。

            --web-download
                从 Internet 而不是 Microsoft Store 下载分发版。

    --manage <Distro> <Options...>
        更改发行版特定选项。

        选项:
            --move <Location>
                将分发版移到新位置。

            --set-sparse, -s <true|false>
                将发行版的 vhdx 设置为稀疏，从而允许自动回收磁盘空间。

            --set-default-user <Username>
                设置分发版的默认用户。

            --resize <MemoryString>
                将分发版的磁盘大小调整为指定大小。

    --mount <Disk>
        在所有 WSL 2 分发版中附加和装载物理磁盘或虚拟磁盘。

        选项:
            --vhd
                指定 <Disk> 引用虚拟硬盘。

            --bare
                将磁盘附加到 WSL2，但不要装载它。

            --name <Name>
                使用装入点的自定义名称装载磁盘。

            --type <Type>
                装载磁盘时要使用的文件系统(如果未指定)默认为 ext4。

            --options <Options>
                其他装载选项。

            --partition <Index>
                要装载的分区的索引(如果未指定)默认为整个磁盘。

    --set-default-version <Version>
        更改新分发版的默认安装版本。

    --shutdown
        立即终止所有正在运行的分发版和 WSL 2
        轻型实用工具虚拟机。

    --status
        显示适用于 Linux 的 Windows 子系统状态。

    --unmount [磁盘]
        从所有 WSL2 分发版中卸载和分离磁盘。
        如果在没有参数的情况下调用，则卸载和分离所有磁盘。

    --uninstall
        从此计算机卸载适用于 Linux 的 Windows 子系统包。

    --update
        更新适用于 Linux 的 Windows 子系统包。

        选项:
            --pre-release
                下载预发行版本(如果可用)。

    --version, -v
        显示版本信息。

用于在适用于 Linux 的 Windows 子系统中管理分发版的参数:

    --export <Distro> <FileName> [选项]
        将分发版导出到 tar 文件。
        文件名可以是 - for stdout。

        选项:
            --format <Format>
                指定导出格式。支持的值: tar、tar.gz、tar.xz、vhd。

    --import <Distro> <InstallLocation> <FileName> [选项]
        将指定的 tar 文件作为新分发版导入。
        文件名可以是 - for stdin。

        选项:
            --version <Version>
                指定要用于新分发的版本。

            --vhd
                指定所提供的文件是 .vhdx 文件，而不是 tar 文件。
                此操作在指定的安装位置创建 .vhdx 文件的副本。

    --import-in-place <Distro> <FileName>
        将指定的 .vhdx 文件作为新分发版导入。
        必须使用 ext4 文件系统类型设置此虚拟硬盘的格式。

    --list, -l [选项]
        列出分发版。

        选项:
            --all
                列出所有分发版，包括当前
                正在安装或卸载的分发版。

            --running
                仅列出当前正在运行的分发版。

            --quiet, -q
                仅显示分发版名称。

            --verbose, -v
                显示有关所有分发版的详细信息。

            --online, -o
                显示适合通过 'wsl.exe --install' 安装的可用分发版列表。

    --set-default, -s <Distro>
        将分布版设置为默认值。

    --set-version <Distro> <Version>
        更改指定分发版的版本。

    --terminate, -t <Distro>
        终止指定的分发版。

    --unregister <Distro>
        取消注册分发版并删除根文件系统。
```
