---
title: 目前新建文章使用的模板
date: 2025-02-07
lastmod: 
image: code.jpg
categories:
    - 技术
tags:
    
---

## 模板如下

```markdown
---
title: {{ replace .Name "-" " " | title }}
date: {{ (time .Date).Format "2006-01-02" }}
lastmod: 
image: 
categories:
    - 
tags:
    - 
---


```
