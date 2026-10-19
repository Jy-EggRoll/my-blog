---
title: 在 RedmiBook Pro 15 2022 上装 Fedora 44 与 niri：从分区到卸载
slug: fedora44-niri-双系统
description: 一次在 RedmiBook Pro 15 2022 上为 Fedora 44 与 niri 腾空间、分区、安装并验证的完整记录，逐处标出结论的来源与可信程度，另含该机型 HDMI 无输出问题与干净卸载的次序。
date: 2026-10-19
lastmod: 2026-10-19
image: 
categories:
    - 技术
tags:
    - Fedora
    - niri
    - 双系统
    - 分区
    - EFI
---

# 在 RedmiBook Pro 15 2022 上装 Fedora 44 与 niri：从分区到卸载

这是我自己动手的一次记录，机器是手边这台 RedmiBook Pro 15 2022 锐龙版。文章从定位、选型、分区一直写到装完之后的第一次验证，最后再讲怎么把它卸掉。需要先说清楚的是：**到动笔时为止，Fedora 还装着，卸载这一步没有执行。** 所以凡是写已经发生的事的部分，每一条结论都来自实际经历；而卸载那部分目前只有计划、没有结果——这两者的可信程度不一样，我在文中尽量逐处标出来。

## 定位与前提

先交代这台机器和这段经历的定位，因为它决定了后面所有取舍的判断标准：**这不是一次迁移，而是一次扩展。** Windows 侧没有出问题，日常使用和生产力仍然在 Windows 上；Linux 侧是用来体验和折腾的。这个定位一定下来，判断标准就跟着变了：某块硬件在 Linux 下不能工作，不构成阻塞；中文输入法没能配到理想状态，也不算故障，反正 Windows 那边照旧；安装过程里遇到麻烦，直接重装就行，机器上没有丢不起的数据。凡是“能用就用、不能用就算”的项目，我都会明确写出来。

机器本身的情况，来源是 Arch Wiki 的该机型页面（页面最后编辑于 2025-11-17，因为 Arch Wiki 本体拒绝自动抓取，我读的是 GitHub 上的全站快照）：

- 核显是 AMD Radeon 660M（`1002:1681`），RDNA2，在 Mesa 的支持范围内。
- 无线网卡是 Realtek RTL8852BE（`10ec:b852`），驱动 `rtw8852be` 位于内核的 `rtw89` 目录下。
- 蓝牙、触摸板、摄像头、读卡器在社区记录里都标为可用。
- 音频芯片是 SenaryTech SN6140（`1002:1640`），输出可用，麦克风有已知问题。
- 指纹模块是 Goodix `27c6:589a`。这一项我在安装前夕更正过结论：它**不在** libfprint 的官方支持列表内，详见后面“首次验证清单”一节。
- 内存 16 GB，板载，不可更换。
- 单块 NVMe 固态硬盘。这台机器只有一个 M.2 插槽，不能加装第二块，C 盘与 D 盘都在这同一块盘上。
- 未启用磁盘加密，也不使用休眠。
- 三项限制之一：fwupd 不支持这台机型，固件更新只能回到 Windows 侧完成。

时间线要写清楚，因为文中引用的结论来自不同日期，混在一起看会自相矛盾：

- 2026-10-13：第一次核查，也是我早先记录的主要日期。
- 2026-10-15：补充核查若干项，并在 Live 环境里实际体验了两天，GNOME 与 niri 两个会话都试过。
- 2026-10-16：正式安装，并完成第一轮实测。这一天推翻了先前几处推断，下文会逐条标出。
- 2026-10-16 或次日：在正式系统里装上 niri 与 Noctalia，随后发现 HDMI 外接显示器没有输出。
- 2026-10-19：写这篇文章，同时把 ESP 那一条的来源重新核对了一遍。

最后一句提醒，也是我在意的一种写法：文中凡是写“来源：”的，都是能点开核对的官方文档或上游页面；凡是写“这是推断”的，是我根据原文推出来的，没有直接依据；另有几处我明确写了“我不确定”。这个区分不是形式主义——后面有几个结论，恰恰是因为早先把推断当成了事实，才需要改口。

## 为什么选 Fedora 而不是 Arch

先说一个容易误判的地方：如果只看 niri 能不能方便地装上，两者没有差别。Fedora 44 官方仓库里的 niri 是 `26.04-1.fc44`，Arch 的 extra 仓库里是 `26.04-1`，同一版本。分出高下的是**持续维护成本**，而这一点和我的偏好直接冲突。

Arch 官方要求在升级前查看主页新闻，需要人工干预的更新都会发公告。最近的一例是 2026-09-22 的 mkinitcpio 42 影响 TPM2 解锁 LUKS 加密盘，更早还有 2026-04-05 的 iptables 默认后端从 legacy 切到 nftables。这类事情每次都要我自己判断“这次更新跟我有没有关系”。我明确不想在每次更新前读公告，所以 Arch 排除，Fedora 胜出：它按固定版本发布，更新走 `dnf`，跨版本升级一年一次，不需要逐条读公告。

Fedora 官方生命周期的原文我这次没有读到——文档站对自动访问返回拒绝访问，所以下面的日期来自第三方站点 endoflife.date，它的数据指向 Fedora 官方文档但我没能直读原文，这一条请按“间接证据”看待：Fedora 44 于 2026-04-28 发布，预计支持到 2027-06-02。来源：<https://endoflife.date/fedora>。另外，截至写这篇文章时，Fedora 45 仍处于 Beta 阶段，来源是 Fedora 官方的 releases.json：<https://fedoraproject.org/releases.json>

## 为什么是 niri 加 Noctalia

niri 官方文档的快速开始一节，标题原文就是一句很直白的话——“用这些命令安装 niri 与 DankMaterialShell，得到一个相当省心的体验”（来源：<https://niri-wm.github.io/niri/Getting-Started.html>）。也就是说，上游自己就给了配套的桌面外壳，网上常说的“用 niri 就必须自己拼装十几个组件”这个前提并不成立。

官方快速开始里点名的外壳有两个：DankMaterialShell 与 Noctalia（niri 现在归在 niri-wm/niri 组织下，GPL-3.0，当前版本 v26.04，2026-04-25 发布）。

| | DankMaterialShell | Noctalia |
| --- | --- | --- |
| 版本 | v1.6.3（2026-10-07） | v5.2.1（2026-10-02） |
| 许可 | MIT | MIT |
| Fedora 44 获取方式 | 需启用第三方 COPR `avengemedia/dms` | **官方仓库，`sudo dnf install noctalia`** |
| Arch 获取方式 | extra 仓库 `dms-shell-niri` | extra 仓库 `noctalia` |

选 Noctalia 的理由只有一条，但它对“不想持续维护”这件事很关键：**它落在 Fedora 官方仓库里。** 第三方 COPR 的包由维护者个人负责跟进 Fedora 的新版本，一旦断档，系统升级之后就装不上了；官方仓库的包随 Fedora 的生命周期一起维护。

两者都接管同样七项，不需要我逐个挑选和配置：任务栏、通知中心、锁屏、启动器、设置面板、壁纸、电源菜单。

顺带记一个最终没有采纳的选项，因为它是很多人会先想到的：用 WSL 代替双系统。这两者不是同一件事，不存在整体的谁优谁劣。WSL 官方自己把它定位成内层开发循环，其 GUI 文档也写明“在 WSL 上支持 GUI 程序并不提供完整的桌面体验，它依赖 Windows 桌面”。有一件事它确实做不到，而且原因在技术上很明确：niri 接管整块屏幕当桌面，在 WSL 里不可行。WSL 2 的内核配置把所有能造出虚拟显示设备的驱动全部关闭（`CONFIG_DRM_VKMS`、`CONFIG_DRM_VIRTIO_GPU`、`CONFIG_DRM_SIMPLEDRM`、`CONFIG_DRM_HYPERV` 均为 not set，只留 WSL 专用的 `CONFIG_DXGKRNL=y`），合成器因此枚举不到可用的显示设备，上游 issue 里的实机报错正是 `couldn't find a GPU`。来源：<https://github.com/microsoft/WSL2-Linux-Kernel/blob/linux-msft-wsl-6.6.y/arch/x86/configs/config-wsl> 与 <https://github.com/niri-wm/niri/issues/2307>。反过来，niri 在 WSL 里嵌套成一个窗口倒是上游有意留的路，这里就不展开了。

## 分区前必须弄清的三件事

分区这一步之所以值得单独写，是因为它牵涉到三条流传很广、但各自都带前提的说法。我动手之前在这三件事上都花了时间，而其中一条最后被实机结果推翻。

### ESP 数量之谜

网上流传的一句话是“每块盘只能有一个 ESP”，再演化成“一台电脑只能有一个 ESP”。这句话不准确，而且它的出处是可以定位的。

真正有约束力的规范文本恰恰相反。UEFI 规范第 13.3.3 节，标题就叫“系统分区的数量与位置”（Number and Location of System Partitions），开篇原文是：

> UEFI does not impose a restriction on the number or location of System Partitions that can exist on a system.

来源：<https://uefi.org/specs/UEFI/2.11/13_Protocols_Media_Access.html#number-and-location-of-system-partitions>（这一节在 2.10 版中同样存在，标题与编号一致。要注意的是 2.10 与 2.11 版这一章的 HTML 文件名是 `13_Protocols_Media_Access.html`，网上流传的另一些拼法会 404。）

同一节紧接着还写明，安装程序可以“在每个目标操作系统的引导盘上各建一个 ESP”，也可以“只建一个与操作系统引导盘和分区位置无关的中心 ESP”。规范里唯一出现“只能有一个”的地方在 13.3.1.3 节，而那一节限定的是可移动介质。（后一句出自我早先的记录，我这次没有回到规范原文逐字复核，按“有来源但未复查”对待。）

那句“每块盘只能有一个 ESP”，我的核对结果是这样：**它出自 Arch Wiki 的 Windows 双系统页，并且是带条件的实践陈述，不是规范条款。** 这句话出现在该页“禁用快速启动 + 启用休眠”那一节里，原文是：

> As there can only be one ESP per drive, the ESP used for Linux must be located on a separate drive than the ESP used for Windows.

来源：<https://wiki.archlinux.org/title/Dual_boot_with_Windows>

把这句话放回它所在的上下文，条件就露出来了：这一节的标题限定了“禁用快速启动 + 启用休眠”，整节讲的是两个系统需要各自休眠时该怎么办。也就是说，**“每块盘只能有一个 ESP”成立的前提是 Windows 启用了休眠。** 原因在 Arch Wiki 的 ESP 页写得更直接：两个系统共用一块 ESP，其中一个处于休眠（或启用快速启动的那种“假关机”）状态时，容易造成 ESP 数据损坏。来源：<https://wiki.archlinux.org/title/EFI_system_partition#Hibernation_and_multi_boot_systems>

同一页还有一条更常被单独引用的警告，出自“Windows before Linux”一节：

> An additional EFI system partition should not be created, as it may prevent Windows from booting

它引用的是微软的一篇文章，编号 KB2879602。**但这一节紧随其后的 Note 把适用范围缩得很小**，原文是：

> It only appears when Linux is installed on the second hard disk and a new EFI system partition is created on the second hard disk.

也就是说，这条警告针对的是“Linux 装在第二块盘、并且在第二块盘上新建 ESP”的情形。另外要说明证据强度：那篇微软知识库文章的正文我这次没有读到，它的链接会跳转、跳转后的目标返回 404。我能核实的只有 Arch Wiki 引用的**标题**，它是“存在多个 EFI 系统分区时无法启动”，以及该编号属于 Windows 7 或 8 时代的格式。它在 Windows 10 与 11 上是否仍然适用，我不确定，**不要把它当成现行的微软立场**。

同一页的“禁用快速启动 + 禁用休眠”一节则给出了相反方向的结论：

> You may share the same EFI system partition between Windows and Linux.

不过紧接着就指出，共用一块 ESP 时，如果 Windows 处于休眠或启用了快速启动，**共用的那块 ESP 反而可能被损坏**。

把这三段并排放在一起看，事情就清楚了：这些说法不是互相矛盾，而是各自有前提。“必须分盘”的前提是休眠，“不要新建”的前提是 Linux 装在第二块盘，而“可以共用”的前提是两边都不休眠。

我的场景为什么不落在其中任何一条里：这块 NVMe 是机器上唯一的盘，C 盘与 D 盘都在它上面；未启用磁盘加密；也不开休眠。上面三条警告的前提，在我这里一条都不成立。**这就是我的正论——不是“那句话是假的”，而是“那句话在什么前提下成立，我的场景为什么不落在其中”。**

不过这里必须补一段诚实的反方材料，因为我自己先前的调查是往相反方向走的。动手之前我另做过一次专门的 ESP 核实（2026-10-19），当时得到的结论是“单盘机器上不要再建 ESP，应该直接复用 Windows 已有的那块”。支撑这个结论的是 Arch Wiki 的 ESP 页里那句建议：每个系统一个独立 ESP 的做法，“多数 UEFI 都支持，只要这些 ESP 位于物理上不同的磁盘”（来源：<https://wiki.archlinux.org/title/EFI_system_partition#Hibernation_and_multi_boot_systems>），以及“把主 ESP 的内容复制到另一块盘上的次级 ESP”这种落地做法。那份调查据此判断：我这台机器只有一个 M.2 插槽，所以“再建一个独立 ESP”这条路用不了。

**这个判断被实机结果推翻了。** 2026-10-16 的实际安装中，我在未分配空间里新建了一个 FAT32 分区挂到 `/boot/efi`，可行；Windows 原有的那块 ESP 保持“无挂载点、无格式化”的状态；安装前核对过它 `\EFI\Microsoft\Boot` 下的 `bootmgfw.efi` 与 `BCD` 俱在，装完之后 Windows 引导未受破坏。所以“单盘不能建第二个 ESP”是一条**推断，不是事实**，它把文档给出的实践建议当成了硬限制。文档说的是“因机器而异、硬件支持与可用性会有差别”，不是“不可能”。

至于“国产笔记本的固件不支持多 ESP”这种说法，我找不到任何一手来源可以证明，因此不写。不要把它当成已知问题。

### 双 ESP 防得住与防不住什么

选定“新建第二个 ESP、Windows 与 Linux 各用一个”之后，有一处认知偏差必须当场纠正，否则会产生错误的安全感。

**防不住的：启动顺序被 Windows 改掉。** UEFI 的启动顺序存放在主板固件的 NVRAM 变量里，不在 ESP 分区里。Windows 更新确实可能把 Windows Boot Manager 重新排到第一位，而无论共用一个 ESP 还是各用一个，这一点完全相同——被改动的是 NVRAM，不是分区表。这类案例很多：有可核验的记录显示，Windows 11 更新之后 Fedora 从启动顺序列表里消失，但 `\EFI\fedora` 下的引导文件仍然存在（来源：<https://discussion.fedoraproject.org/t/fedora-grub-disappeared-from-dual-boot-after-windows-11-update/127803>）；Linux Mint 论坛上的排查结论相同——“文件还在、没有被覆盖，出问题的是 NVRAM 里的启动项”（来源：<https://forums.linuxmint.com/viewtopic.php?t=321567>）。还有一个很直接的反例：<https://superuser.com/questions/1885003/windows-11-removing-linux-boot-entry-from-uefi> 里那台机器用的是两块不同的物理硬盘，也就是双 ESP 的极端形式，照样被 Windows 11 24H2 抹掉了启动项。

**防得住的：ESP 分区里的文件被其他系统覆盖。** 当 Windows 的启动修复、BCD 重建、格式化 ESP 这类显式操作发生时，它碰不到 Linux 的 EFI 目录。这是双 ESP 的主要价值，也符合微软自己的设计口径——其部署文档写明 ESP 由操作系统管理，且“不应包含任何其他文件”（来源：<https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/configure-uefigpt-based-hard-drive-partitions>）。顺带一提，同一份文档给出的 ESP 尺寸是**下限**要求：512 与 512e 扇区下 200 MB，4K native 扇区下 300 MB。

所以“Windows 更新会破坏 Linux 的 ESP”这个说法要拆成两半：说“Windows 更新可能把 Boot Manager 置顶、或抹掉 Linux 的 NVRAM 启动项”，成立；把它归因为“ESP 分区被破坏或被覆盖”，不成立。我没有找到可靠证据表明常规 Windows 更新会删除或覆盖 `\EFI\fedora` 这类目录，删除行为出现在启动修复、重装、BCD 重建、加密盘恢复这类显式操作中。修改启动顺序的机制确实存在，只是触发它的是部署与修复工具，不是常规更新本身：微软的 BCDBoot 文档写明它会在 NVRAM 中写入指向 Windows Boot Manager 的启动项，且“默认情况下这一项会被放在启动列表的第一位”，可用 `/p` 选项保留原有顺序（来源：<https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/bcdboot-command-line-options-techref-di>）。

还有一件与 ESP 直接相关、但原理上独立的事：**引导项绑定的是具体分区上的具体 `.efi` 文件路径，不是“ESP 这个类型”。** 规范 3.1.3 节规定，每个引导项变量里放的是一个 `EFI_LOAD_OPTION` 结构，其文件路径列表描述的是这次引导所用的映像所在的设备与位置（来源：<https://uefi.org/specs/UEFI/2.11/03_Boot_Manager.html#load-options>）。由此推出两件事（这是推断，依据是上面的原文）：在另一个 ESP 上装引导程序，原来的引导项不会跟着变，固件菜单里也不会自动出现新条目；要让它出现，必须重新注册，Linux 侧用 `efibootmgr`，Windows 侧用 `bcdboot`。同理，如果把某一块 ESP 删除重建而引导项还指向旧分区，就会出现“选它但起不来”的现象。

因此，即使走了双 ESP，应对启动顺序被改的准备仍然要有。最实用的一条是**手边常备一个 Fedora Live USB**：一旦启动项丢失，从 Live 环境用 `efibootmgr` 重建就行，这是唯一不受 NVRAM 当前状态影响的恢复途径。其次是开机按 F12 从固件启动菜单临时选 Fedora，或在 Linux 侧用 `efibootmgr` 调整顺序。

### btrfs 快照与回滚的能力边界

第三件事是我原先想错了的一项。我一开始是这么打算的：文件系统选 btrfs，装上 snapper，日常折腾之前先拍快照，不满意就一键回滚，等于给系统买了一份保险。核查之后发现这个前提不成立，**原因不在 btrfs，而在 Fedora 的取舍与子卷布局**。

能力这一半是有的：Fedora 桌面版自 Fedora 33 起默认使用 btrfs，Fedora 44 未做改动，而拍快照的命令随时可用，就是 `btrfs subvolume snapshot`，不需要装任何东西。来源：<https://fedoraproject.org/wiki/Changes/BtrfsByDefault> 与 <https://fedoraproject.org/wiki/Releases/44/ChangeSet>

但 Fedora 33 的变更案原文写明：“There will be no automatic snapshots/rollbacks”。**这是官方明确的设计选择，不是遗漏。** 仓库里的 `snapper` 与 `btrfs-assistant` 只是管理工具，装上之后不会自动为 `dnf` 的每次事务拍照。

断掉的一段在回滚上。`snapper` 的一键回滚改的是 btrfs 的默认子卷 ID，而 Fedora 的根子卷是按名字挂载的（`subvol=root`），按名字挂载时默认 ID 会被忽略，于是回滚不生效。上游 snapper 有一个 PR 正是为了修这件事，标题即“support named-subvolume btrfs layouts”，但该页内嵌数据显示它是关闭且未合并的状态；Fedora 44 提供的是 snapper 0.13.0，上游已到 0.13.2，修复不在能装到的包里。来源：<https://github.com/openSUSE/snapper/pull/1133>。这不是纸上推演，Fedora 官方讨论区那份分步指南的作者自己写下“a real rollback is not completed”，最后是靠第三方脚本才把回滚跑通的（来源：<https://discussion.fedoraproject.org/t/btrfs-snapshots-in-fedora-the-definitive-step-by-step-easy-and-safe-guide/194483>）。

还有三条边界要记住：

- **`/boot` 不在快照范围内。** 方案按 Fedora 默认把它做成独立的 ext4 分区，内核与 initramfs 因此无法随快照回退。这个缺口与文件系统类型无关：即使把 `/boot` 换成独立的 btrfs 分区，它仍然不在根快照内，因为它是另一个文件系统。只有取消独立分区、让 `/boot` 成为根子卷里的普通目录才会被包含，而在 Fedora 上这种布局有实测启动失败的记录（<https://bugzilla.redhat.com/show_bug.cgi?id=1395910> 与 <https://bugzilla.redhat.com/show_bug.cgi?id=1862784>），所以我没有走这条路。
- **回滚根子卷会连 `/var` 一起带回。** 日志、包缓存、容器镜像都在根子卷内。而官方反对单独给 `/var` 做子卷，理由是里面装着 RPM 数据库，与 `/usr` 分开回滚会让 `dnf` 与 `rpm` 错乱（来源：<https://discussion.fedoraproject.org/t/rollback-btrfs-root-snapshot/72074>）。
- **快照不是备份。** 快照与原卷初始时共享全部数据块，数据一旦损坏会一起损坏。

2026-10-16 的实测又追加了一条与这台机器直接相关的边界，而且比上面几条更严重。本机的根是 btrfs 的**顶层子卷**，不是命名子卷（下节会说为什么）。btrfs 官方原文写着顶层子卷“不能被删除、也不能被其他子卷替换”，而子卷的数字 ID 不可更改；官方唯一那套成套的回滚流程把“根是默认子卷”写成了前提。也就是说，**这台机器不具备那套流程要求的前提**，想要它得先把根改造成命名子卷，那要动 fstab 与内核命令行。

结论：**不该把系统回退这件事寄托在根子卷快照上。** 我原本设想的场景是“装多个测试桌面环境、装一堆不稳定软件，不满意就一键回退”，就这个场景而言，根子卷快照回滚不是合适的工具，理由有两条。一是装桌面环境不等于装一个软件：它会大面积改 `/usr`、往会话目录里加条目、改 GDM 配置、经 alternatives 改默认项，Fedora 官方杂志在讲“试不同桌面环境”时明确指出这种装法会拉入大量依赖，而且完全卸载一个不满意的桌面环境“可能很困难”（来源：<https://fedoramagazine.org/trying-different-desktop-environments-using-rpm-ostree/>，2023-05-08 发布）。二是快照回滚给不了“一键”：它要从 Live 或救援环境操作、手动换名子卷，还要应付 `/boot` 不在快照内造成的内核不匹配。真正对系统零改动、又能回退的工具是虚拟机，这一点我没有展开。

本节有来源、也有我未核实的地方：`grub-btrfs` 不在 Fedora 官方仓库（官方包索引对该名字返回 400，与一个故意编造的假包名返回相同，而 `snapper` 与 `btrfs-assistant` 返回 200），只能通过 COPR 获取；dnf 事务前自动快照的官方机制是 `libdnf5-plugin-actions`，回调中有 `pre_transaction` 与 `post_transaction`，配置放在 `/etc/dnf/libdnf5-plugins/actions.d/`（来源：<https://dnf5.readthedocs.io/en/stable/libdnf5_plugins/actions.8.html>），而仓库里那个名字相近的 `python3-dnf-plugin-snapper` 是 dnf4 的 Python 插件，在 dnf5 下不生效。

## 具体分区布局与代价

弄清上面三件事之后，布局本身反而简单。要在 C 盘之后、D 盘之前做出一组分区，也就是压缩 C 盘得到的那段未分配空间正好所在的位置。Windows 原有的分区不删除、不新建；C 盘自身的大小会因为压缩而变小，D 盘与恢复分区完全不动。

| 顺序 | 用途 | 大小 | 文件系统 | 挂载点 |
| --- | --- | --- | --- | --- |
| 先建 | Linux 专用 ESP | 1 GiB | FAT32，标记为 EFI System Partition | `/boot/efi` |
| 再建 | 内核与 initramfs | 1 GiB | ext4 | `/boot` |
| 最后 | 系统根 | 余下全部，约 148 GiB | btrfs | `/` |

三处尺寸的来历：ESP 给 1 GiB 是留余量，微软那份部署文档给出的 200 MB 与 300 MB 是**下限**要求而不是上限，所以放大没有副作用，而且 Arch Wiki 的 ESP 页本身也推荐 1 GiB。`/boot` 给 1 GiB 是为了容纳内核与 initramfs，如果以后频繁装测试内核，可以给到 2 GiB。目标是 150 GiB，扣掉这两项之后其余约 148 GiB 全部给 `/`。

不单独建 swap 分区。Fedora 自 Fedora 33 起默认用 zram 在内存里做交换，磁盘上不建 swap；我不需要休眠，所以这一项不用管。这里留个前因：只有当要用休眠（挂起到磁盘而不是挂起到内存）时，才需要一块不小于内存容量的 swap，16 GB 内存对应 16 GB 空间。

位置这件事不影响引导，UEFI 规范明确不限制系统分区的数量与位置。有一点只能靠原始分区表确认，而本机已经确认不留档，因此保持未知：这段未分配空间之后、D 盘之前到底还有没有别的分区。我早先的记录里早先写“压缩出的空间落在磁盘末尾”，那假定了 D 盘之后没有 Windows 恢复分区，而同一节又提醒不要删除恢复分区，两处对不上。

**接下来是这套布局真正的代价，也是我这次学到的、最出乎意料的一条。**

方案要求拿到第二个 ESP，因此必须走手动分区，不能用自动分区——自动分区会去挑现有的那块 ESP，正是要避开的事。而 2026-10-16 装完之后我立刻执行 `sudo btrfs subvolume list /`，输出只有一行：

```
ID 256 gen 52 top level 5 path var/lib/machines
```

那一行是 systemd-machined 建的。**既没有 `root` 子卷，也没有 `home` 子卷——用 Anaconda 手动分区、只建一个 btrfs 分区挂到 `/` 时，安装器不建任何子卷，根文件系统直接使用 btrfs 的顶层。**

后果有两层。第一层是实用层面的：`/home`、`/var`、日志与容器镜像全在同一棵树里，**任何根快照都会把它们一并带上，“回滚误伤 `/home`”在这台机器上是必然而不是可能。**

第二层更关键，也是原先没有写出来的一处取舍：**Fedora 的自动分区才会建 `root` 与 `home` 子卷，手动分区不会。** 而为了拿到第二个 ESP，我必须走手动分区——**两者互斥。** 也就是说，这套方案在获得 ESP 层面的文件隔离的同时，放弃了标准子卷布局，而后者正是 `snapper` 一类工具所期待的形态。再叠加上一节那条“根是顶层子卷、不具备那套流程前提”的实测，等于又一次确认：这台机器不该把系统回退寄托在根子卷快照上。这是明确的取舍，不是疏忽。

顺带记一条容易填错的地方，因为它是这条路上唯一一个纯操作性的失误来源。Windows 磁盘管理的“压缩卷”输入框以 MB 为单位，要拿到 150 GiB 需要填 **153600**。这个换算依赖“该框以 MiB 计”这个前提，而**我没有取得微软官方对这一单位口径的说明**。按另一种口径（十进制 MB）理解，150000 只有约 139.7 GiB。所以不要在脑子里算——填完直接看对话框里的“压缩后的总计大小”是否落在预期位置，再确认。

## 腾出空间：压缩 C 盘、代价与可逆性

腾空间这一步本来分两段：先留档，再压缩。留档那一段我跳过了，先说清楚。

方案原本要求在压缩之前记录原始分区表，理由是压缩之后这份记录就取不到了，将来启动项或分区出问题时它是最直接的依据。Windows 侧以管理员权限执行的是 `diskpart`，再依次 `list disk`、`select disk 0`、`list partition`、`list volume`。**实际执行时这一步跳过了**，理由是使用者判断价值不足。这不是遗漏，是明确决定，后果一并记下：**压缩前 C 盘的原始大小与偏移因此没有留档，将来若出现分区或引导问题，能依据的只剩压缩后的状态。** 作为补偿，装完 Fedora 后必须立刻执行 `efibootmgr -v` 并把输出存到台式机——那一条保的是启动项，而启动项才是真正难以重建的东西。

压缩本身。微软文档写明分页文件与卷影副本存储区属于不可移动文件，压缩无法越过它们；官方给出的办法是把分页文件或卷影副本移到别的盘，再删除已存的卷影副本，然后压缩。还有两条配套动作：关掉休眠与快速启动（以管理员权限执行 `powercfg /hibernate off`），以及在这一步顺带确认磁盘加密状态。

**这些准备在本机全都不需要做**，原因是 2026-10-15 实测“可用压缩空间大小”为 312853，基本等于 C 盘的全部剩余空间，远高于目标值。本机也未启用磁盘加密，所以加密那一条直接跳过。上面那几条留在这里，是为了将来重新分区时还能用。

真正的操作只有一条路径：`Win+R` 输入 `diskmgmt.msc`，右键 C 盘选“压缩卷”，压缩量填 153600，填完核对“压缩后的总计大小”再确认。微软文档明确这项操作不会丢数据，原文是“No data loss occurs”（来源：<https://learn.microsoft.com/en-us/windows-server/storage/disk-management/shrink-a-basic-volume>）。**D 盘与恢复分区都不要动，也不要删除任何现有分区。**

万一压不到预期，同一条来源给出两条定位路径，不要硬来：在“事件查看器 → Windows 日志 → 应用程序”里查事件 ID 259，它会指出是哪个不可移动文件挡住了压缩；或者用 `fsutil` 的 `querycluster` 参数定位到具体簇，前提是已经知道是哪个文件。**不要改用第三方分区工具硬压**，我没有核实过任何第三方工具的行为。

压缩完成后重启一次 Windows，确认系统正常，再回到磁盘管理检查那段未分配空间是否紧跟在 C 盘之后。这一段容量就是 Fedora 能拿到的全部空间。

最后是代价与可逆性，这两点必须一起看，否则很容易把它写成永久损失。**代价是**：只要那三个 Linux 分区还在，Windows 侧就无法把 C 盘扩回来，因为扩展到紧邻其后的未分配空间是硬性前提，中间隔着其他分区就做不到（来源：<https://learn.microsoft.com/en-us/windows-server/storage/disk-management/extend-a-basic-volume>，原文“If there are any other volumes between the volume to extend and the unallocated space, you can't extend the volume”）。**但它是可回收的**：删掉那三个 Linux 分区之后，空出来的未分配区域立刻紧邻 C 盘，Windows 就能直接把它扩展回 C。所以这条选择真正的成本是“空间以可撤销的分区布局形式被借用”，不是“永久让出 150 GiB”。同理，只压缩、还没在安装器里建出分区时，那段未分配空间可以原样扩展回 C，**压缩这一步本身就是可逆的**；真正不可逆的时刻是在安装器里建出 Linux 分区的那一下。这也意味着“装了但不用”的净损失主要是时间，而不是磁盘空间。

## 安装步骤与实测判据

**先做一次不装系统的实机验证。** 下载 Fedora 44 Workstation 的 Live ISO，做 U 盘启动盘，按 F12 从 U 盘启动进 Live 环境。这一步不会安装系统、不会创建或修改任何分区、不会格式化任何设备。更准确地说是：SquashFS 只读镜像留在 U 盘上，运行时的改动由覆盖层承载，未指定覆盖层参数时该层是内存里的一个稀疏文件，所以“重启后一切消失”成立，但“整个系统跑在内存里”不成立。来源：<https://man7.org/linux/man-pages/man7/dracut.cmdline.7.html>

“完全不动硬盘”这个说法不够准确，有两个接触点要注意。一是硬盘分区不会自动挂载，但点一下就会挂载：udisks 的默认策略很保守，自动挂载标志初值为假，只有可移动介质或走 USB 总线的设备才被置为真，内置 NVMe 不满足条件。所以操作原则是**只验证硬件，不要点开硬盘上的任何分区**。二是如果 Windows 开着快速启动，那个 NTFS 分区处于休眠状态，Linux 挂载会失败或以只读方式挂载，此时强行动它有损坏风险。另外，更稳的启动方式是用 F12 的临时启动菜单选 U 盘，不要进 BIOS 改启动顺序——F12 是当次生效的选择。

**然后正式安装。** Fedora 44 Workstation 默认用的是新版 Web UI。要说明的是，分区界面上具体的点选路径我没有取得官方文档佐证，属于说明性描述，实际界面的用词以安装器为准。顺序是：

- 在“安装目标”里只勾选那块 NVMe 固态硬盘。
- 分区方式选“自定义”或“手动分区”，**不要**用自动分区。
- 在未分配空间上按前面表格的顺序依次新建三个分区：先建 1 GiB 的 EFI 系统分区并挂到 `/boot/efi`，再建 1 GiB 的 ext4 挂到 `/boot`，最后把剩下的空间建成 btrfs 挂到 `/`。
- 确认 `/boot/efi` 只挂在**新建的那块 ESP** 上。Windows 原有的那块 ESP 不要勾选、不要设挂载点。
- 不要使用任何会自动回收或重排空间的选项。

**这里有一条实测出来的判据，值得单独写。** 安装摘要里，原有的那块 ESP 会被列为“挂载”且没有挂载点——但那一列对新分区同样只写“挂载”，**所以它区分不出“复用”与“格式化”，不能据此判断它会不会被格式化**。真正能看的判据只有两条：**有没有挂载点**，以及**界面上有没有出现格式化的勾选框**。而新版 Web UI 在这个界面上没有可见的格式化勾选框，所以判断只能靠前一条。这条判据是我在核对“Windows 引导有没有被破坏”时确认的，当时预先检查过原有 ESP 的 `\EFI\Microsoft\Boot` 下 `bootmgfw.efi` 与 `BCD` 俱在。

如果安装器不允许指定新建的 ESP，退回复用 Windows 那块也能装，只是失去分区层面的文件隔离，其余结论不变。

**装完还有一步，这一步原本没有写，是实测补上的。** 实测结果是：Anaconda 确实创建了 Fedora 的启动项，指向新 ESP 上的 `\EFI\fedora\shimx64.efi`，也就是说“Windows 与 Linux 各用一个 ESP”在固件层面成立了；**但 Windows 的启动项仍然排在第一位**，所以重启之后直接进了 Windows，需要按 F12 手动选一次 Fedora。进入 Fedora 之后用 `efibootmgr -o` 把 Fedora 调到最前。两点要求：编号必须以本机 `efibootmgr -v` 的输出为准；`-o` 设定的是完整启动顺序，**未列入的条目等于不在顺序里**，所以要写全。

另有一处实测现象记下备查：装完后出现了**两条 Fedora 项**，一条指向 `\EFI\fedora\shimx64.efi`（实际使用中），另一条指向 `\EFI\fedora\shim.efi`。若后者对应的文件不存在，它是一条坏项，可以用 `efibootmgr` 的 `-b` 加编号配 `-B` 删除；**删除前必须先确认那个文件确实不在。**

再补一条与 GRUB 有关的实测，因为它纠正了一处先前的担心。Fedora 正在弃用探测其他操作系统的 `os-prober`，改用 GRUB 自身的 `osprobe` 命令（来源：<https://fedoraproject.org/wiki/Changes/DeprecateOsProber>），因此 GRUB 菜单里是否会自动列出 Windows 本来存在不确定性。**实测给出答案：GRUB 菜单里确实列出了 Windows。** 但同一项实测还暴露了 Fedora 与上游默认的一处不一致：GNU GRUB 手册写的是 `GRUB_DISABLE_OS_PROBER` “默认是禁用的”，必须显式设成 `false` 才启用（来源：<https://www.gnu.org/software/grub/manual/grub/html_node/Simple-configuration.html>）；而本机 `/etc/default/grub` 里检索 `os_prober` **无任何输出**，`grub2-mkconfig` 却照样输出了“Found Windows Boot Manager”。**结论：Fedora 44 在这一点上与上游默认不一致；由哪个包、以何种方式改动，我没有找到来源，不作判断。**

最后，这一阶段的验收标准是 **“Fedora 能进、Windows 也能进”，不是“GRUB 菜单里两者都在”**。这两件事很容易混为一谈。

## 装完的首次验证清单

清单里前面几条是“装完立刻做”的，它们同时是几个结论的最终实证，所以放在最前面。

- **先确认子卷**：`sudo btrfs subvolume list /`。实测结果已在上一节写过——只有 systemd-machined 建的那一行，没有 `root` 也没有 `home` 子卷。这一条同时决定了“根快照会不会误伤 `/home`”，答案是不会误伤，而是必然一起带上。
- **立刻留档启动项**：执行 `efibootmgr -v`，把输出存到台式机。这是压缩前没有留档分区表的唯一补偿。
- **确认中文输入法**：`rpm -q ibus ibus-libpinyin`。实测返回 `ibus-1.5.34~rc1-4.fc44.x86_64` 与 `ibus-libpinyin-1.16.5-3.fc44.x86_64`，两者都在，因此“Fedora 44 Workstation 默认就带 ibus 拼音”这条结论成立。这里要区分一件事：装机用的 Live 环境里没有可用的中文输入法（我在 Live 里实测过），而装好的系统里有——**“Live 里没有”推不出“装好也没有”，两者是不同的软件集合。**
- **确认 Windows 仍能正常启动**。这是双系统最关键的验收项。按 F12 从固件菜单选 Windows，确认能进。
- **确认电池充电阈值**：`ls /sys/class/power_supply/*/charge_control_*`，无输出即为最终答案。这台机器无法设置充电上限，原因在固件层：内核的 `xiaomi-wmi.c` 只注册键盘输入事件、没有电源供应相关代码（来源：<https://raw.githubusercontent.com/torvalds/linux/master/drivers/platform/x86/xiaomi-wmi.c>），第三方项目 XiControl 的 WMI 协议手册也记录了 TM2113 的固件对充电阈值那一组写入无任何响应（来源：<https://github.com/Oksion/XiControl/blob/main/docs/01-wmi-protocol.md>）。作为对照，内核的电源供应 ABI 文档在 `charge_control_end_threshold` 条目下写明，并非所有硬件都能设为任意百分比（来源：<https://www.kernel.org/doc/Documentation/ABI/testing/sysfs-class-power>）。

接下来几条是这台机器上真正未知或已知有问题的项目：

- **睡眠与休眠**：这是整个方案最大的未知项。第三方驱动项目 modern_laptop 记录过“S0 待机约耗电 3.7%/小时、S4/S5 唤醒报 ACPI 错误、混合休眠不工作”，但该项目最后一次提交是 2023-11-25，而更新到 2025-11-17 的 Arch Wiki 机型页面完全没有提到睡眠问题。两者矛盾，无法据此下结论，只能实测合盖、`systemctl suspend`、`systemctl hibernate` 三种情况。
- **指纹**：先用 `lsusb` 核对型号是 Goodix `27c6:589a`，再试录入。路径是 `sudo dnf install fprintd fprintd-pam` 然后 `fprintd-enroll`；**预期结果是报找不到设备**，因为这个 ID 不在 libfprint 的官方支持列表里（该页自述列的是开发版设备，因此缺失意味着走官方途径没有驱动，不是“版本旧、以后会有”）。这一步值得做，因为它同时是对上述结论的最终实证。顺带纠正一个常见误解：`fprintd` 包里的那个 polkit 动作管的是“谁有权限录入或删除指纹”，不是“用指纹给 polkit 提权”。
- **麦克风**：这台机器的音频芯片是 SenaryTech SN6140，低阻值的四段式耳麦麦克风插进 3.5mm 口时不被识别，疑因芯片以阻值区分两种接线标准。Arch Wiki 给了三种对策，其中用 `hda-verb` 改寄存器那条，原作者自述命令是推测出来的、没有数据手册、并警告有风险，**不建议照做**。
- **输入法在 niri 会话下是否可用**：先在 GTK 程序、Qt 程序、X11 程序（经 `xwayland-satellite`）里分别试中文输入。这一项有明确的未核实点——niri 官方文档没有输入法相关页面，它走的是 text-input 还是 input-method 协议我没有取得来源，这也正是先装着 fcitx5 作为退路的实际理由。
- **屏幕共享**：在浏览器或会议软件里发起一次屏幕共享，验证门户后端工作正常。
- **外接显示器热插拔**：当时无条件验证。后来接上 HDMI 外接显示器完全没有输出，见后文专门的一节。

有一条要把话说清楚：**上面这些验证项目前是在 GNOME 会话下做的。** niri 与 Noctalia 是装完 Fedora 之后才装的，所以标记为“niri 会话下”的那几项，当时都还是待做项，不是已证结论。其中外接显示器这一项后来在 niri 会话下补测了，结果同样没有输出，见后文专门的一节。

最后是已经在 Live 环境里验证过、不需要重复的一轮。我在 Live 里体验了两天，GNOME 与 niri 两个会话都试过，实测结论是：硬件基本正常，niri 用起来顺手，Linux 的自定义能力我认可。具体逐项核对过屏幕分辨率与刷新率、屏幕亮度调节与亮度功能键、无线网卡连接 Wi-Fi、触摸板与键盘、音频输出、摄像头、蓝牙、读卡器。其中亮度键与触摸板手势两项值得重复，因为这两项在虚拟机里无法真实体验，也正是 Live USB 这一步不可省略的原因。

Live 那一轮只剩下两个未确认项：中文输入，和睡眠与挂起。中文输入已经在上面的清单里裁定；睡眠与挂起仍是这台机器上唯一一个我既没有来源、也没有实测的问题。

## 该机型的已知问题

这一节的写法与前面几节不同。前面几节能写成步骤，是因为每一步都有来源或本机实测撑着；这两件事都没有。它们单独列成一节，是因为它们一起决定了我最后要不要留着这套系统。

### HDMI 外接显示器在 Linux 下无输出

**现象。** 在这台 RedmiBook Pro 15 2022 锐龙版上装完 Fedora 44 之后，从 HDMI 口接外接显示器没有任何反应。显示器不进画面，机器本身也几乎没法用。

我试了两个会话，都不行：GNOME 会话不行，niri 会话也不行。这两个会话分别走不同的合成器路径，结论一致。

外接显示器这一项，我没有在 Fedora Live 环境里测过。我在心里认为 Live 应该也不行，但这只是我的推测，没有验证过，不能当结论用。

同一台机器换回 Windows，外接显示器完全正常。

**已经排除了什么。** 把 Windows 里的正常表现放在一起看，能排除掉的东西比看上去多。

硬件与线材没有问题。同一台机器、同一个 HDMI 口、同一根线、同一块显示器，在 Windows 下工作正常，说明这条物理链路本身是通的。问题出在 Linux 这一侧，而不是显示器、线材或接口坏了。

不是某一个合成器的问题。GNOME 会话和 niri 会话都无输出。如果只有 niri 不行，那还有理由怀疑是 niri 这一层的配置或实现；两边同时不行，就把范围缩小到两个会话共用的那部分，也就是内核的显示驱动与连接器枚举这一层。这是我根据现象做的推断，不是已经查实的结论。

**我没有定位到成因。** 这是这一节最需要写清楚的一句：**我没有定位到成因，也没有找到与它对应的已知缺陷。**

我按几个方向查过：

- **针对 Fedora 44 的缺陷条目**：没有找到任何一条讲 Fedora 44 上 Rembrandt 平台外接显示器、HDMI 或 DisplayPort 的问题。Fedora 44 对应的内核版本远新于 6.15.x。
- **针对这个机型的公开记录**：该机型在 Arch Wiki 上有独立页面，页面里记了麦克风检测、指纹阅读器、UEFI 设置项受限这几项，**完全没有提到视频输出**。同系列其他 RedmiBook 型号的 Linux 外接输出报告也没有找到可靠条目。
- **niri 仓库的外接屏 issue**：有 #3410（USB-C 扩展坞上因 EDID 读取时机导致显示器间歇性启用失败，已关闭）、#2782（休眠后不识别外接屏，已关闭）、#3509（唤醒后不检测显示器变化，仍开启）。这三个都讲的是“连接器已被识别、但在某个时机点丢失或读不到”的情形，**没有一条是 Rembrandt 平台上外接屏完全没有输出的记录**，与本机现象对不上。

有一条搜索结果需要单独说明，因为它最容易被直接套用。Red Hat Bugzilla #2374856 记录了一个内核回归：在 kernel 6.15 下，HDMI 副屏无信号，内核日志里能看到 amdgpu 的 `EDID CEA parser failed`；桌面设置里那块显示器却显示为“已启用”，开关和改分辨率都无效；6.15.4 修复（来源：[bugzilla.redhat.com/show_bug.cgi?id=2374856](https://bugzilla.redhat.com/show_bug.cgi?id=2374856)）。看起来很像，但**内核版本与机型都对不上**：报告者的机器是 Raphael 平台（GPU `1002:164e`），不是本机型；只在评论里有一条 Rembrandt 平台（ThinkPad T14s Gen 3，Ryzen 7 6850U）出现同现象的旁证，那也是别的机器。这一条只能说明“同代 AMD 平台出过这类问题”，不能用来解释本机这次的现象，更不能据此说是同一个原因。

所以这一节的结论就是一个否定结论：**没有找到成因，也没有找到已知缺陷**。我不打算在这里补一个听起来合理的解释。

**如果真要定位，还需要补采哪些证据。** 我没有继续往下查，是因为手上缺的不是推论，而是本机自己的数据。下面这些取自内核官方文档（来源：[Display Core Debug tools](https://docs.kernel.org/gpu/amdgpu/display/dc-debug.html)），是把问题分流到内核层还是合成器层最少需要的一份证据：

- **接口是不是真接上了。** 列出 `/sys/class/drm/` 下的连接器，看外接屏接上时有没有出现对应的连接器（例如 `card0-HDMI-A-1`），再逐个读 `status`，看是 `connected` 还是 `disconnected`。这一步同时回答了“这个 HDMI 口在内核里叫什么名字”，而这个名字是后面所有判断的前提。
- **内核有没有把显示组件拉起来。** 日志里 `<dm>`（Display Manager）IP 块那一行是否出现；若根本没有这一行，说明显示代码路径还没轮到就失败了，方向要换。
- **显示硬件的代际。** `dmesg | grep -i 'display core'`，取得 DC 与 DCN 版本，例如 “Display Core v3.2.285 initialized on DCN 3.2”。有了它才能和别的版本对比。
- **内核日志里的错误行。** `journalctl -k` 中 amdgpu 与 drm 相关的 ERROR/WARN 行，重点看有没有出现 `EDID`、`LTTPR`、`DMCUB`、`Error queueing DMUB command` 这类字样。
- **合成器这一侧看到了什么。** `niri msg outputs` 的输出，看外接屏有没有被列进输出列表。

这几项凑齐之后才能判断：是内核压根没启用连接器，还是内核启用了而合成器没把它纳入输出布局。在那之前，任何关于成因的说法都只是猜测，我不会写进这篇文章。

顺便记一条容易被抄错的偏方。内核参数 `amdgpu.dcdebugmask` 是真实存在的调试开关，但它的位含义以内核头文件里的枚举为准：`0x10` 是 `DC_DISABLE_PSR`，针对的是内屏面板自刷新这个省电特性，和“启用外接连接器”没有关系（来源：[amdgpu Module Parameters](https://docs.kernel.org/gpu/amdgpu/module-parameters.html) 与内核源码 `drivers/gpu/drm/amd/include/amd_shared.h`）。网上把它说成解决外接屏不识别的办法，是把内屏省电问题的偏方错用到了外接屏上。我用不上它。

### 充电时发热与风扇转速偏高

第二个问题是充电时的发热。插上电源充电时，这台机器在 Fedora 下的发热与风扇转速明显高于 Windows，面板发烫，风扇持续高速运转。Windows 下没有这个现象。

与上面那条一样，我没有去查它的成因，也没有找到对应的已知缺陷。两件事记在这里，是因为它们一起决定了这套系统在我这里的取舍：能用，但代价不低。

## 干净卸载 Fedora 与回收空间

**先说明：这一节写的是完整方案，截至成文尚未执行。** 下面的每一步都来自调研和我自己的推演，不是操作记录；我没有在这台机器上真的跑过它。我打算写完整，是因为卸载的次序里有几步一旦错过就很难补救，值得在动手之前先写清楚。

### 卸载为什么有个“顺序”

要在这台机器上移掉 Fedora 并把空间还给 Windows，按这个次序走，前两步不能调换：

准备一个 Fedora Live USB → 阶段 0 现场核对（只读）→ 在 Fedora 里删除固件启动项 → 重启进 Windows 复查 → 在 Windows 里删除 Fedora 的三个分区 → 把空间扩展回 C 盘 → 验收。

这里面有两个顺序理由。

**Live USB 必须在阶段 1 之前做好。** 它是两条备选路径的入口：一条是 Fedora 已经启动不了、只能在 Live 环境里删启动项；另一条是 Windows 的 `diskpart` 拒绝删除 Linux 的 ESP、只能回到 Linux 侧用 `gdisk` 或 `parted` 删。而 Fedora 一旦装不上、或者启动项已经被清掉，就做不出这个盘了。所以要在还能做的时候先做出来。

**删固件启动项必须在删分区之前。** 反过来做的话，那两条指向 Fedora 的启动项就会指向一个已经不存在的分区与文件，变成失效条目；想清理它们就得回到 Fedora Live 环境或 Windows 侧，而 Windows 侧的可靠入口并不存在——这一点我在下面单独说。

另外要澄清一个常见误解：删掉 NVRAM 里的启动项**不会**删除 ESP 分区里的引导文件，反过来删掉分区也不会自动清掉 NVRAM 里的启动项。这是两件事，所以两步都得做，缺一不可。

### 阶段 0：现场核对（只读）

这是整个操作里最重要的一步，因为**压缩前的原始分区表我没有留档**。安装时我明确决定跳过这一步，所以现在没有任何历史记录可以对照，眼前读出来的输出就是全部依据。

Windows 侧以管理员身份跑 `diskpart` 的 `list disk`、`select disk 0`、`list partition`、`list volume`，再打开磁盘管理的图形视图，两者互相印证；同时跑 `manage-bde -status`。要记下来的是：分区之间的先后顺序、每个分区的编号与容量、卷列表与盘符、BitLocker 状态。

Fedora 侧跑 `lsblk -f`、`efibootmgr -v`、`parted /dev/nvme0n1 print`、`ls /boot/efi/EFI/`、`lvm vgs`。其中 `efibootmgr -v` 的完整输出是阶段 1 的唯一依据，必须抄全——我脱敏之后不在文章里贴具体编号和完整启动顺序串。另外要检查 Windows 自己那个 ESP 里有没有混进 Fedora 的目录。我是双 ESP 布局，理论上不该有；如果有，那说明历史上被其他操作写入过，得单独记下来，因为它不会随 Fedora 分区一起消失。

这一步要落地的判据是：Linux 的 ESP 约 1 GiB、类型为 EFI System；`/boot` 约 1 GiB、ext4；根分区约 148 GiB、btrfs；三者相邻。三个分区的容量我都有记录，但**具体分区号只有 Linux 的 ESP 记下来过，另外两个没有留档**，必须现场读。这一阶段只查询，不执行任何写操作。

如果现场发现必须移动分区才能把空间还给 C 盘，这个方案不覆盖该情形，得另行评估。

### 阶段 1：趁 Fedora 还能启动，删掉固件启动项

这一步靠的就是“Fedora 还能正常启动”这个条件。`efibootmgr` 是修改 UEFI 启动管理器的用户空间程序，用 `-b` 指定条目、用 `-B` 删除，需要 root 权限，且要在 UEFI 模式下能访问 `/sys/firmware/efi/efivars`（来源：[efibootmgr 手册页](https://man.archlinux.org/man/efibootmgr.8.en)）。

要删的是安装器创建的两条 Fedora 项，其中一条是在用的，另一条疑似是坏项。编号以现场读出的输出为准，我在文章里不写。

有一条细节值得留意：手册里删除条目的示例原文是 “delete entry 4 and remove it from the BootOrder”，也就是**删除该项时会把它一并从启动顺序里移除**；上游源码里 `-B` 分支调用 `delete_var`，后者调用 `remove_from_order` 清理启动顺序（来源：[efibootmgr 上游源码](https://github.com/rhboot/efibootmgr/blob/main/src/efibootmgr.c)）。所以删完之后，Windows 的启动项应当自然排到第一位，通常不需要再手动设置顺序。但源码显示这一步只在“该编号出现在读到的启动项列表里”时才执行（这是根据源码逻辑做的推断），所以删完必须再看一眼输出里的启动顺序行，确认没有残留编号。

只有在需要显式调整顺序时才用 `efibootmgr -o`，它对启动顺序是整体覆盖，未列入的条目等于不在顺序里。这个机型上还有些来自网卡或固件内置的条目，要保留就得按原顺序补在 Windows 之后。**无法确定顺序时不要执行 `-o`，只做复查更安全。**

### 阶段 2：重启进 Windows 并复查

重启之后，预期不再出现 GRUB 菜单，直接进 Windows；如果固件因为顺序变量被改写而短暂停顿，按 F12 手动选 Windows Boot Manager 也应该能进去。

进去之后以管理员身份跑 `bcdedit /enum firmware`。**这一条是复查，不是清理手段。** 看输出里还有没有 Fedora 条目。要注意它展示的只是 BCD 可见的固件条目，和固件 NVRAM 里的完整列表不完全等同；完整核对 NVRAM 的可靠入口仍然是 Linux 侧的 `efibootmgr -v`（这是推断，因为官方文档没有给出 Windows 侧完整读取 NVRAM 启动项的途径）。所以这里看不到 Fedora 条目，就可以认为已经干净；如果看到残留，正确做法是回到阶段 1 的路径用 `efibootmgr` 处理。

我不推荐在 Windows 里用 `bcdedit /delete` 删非 Windows 的固件引导项。微软官方文档里记载过的是用 `bcdedit` 调整启动顺序（来源：[BCD System Store Settings for UEFI](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/bcd-system-store-settings-for-uefi)），但没有记载用它删除非 Windows 条目；而且用错对象有可能删掉 Windows 自己的引导项。所以 Windows 侧我保留的动作只有只读的 `bcdedit /enum firmware`。

如果这一步启动异常，立即停手，不要再动分区表。

### 阶段 3：删除三个 Linux 分区——真正不可逆的一步

**前面三个阶段都不改动磁盘分区表，随时可以中止。** 如果只做到阶段 1 就停下，Fedora 的分区还在，只是开机不再出现 Fedora 菜单。到这一步才真的开始动磁盘，而**删掉的分区无法通过 Windows 自带工具恢复**。

先把前置确认做完：BitLocker 仍处于关闭状态；阶段 0 记录的分区号、容量、位置与实际一致；确认要删的是 Linux 的三个分区，不是 Windows 的 ESP、MSR、C 盘、D 盘或恢复分区。本机未启用磁盘加密，这是之前确认过的。但如果将来是在启用状态下做这件事，必须先暂停 BitLocker 并确认恢复密钥在手——微软的 BitLocker FAQ 明确把“更改任何启动配置设置”以及 BIOS、UEFI 固件、主引导记录、引导扇区、启动管理器相关的变更列进了会触发完整性校验、因而要求恢复密钥的清单（来源：[BitLocker FAQ](https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/faq)）。

要删的就是三个普通 GPT 分区：约 1 GiB 的 FAT32 EFI System、约 1 GiB 的 ext4、约 148 GiB 的 btrfs。这里要纠正一个我自己一开始也差点照抄的前提：**这台机器上没有 LVM**。Fedora 的默认布局常被描述成 LVM，一些卸载教程第一句就是“先删除卷组”，但本机是 btrfs 根分区加 ext4 `/boot`，没有 LVM，也没有单独的 swap 分区（Fedora 从 33 起默认用 zram 在内存里做交换）。所以 `vgremove`、`lvremove`、`pvremove` 这类步骤在这里没有对象，写进来只会让人以为漏了一步。这可以用阶段 0 的 `lvm vgs` 和 `lsblk -f` 印证。

命令是在管理员权限的 `diskpart` 里逐个 `select partition` 加 `delete partition override`，分区号以阶段 0 的记录为准。用 `override` 的理由是微软的说明原文：“Enables DiskPart to delete any partition regardless of type. Typically, DiskPart only permits you to delete known data partitions.”，同一页也说明它可用于删除无法识别的 GPT 分区（来源：[delete partition 命令](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/delete-partition)），这正对应本机的情况：Linux 的分区在 Windows 眼里未必是有盘符的数据分区，普通的 `delete partition` 会被拒绝。

**删之前对每个分区做一次 `detail partition`**，它会列出该分区的类型 GUID 与属性，用来确认选中的确实是那三个分区，而不是 Windows 正在用的 ESP 或系统分区。我注意到一个判据上的细节：Windows 拦住删除的依据是“它是不是当前系统的系统或引导分区、有没有活动页面文件与崩溃转储”，而不是“分区里装的是谁的引导文件”（这是推断），所以独立存在、只放 Fedora 引导文件的 ESP，与 Windows 当前的 ESP，应该能在这份输出里区分开。

**这里有一处官方没有明说，必须标为未核实。** 同一页写明不能删除系统分区、引导分区、含活动页面文件或崩溃转储的分区。那么 Linux 自己那个标记为 EFI System 的分区，究竟算“系统分区/引导分区”还是算普通数据分区，官方没有明说。它确实是引导分区，但引导的不是 Windows。我找到的一例微软问答里，有人用 `delete partition override` 删掉了类型为 EFI System 的分区，但**那一例删的正是 Windows 自己在用的 ESP**，所以它只证明这类分区可以被 `override` 删掉，不证明 Linux 的 ESP 一定可删（来源：[微软 Q&A 该例](https://learn.microsoft.com/en-us/answers/questions/4279687/how-to-remove-the-partition-created-in-efi-volume)）。综合判断是大概率能删，但没有来源直接证实或证伪。

所以这一步的正确处理是先按命令尝试，同时备好另一条路：**如果 `diskpart` 因为该分区被识别为引导分区或系统分区而拒绝，不要为了绕过它去清标记、更不要删 Windows 的 ESP，改用 Fedora Live USB 启动，在 Live 环境里用 Linux 侧的分区工具删除这三个分区。** 有手册依据的两种做法是 `gdisk` 里用 `d` 删分区（手册写明它只删分区表条目、不动原分区里的数据，且“在显式写回磁盘之前不修改磁盘结构”，所以必须用 `w` 写回才生效，用 `q` 退出等于放弃全部改动，来源：[gdisk 手册页](https://man.archlinux.org/man/gdisk.8.en)）和 `parted` 的 `rm` 子命令（来源：[parted 手册页](https://man7.org/linux/man-pages/man8/parted.8.html)）。两者都按 GPT 类型码操作、不看分区里装的是什么，所以应当能直接删掉类型为 EFI System 的分区，不必先改类型（这是推断）。另外有两个操作前提：分区若正被挂载需要先卸载，否则工具会报分区忙；删完用 `partprobe /dev/nvme0n1` 让内核重读分区表。这两条是机制上的要求，我没有取到官方来源，标为未核实。

`fdisk` 的 `d` 在实机上确实可用，但 `fdisk(8)` 手册页没有命令章节，查不到 `d` 的出处，所以我不把它列为有依据的做法。

**这一步必须在 Live USB 之前想清楚的一点是：Fedora 到这个时候已经启动不了了，走备选路径只能靠 Live USB。** 这就是为什么它要排在阶段 1 之前。

### 阶段 4：把空间扩展回 C 盘

删掉三个分区之后，空出来的未分配区域应当紧邻 C 盘右侧。这是全篇最关键的一个判断，而它是**推测**：依据只是安装时那段未分配空间是从 C 盘压缩出来的、落在 C 盘之后、D 盘之前，实际是否如此必须靠阶段 0 的现场核对兜住。

微软对扩展卷的前提是明确的（来源：[Extend a basic volume](https://learn.microsoft.com/en-us/windows-server/storage/disk-management/extend-a-basic-volume)）：未分配空间必须紧邻待扩展卷的右侧，中间隔任何卷都不行，原文是 “If there are any other volumes between the volume to extend and the unallocated space, you can't extend the volume”；必须在同一块磁盘上；卷必须是 NTFS 或 ReFS；磁盘大于 2TB 时必须是 GPT。C 盘是 NTFS，前三条满足，GPT 这一条要看整盘容量，阶段 0 会读出来。

操作就是在磁盘管理里右键 C 盘选“扩展卷”，把“选择空间量”拉到最大；也可以用 `diskpart` 的 `select volume C` 加 `extend`。这里有一个容易多此一举的地方：**不要重试第二条命令来“多扩一点”**。一次 `extend` 会一次用完全部紧邻的未分配空间，连续执行第二次没有意义，也不会跨过中间的分区。

网上有一句流传很广的话是“双系统卸载后 C 盘一定扩不了”，理由是恢复分区常常夹在 C 盘与未分配空间之间。**这条不适用于本机**，因为 Fedora 的三个分区是建在 C 盘压缩出来的那段空间里的。但我没有把“扩展卷一定可用”写成本文结论，而是把它写成分支：如果扩展卷变灰，就按顺序排查——先看未分配空间和 C 盘之间是否夹着别的分区；如果夹的是 Windows 恢复分区，那就是前提里说的“中间隔任何卷”，**不要为了这点空间去删恢复分区或 ESP**；如果扩展量比删掉的总量少几 GiB，那是分区对齐产生的零头，留着未分配即可；如果图形界面报错而 `diskpart` 可用（或反过来），换另一个入口再试一次。

微软对 ESP 与恢复分区有一条明确提示：它们在磁盘管理里可能被显示为 100% 空闲，但保存着关键文件，官方建议不要以任何方式修改这两类分区（来源：[Overview of Disk Management](https://learn.microsoft.com/en-us/windows-server/storage/disk-management/overview-of-disk-management)）。为了凑容量删掉它们，会破坏 Windows 自身的启动或恢复能力，不值得。

我不推荐任何第三方分区工具。我没有核实过它们的行为，如果现场核对发现必须移动分区才能把空间还给 C 盘，这个方案不覆盖该情形，需另行评估。

### 阶段 5：验收

逐条核对，全部通过才算完成：

- Windows 能正常启动，不需要按 F12 手动干预。
- 开机没有被要求输入 BitLocker 恢复密钥。**如果被要求，说明有变更触发了完整性校验**，用保存的恢复密钥解锁后复查 `manage-bde -status`。
- 磁盘管理里没有异常：没有显示未知分区、没有出现丢失的卷、没有弹出需要初始化的提示。
- `bcdedit /enum firmware` 输出里没有 Fedora 条目。
- C 盘容量比操作前变大，扩大幅度与删除的三个分区总量接近（差几 GiB 属对齐零头），用阶段 0 记录的容量做对照。
- Fedora 相关的三个分区（1 GiB FAT32 的 EFI System、1 GiB ext4、约 148 GiB btrfs）已消失。
- D 盘、Windows 的 ESP、MSR 与恢复分区（若存在）都在，容量未变。
- 如果阶段 0 在 Windows 的 ESP 里发现过 Fedora 的引导目录，确认它已按计划处理。

### 我写这一节的目的不是给出一份可以直接照做的清单

我没有执行过它，所以它不能当作“这样做一定没问题”的保证。我把它写下来，主要是为了在动手之前把不可逆的那一步标出来，并把还需要现场确认的项列清楚。成文之后如果我真的执行了，这一节需要按实际结果重写，而不是保留现状。

## 来源与核实程度

写这篇教程的过程中，我把手上的信息按来源分了三档，尽力在每一节里都标出来。

**有官方一手来源的**：内核参数与显示调试的说明取自 Linux 内核官方文档（[amdgpu Module Parameters](https://docs.kernel.org/gpu/amdgpu/module-parameters.html)、[Display Core Debug tools](https://docs.kernel.org/gpu/amdgpu/display/dc-debug.html)）；`efibootmgr` 的行为取自它的手册页与上游源码；`diskpart` 删除分区、扩展卷的前提、ESP 与恢复分区的注意事项、BitLocker 的完整性校验清单、BCD 的相关记载，都取自微软的官方文档；`gdisk` 与 `parted` 的删除行为取自它们的手册页。这些在正文里都写了“来源：”。

**有可核验条目、但不能用来解释本机现象的**：Red Hat Bugzilla #2374856 这个内核回归，条目本身是公开可查的，但报告者的平台与内核版本都和本机对不上，所以我在该机型的已知问题那一节只把它当作“同代 AMD 平台出过这类问题”的旁证，没有用它解释本机的现象。niri 仓库的三个外接屏 issue 同理，可以作为“合成器这一层出过什么类型的问题”的参考，但它们讲的都不是本机这种情形。

**属于推断的**：干净卸载那一节里“删掉三个分区后未分配空间紧邻 C 盘右侧”这一条是全篇最关键的推断，依据只是安装时的压缩位置，必须靠现场核对确认；“删完启动项后 Windows 会自动排到第一位”“`diskpart` 会因为分区是当前系统分区而拒绝删除”这类也标了“这是推断”。

**明确没有取到来源、因此写成未核实的**：Windows 侧完整读取 NVRAM 启动项是否可行、`bcdedit /delete` 能否删除非 Windows 的固件引导项、Live 环境里卸载分区与 `partprobe` 的要求、`fdisk` 的 `d` 的出处、以及该机型固件在启动项指向失效文件时的具体回退行为。这些在正文里都写明了“我没有取到官方来源”。

**最后要说清楚的一件事**：该机型的已知问题那一节里那个 HDMI 无输出的问题，**我没有定位到成因，也没有找到对应的已知缺陷**。我查到的最接近的一条是内核 6.15 的一个回归，但内核版本与机型都对不上。谁如果要在网上找这个问题的答案，请把这一点考虑进去：目前公开记录里没有它的答案，包括这篇文章。

最后交代核查日期：2026-10-19。
