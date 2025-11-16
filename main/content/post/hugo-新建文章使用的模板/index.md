---
title: Hugo 新建文章使用的模板
date: 2025-02-07
lastmod: 2025-07-26
categories:
    - 技术
tags:
    - hugo
    - 模板
---

## 引言

新建文章时，采用脚手架会节省大量的时间，我把我模板的配置分享出来，供大家参考。

### 代码片段模板（由 VSCode 调用）

```json
{
    "博客头信息": {
        "prefix": "bh",
        "body": [
            "---",
            "title: ",
            "description: ",
            "date: $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE",
            "lastmod: $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE",
            "image: ",
            "categories:",
            "    - ",
            "tags:",
            "    - ",
            "weight: ",
            "---",
            "",
            ""
        ],
        "description": "博客文章头信息模板"
    }
}
```

### Markdown 文件模板（由 Hugo 调用）

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
