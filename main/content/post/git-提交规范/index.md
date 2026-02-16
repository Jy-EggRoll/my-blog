---
title: Git 提交规范
description:
date: 2026-02-16
lastmod: 2026-02-16
image:
categories:
    - 技术
tags:
    - Git
    - 规范
weight:
---

## 引言

开始正式学习 Angular 的 Git 提交规范，并把我的所有文件的规范迁移过去。

下面是官方文档：

<https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md>

根据官方文档，我提取出如下关键部分，全部译自原文，未经任何更改。

- `build` 影响构建系统或外部依赖的变更
- `ci` 对 CI 配置文件和脚本的修改
- `docs` 仅文档相关的变更
- `feat` 新功能
- `fix` 修补 Bug
- `perf` 提高性能的代码更改
- `refactor` 代码重构（既不修复 Bug 也不添加功能的代码更改）
- `test` 添加缺失的测试或修正现有的测试

我在遵循该规范前，一直遵循 <https://gitmoji.dev/> 项目，在 emoji 的使用上，逐渐形成了自己的一套标准。直接的文字是不易一眼看出重点部分的，接下来我将结合 Gitmoji 和 Angular 规范做我自己的改造。

## 改造

| 规范类型（Type） | Angular 规范的中文翻译            | Gitmoji 官方定义的中文翻译                     |
| :--------------- | :-------------------------------- | :--------------------------------------------- |
| **📦️ build**     | 影响构建系统或外部依赖的变更      | `:package:` 新增或更新编译后的文件或包         |
| **👷 ci**        | 对 CI 配置文件和脚本的修改        | `:construction_worker:` 新增或更新 CI 构建系统 |
| **📝 docs**      | 仅文档相关的变更                  | `:memo:` 新增或更新文档                        |
| **✨ feat**      | 新功能                            | `:sparkles:` 引入新功能                        |
| **🐛 fix**       | 修补 Bug                          | `:bug:` 修复 Bug                               |
| **⚡️ perf**      | 提高性能的代码更改                | `:zap:` 提高性能                               |
| **♻️ refac**     | 代码重构（不修复 Bug 也不加功能） | `:recycle:` 重构代码                           |
| **✅ test**      | 添加缺失的测试或修正现有的测试    | `:white_check_mark:` 新增、更新或通过测试      |
| **🔖 tag**       | 发布新版本                        | `:bookmark:` 发行/版本标签                     |
| **💥 boom**      | 重大破坏性更改                    | `:boom:` 引入破坏性变更（Breaking Changes）    |
| **⚗️ alem**      | 实验性改动                        | `:alembic:` 进行实验性研究                     |
| **🎉 tada**      | 初始化仓库                        | `:tada:` 开始一个项目                          |
| **🔨 chore**     | 不属于上述任何部分的杂项变更      | `:hammer:` 新增或更新开发脚本                  |

在 Angular 规范的基础上，以下几项是我个人新增的，这些用法我已经养成了习惯，且和官方的规范相比起来，基本没有冲突，也比较合适，将其作为小的补充：

- `🔖 tag` 发布新版本
- `💥 boom` 重大破坏性更改
- `⚗️ alem` 实验性改动
- `🎉 tada` 初始化仓库
- `🔨 chore` 不属于上述任何部分的杂项变更

另外，规范中 `refactor` 的类型名较长，我将其精简到五个字符，不影响易读性。

至此，我个人的规范将应用在输入法缩写和日后的一切 Git 提交中。

常用输入法缩写如下（Rime `custom_phrase.txt`）：

```text
📦️ build: 	bd
👷 ci: 	ci
📝 docs: 	dc
✨ feat: 	ft
🐛 fix: 	fx
⚡️ perf: 	pf
♻️ refac: 	rf
✅ test: 	ts
🔖 tag: 	tg
💥 boom: 	bm
⚗️ alem: 	al
🎉 tada: 	td
🔨 chore: 	ch
🔨 chore: 常规文件更新	cg
```
