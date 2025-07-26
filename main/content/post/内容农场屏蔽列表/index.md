---
title: 内容农场屏蔽列表
description: 适用于 AdGuard 插件的内容农场屏蔽列表
date: 2025-07-25
lastmod: 2025-07-25
image: 
categories:
    - 技术
tags:
    - 内容农场
    - 配置
weight: 
---

## 引言

之前的文章有提到过内容农场的问题，在许多屏蔽方法中，自定义性最强的就是使用广告屏蔽插件的自定义规则。我偏好使用 AdGuard，在此文中，我将维护一个 AdGuard 屏蔽列表，并不断更新。

## 列表

```txt
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(csdn.net):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(gitcode.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(huaweicloud.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(quickcreator.cn):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(zhanid.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(pingcode.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(deali.cn):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(dongaigc.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(iis8.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(deepinout.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(51cto.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(linux-console.net):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(nodejs.cn):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(baidu.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(pconline.com.cn):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(xitongzhijia.net):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(ee186.cn):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(17golang.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(jb51.net):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(dadighost.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(xitong86.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(xpwin7.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(xiaobaihao.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(pe8.net):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(vqs.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(meiwenyun.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(nodejs.com.cn):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(runoob.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(nodeapp.cn):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(w3cschool.cn):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text(cloud.tencent.com):upward(6)
bing.com#?##b_results > li > div.b_tpcn > a > div.tptxt > div.tpmeta > div > cite:has-text():upward(6)
```

## 使用方法

1. 安装 AdGuard 浏览器插件
2. 打开 AdGuard 的设置界面
3. 打开“用户过滤器”
4. 将以上内容复制下来，粘贴到“用户过滤器”中
5. 点击“保存”

刷新网页后，您将可以看到内容农场被完全屏蔽了。唯一缺点是，搜索页上的展示数量会大大减少，有时会看到没有结果的尴尬局面。不过，在我看来，如果真的出现了这种情况，恐怕就要考虑换个问法，甚至换个搜索引擎了。

## 自定义

如果您有其他内容农场需要屏蔽，可以在上述规则的基础上进行修改。AdGuard 的规则语法非常灵活，您可以根据需要添加或删除规则。此部分可以出一个教程，日后再完善。
