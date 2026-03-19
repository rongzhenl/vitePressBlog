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

## 博客效果预览

搭建完成后的首页效果：

![博客首页截图](./images/blog-homepage.png)

左上角是站点 Logo 和名称，顶部导航包含文章、标签、关于页，中间是 Hero 区域，底部是三栏特性卡片。深色模式下顶部会出现蓝色阅读进度条。

::: tip 图片路径说明
图片放在文章同级的 `images/` 目录下，用**相对路径** `./images/文件名.png` 引用。这样本地 Markdown 编辑器（VSCode、Typora 等）、`npm run dev` 本地预览、GitHub Pages 线上部署三端都能正常显示，不会出现路径错误。
:::

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

推送到 GitHub，GitHub Actions 自动构建并部署到 GitHub Pages，全程不需要手动操作。详细搭建过程记录在 [这篇文章](./vitepress-blog-setup) 里。

---

接下来会陆续整理一些技术笔记，主要是工作中遇到的问题和解决方案。
