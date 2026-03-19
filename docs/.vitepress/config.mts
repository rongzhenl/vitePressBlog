import { defineConfig } from 'vitepress'
import { createRssFile } from './rss'

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
      { text: '关于', link: '/about' },
    ],

    // 侧边栏（文章目录自动生成）
    sidebar: {
      '/posts/': [
        {
          text: '所有文章',
          items: [
            { text: '文章列表', link: '/posts/' },
          ],
        },
      ],
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/rongzhenl' },
    ],

    // 页脚
    footer: {
      message: '用 VitePress 构建',
      copyright: `Copyright © ${new Date().getFullYear()}`,
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

    // 文章页配置
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

    // 编辑链接（改为你的 GitHub 仓库地址）
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
  },

  // ── 构建钩子：生成 RSS ────────────────────────────────────
  buildEnd: createRssFile,
})
