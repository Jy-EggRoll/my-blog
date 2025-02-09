---
title: 目前新建文章使用的模板
date: 2025-02-07
lastmod: 2025-02-09
categories:
    - 技术
tags:
    
---

## 模板如下

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
---


```

## 模板位置

`my-blog\main\archetypes\default.md`
