import { defineConfig } from 'vitepress'
import { createRssFile } from './rss'
import mathjax3 from 'markdown-it-mathjax3'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // ── 站点基本信息 ──────────────────────────────────────────
  title: '技术笔记',
  description: '记录技术探索，分享开发经验',
  lang: 'zh-CN',

  // GitHub Pages 部署，仓库名作为子路径
  base: '/vitePressBlog/',

  // ── 构建配置 ──────────────────────────────────────────────
  cleanUrls: true,
  lastUpdated: true,

  // ── Head 注入 ─────────────────────────────────────────────
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'RSS', href: '/feed.xml' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    // MathJax 样式
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js' }],
  ],

  // ── 主题配置 ──────────────────────────────────────────────
  themeConfig: {
    // 站点 Logo 与名称
    logo: '/favicon.svg',
    siteTitle: '技术笔记',

    // 顶部导航
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '标签', link: '/tags' },
      {
        text: '更多',
        items: [
          { text: '关于', link: '/about' },
          { text: 'RSS 订阅', link: '/feed.xml' },
        ],
      },
    ],

    // 侧边栏
    sidebar: {
      '/posts/': [
        {
          text: '📚 文章归档',
          collapsed: false,
          items: [
            { text: '所有文章', link: '/posts/' },
          ],
        },
        {
          text: '🏷️ 标签',
          collapsed: true,
          items: [
            { text: '浏览标签', link: '/tags' },
          ],
        },
        {
          text: '🔗 快速导航',
          collapsed: true,
          items: [
            { text: '关于', link: '/about' },
            { text: 'GitHub', link: 'https://github.com/rongzhenl' },
          ],
        },
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/rongzhenl' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/></svg>',
        },
        link: '/feed.xml',
        ariaLabel: 'RSS 订阅',
      },
    ],

    // 页脚
    footer: {
      message: '用 VitePress 构建 · <a href="/vitePressBlog/feed.xml">RSS 订阅</a>',
      copyright: `Copyright © ${new Date().getFullYear()} · <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh" target="_blank">CC BY-NC-SA 4.0</a>`,
    },

    // 全文搜索（内置，无需额外配置）
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文章',
                buttonAriaLabel: '搜索',
              },
              modal: {
                noResultsText: '没有找到相关结果',
                resetButtonTitle: '清除搜索',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },

    // 文章页右侧目录（展示 h2 + h3）
    outline: {
      label: '本文目录',
      level: [2, 3],
    },

    // 上/下篇导航
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/rongzhenl/vitePressBlog/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
  },

  // ── Markdown 配置 ─────────────────────────────────────────
  markdown: {
    // 代码块行号
    lineNumbers: true,
    // 图片懒加载
    image: {
      lazyLoading: true,
    },
    // 代码块主题（深色/浅色各一套）
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    // 数学公式支持
    config: (md) => {
      md.use(mathjax3)
    },
  },

  // ── 构建钩子：生成 RSS ────────────────────────────────────
  buildEnd: createRssFile,
})
