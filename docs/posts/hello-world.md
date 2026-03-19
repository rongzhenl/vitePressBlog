---
title: 博客搭建完成，Hello World！
date: 2026-03-19
tags: [博客, VitePress]
description: 记录这个技术博客的搭建过程，以及为什么选择 VitePress。
---

# 博客搭建完成，Hello World！

终于把博客搭起来了。这篇文章记录一下选型思路和搭建过程。

## 为什么选 VitePress

之前试过 Hexo、Hugo、Jekyll，最终选了 VitePress，原因很简单：

**写作体验最好**。新建一个 `.md` 文件，写完保存，就是一篇文章。不需要运行任何命令，不需要打开后台，不需要学习模板语法。

**代码高亮开箱即用**。内置 Shiki，支持 100+ 语言，深色/浅色主题自动切换，行号、高亮行都支持。

**全文搜索内置**。不需要接入 Algolia，本地搜索直接可用。

## 写作流程

```
docs/posts/
├── hello-world.md      ← 这篇文章
├── my-second-post.md
└── ...
```

每篇文章的开头写 Front Matter：

```yaml
---
title: 文章标题
date: 2026-03-19
tags: [标签1, 标签2]
description: 文章摘要，显示在列表页
---
```

然后正文就是普通 Markdown，没有任何额外规则。

## 部署

推送到 GitHub，Vercel 自动构建部署，全程不需要手动操作。

---

接下来会陆续整理一些技术笔记，主要是工作中遇到的问题和解决方案。
