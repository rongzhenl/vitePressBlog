import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import ReadingProgress from './components/ReadingProgress.vue'
import GiscusComment from './components/GiscusComment.vue'
import TagList from './components/TagList.vue'
import PostList from './components/PostList.vue'

import './styles/custom.css'
import './styles/vars.css'

export default {
  extends: DefaultTheme,

  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 顶部插入阅读进度条
      'layout-top': () => h(ReadingProgress),
      // 文章底部插入评论
      'doc-after': () => h(GiscusComment),
    })
  },

  enhanceApp({ app }) {
    // 注册全局组件，可在 Markdown 中直接使用
    app.component('TagList', TagList)
    app.component('PostList', PostList)
  },
} satisfies Theme
