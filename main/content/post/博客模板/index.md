---
title: Hugo 新建文章使用的模板 | Hugo New Post Template
date: 2025-02-07
lastmod: 2025-06-27
categories:
    - 技术
tags:
    - hugo
    - template
    - 模板
---

## 模板如下 | The template is as follows

```markdown
---
title: {{ replace .Name "-" " " | title }}
description: 
date: {{ (time .Date).Format "2006-01-02" }}
lastmod: {{ (time .Date).Format "2006-01-02" }}
image: 
categories:
    - 
tags:
    - 
weight: 
---


```

## 模板位置 | Template Location

`my-blog\main\archetypes\default.md`
