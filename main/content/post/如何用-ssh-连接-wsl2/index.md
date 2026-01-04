---
title: 如何用 SSH 连接 WSL2
description: 
date: 2026-01-04
lastmod: 2026-01-04
image: 
categories:
    - 技术
tags:
    - WSL2
    - SSH
weight: 
---

## 引言

首先，我想说明一下为什么会写这样一篇文章。

我最近在使用 VS Code 远程连接主机，但是遇到了一些问题。举例来说，我发现加入在 Windows 上启用 SSH Server，然后用 VS Code 连接到 Windows，再进入 Windows 上的 WSL2，再启用 WSL2 中的容器就会失败。这种层层嵌套导致失败的原因我已经暂时研究明白了，但是本文先不再赘述，防止偏离主题。

本文旨在成为目前互联网上最全面、最实用、最可复现的关于“如何通过 SSH 访问 WSL2（例如 Fedora 43）”的文档。

文中，每一步都会解释为什么要这么做、命令每个参数的含义、常见陷阱与对应的排查方法。

## 安装 WSL2

见 [WSL 使用指南](https://eggroll.pages.dev/p/wsl-使用指南/)。

## 安装发行版

见 [WSL 使用指南](https://eggroll.pages.dev/p/wsl-使用指南/)。

## 进入发行版的操作

### 安装 SSH 服务

以我使用的 Fedora 43 这一发行版作为例子：

```bash
sudo dnf install -y openssh-server
```

以 systemd 启动 ssh：

```bash
sudo systemctl enable --now sshd
```

### 获取 WSL 的 ip 地址

```bash
ip -4 addr show eth0 | awk '/inet /{print $2}' | cut -d/ -f1
```

## 在宿主机的操作

### 配置端口转发

请为 Windows 启动 `sudo`，否则以下操作则必须使用管理员权限的终端运行。

```pwsh
sudo netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=2222 connectaddress=<在上一步获取到的 ip 地址> connectport=22
```

### 配置防火墙

```pwsh
sudo netsh advfirewall firewall add rule name="WSL SSH 2222" dir=in action=allow protocol=TCP localport=2222
```

### 在宿主机上测试

```pwsh
ssh <在 WSL 发行版中的用户名>@localhost -p 2222
```

## 在其他机器上的操作

```pwsh
ssh <在 WSL 发行版中的用户名>@<宿主机的 ip> -p 2222
```

## 余下的步骤（在宿主机上操作）

查看端口转发：

```pwsh
sudo netsh interface portproxy show all
```

删除端口转发：

```pwsh
sudo netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=2222
```

删除防火墙规则：

```pwsh
sudo netsh advfirewall firewall delete rule name="WSL SSH 2222" protocol=TCP localport=2222
```
