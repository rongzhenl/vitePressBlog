---
title: 用 VitePress 搭建个人技术博客并部署到 GitHub Pages
date: 2026-03-19
tags: [VitePress, GitHub Pages, 博客搭建, Vue]
description: 从零搭建一个支持代码高亮、全文搜索、深色模式、RSS 订阅、评论系统的个人技术博客，并通过 GitHub Actions 自动部署到 GitHub Pages。
---

# 用 VitePress 搭建个人技术博客并部署到 GitHub Pages

这篇文章记录这个博客从零到上线的完整过程，包括技术选型、目录结构、各功能实现细节，以及 GitHub Pages 自动部署配置。

## 技术选型

市面上静态博客方案很多，最终选择 VitePress 的原因：

**写作体验极简**：新建 `.md` 文件即是一篇文章，Front Matter 配置元信息，正文写普通 Markdown，没有任何额外规则。

**功能开箱即用**：代码高亮（Shiki）、全文搜索、深色/浅色主题切换、响应式布局，全部内置，不需要额外插件。

**Vue 生态**：可以在 Markdown 中直接使用 Vue 组件，扩展性强。

**构建极快**：基于 Vite，冷启动和热更新都很快。

## 环境准备

需要 Node.js 18+，可以用 `node -v` 确认版本。

```bash
node -v   # v18.0.0 以上即可
npm -v
```

## 初始化项目

```bash
mkdir blog && cd blog
npm init -y
npm install -D vitepress
```

在 `package.json` 中添加 `"type": "module"`（VitePress 是纯 ESM 包，必须加），并配置脚本：

```json
{
  "type": "module",
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  }
}
```

## 目录结构

```
blog/
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts          # 站点配置
│   │   ├── rss.ts              # RSS 生成器
│   │   └── theme/
│   │       ├── index.ts        # 主题入口
│   │       ├── components/     # Vue 组件
│   │       │   ├── ReadingProgress.vue
│   │       │   ├── GiscusComment.vue
│   │       │   ├── PostList.vue
│   │       │   └── TagList.vue
│   │       ├── composables/
│   │       │   └── usePostData.ts
│   │       └── styles/
│   │           ├── vars.css    # CSS 变量（主题色）
│   │           └── custom.css  # 全局样式
│   ├── posts/
│   │   ├── index.md            # 文章列表页
│   │   └── my-first-post.md    # 文章
│   ├── posts.data.ts           # Data Loader（自动扫描文章）
│   ├── index.md                # 首页
│   ├── tags.md                 # 标签页
│   └── about.md                # 关于页
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions 自动部署
├── .gitignore
└── package.json
```

## 核心配置文件

### `docs/.vitepress/config.mts`

这是整个站点的配置中心，关键配置项：

```typescript
import { defineConfig } from 'vitepress'
import { createRssFile } from './rss'

export default defineConfig({
  title: '技术笔记',
  description: '记录技术探索，分享开发经验',
  lang: 'zh-CN',

  // 部署到 GitHub Pages 必须设置为仓库名
  base: '/your-repo-name/',

  // 图片懒加载、代码行号
  markdown: {
    lineNumbers: true,
    image: { lazyLoading: true },
    theme: { light: 'github-light', dark: 'github-dark' },
  },

  // 内置全文搜索，无需 Algolia
  themeConfig: {
    search: { provider: 'local' },
    // ... 导航、侧边栏等配置
  },

  // 构建完成后生成 RSS
  buildEnd: createRssFile,
})
```

::: warning 注意 base 路径
部署到 GitHub Pages 时，`base` 必须设置为 `'/仓库名/'`，否则静态资源路径会出错。如果使用自定义域名则设为 `'/'`。
:::

### `docs/posts.data.ts`（Data Loader）

VitePress 的 Data Loader 在构建时扫描所有文章，提取 frontmatter 元数据，供文章列表、标签页等组件使用：

```typescript
import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw) {
    return raw
      .filter(({ url, frontmatter }) =>
        frontmatter.title && !url.endsWith('/posts/')
      )
      .map(({ url, frontmatter, excerpt }) => ({
        url,
        title: frontmatter.title,
        date: frontmatter.date ?? '',
        tags: frontmatter.tags ?? [],
        excerpt: frontmatter.description
          ?? excerpt?.replace(/<[^>]+>/g, '').slice(0, 120),
        readingTime: Math.max(1, Math.ceil(
          (excerpt ?? '').replace(/<[^>]+>/g, '').length / 300
        )),
      }))
      .sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
  },
})
```

注意过滤掉 `posts/index.md` 本身（`!url.endsWith('/posts/')`），否则列表页会把自己也列进去。

## 自定义主题

### 主题入口 `theme/index.ts`

```typescript
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ReadingProgress from './components/ReadingProgress.vue'
import GiscusComment from './components/GiscusComment.vue'
import './styles/custom.css'
import './styles/vars.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'layout-top': () => h(ReadingProgress),  // 顶部进度条
    'doc-after': () => h(GiscusComment),     // 文章底部评论
  }),
  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('TagList', TagList)
  },
} satisfies Theme
```

VitePress 提供了丰富的 Layout Slots，`layout-top` 插入页面顶部，`doc-after` 插入文章正文之后。

### 阅读进度条

监听 `scroll` 事件，计算 `scrollY / (documentHeight - windowHeight)` 得到百分比，用 CSS `width` 驱动进度条动画：

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
const visible = ref(false)

function updateProgress() {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight <= 0) return
  progress.value = Math.min(100, Math.round((scrollTop / docHeight) * 100))
  visible.value = scrollTop > 50
}

onMounted(() => window.addEventListener('scroll', updateProgress, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', updateProgress))
</script>
```

### 评论系统（Giscus）

Giscus 基于 GitHub Discussions，无需数据库，评论数据存在仓库的 Discussions 里。

配置步骤：
1. 访问 [giscus.app](https://giscus.app/zh-CN)，填入仓库名
2. 在仓库 Settings → Features 中开启 Discussions
3. 安装 [Giscus GitHub App](https://github.com/apps/giscus)
4. 将生成的 `repoId`、`categoryId` 填入组件配置

主题跟随深色/浅色切换的关键：通过 `postMessage` 通知 Giscus iframe 更新主题：

```typescript
watch(isDark, (dark) => {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: dark ? 'dark_dimmed' : 'light' } } },
    'https://giscus.app'
  )
})
```

## RSS 订阅

安装 `feed` 库：

```bash
npm install -D feed
```

在 `config.mts` 的 `buildEnd` 钩子中调用生成函数，扫描 `posts/` 目录读取 frontmatter，生成标准 RSS 2.0 格式的 `feed.xml` 输出到构建产物目录。

## 写作流程

在 `docs/posts/` 下新建 `.md` 文件，开头写 Front Matter：

```yaml
---
title: 文章标题
date: 2026-03-19
tags: [标签1, 标签2]
description: 摘要，显示在文章列表页
---
```

正文写 Markdown，本地运行 `npm run dev` 实时预览，写完推送到 GitHub 自动部署。

## 部署到 GitHub Pages

### 配置 GitHub Actions

在 `.github/workflows/deploy.yml` 中配置自动构建部署流程：

```yaml
name: Deploy Blog

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # 获取完整历史，用于 lastUpdated

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

`fetch-depth: 0` 是关键，不加的话 VitePress 的「最后更新时间」功能会失效（因为拿不到 git 历史）。

### 开启 GitHub Pages

1. 进入仓库 **Settings → Pages**
2. **Source** 选择 **GitHub Actions**
3. 点 **Save**

之后每次 push 到 `main` 分支，Actions 自动触发构建和部署，约 1-2 分钟后生效。

部署完成后访问地址：`https://你的用户名.github.io/仓库名/`

## 日常维护

新写一篇文章只需三步：

```bash
# 1. 在 docs/posts/ 下新建 .md 文件，写内容
# 2. 提交
git add docs/posts/new-article.md
git commit -m "post: 文章标题"

# 3. 推送，GitHub Actions 自动部署
git push
```

整个过程不需要打开任何后台，不需要手动触发构建，推送即发布。
