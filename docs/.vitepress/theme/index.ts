import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import ReadingProgress from './components/ReadingProgress.vue'
import GiscusComment from './components/GiscusComment.vue'
import TagList from './components/TagList.vue'
import PostList from './components/PostList.vue'
import PostInfo from './components/PostInfo.vue'
import BackToTop from './components/BackToTop.vue'
import ImageLightbox from './components/ImageLightbox.vue'
import PostsAside from './components/PostsAside.vue'

import './styles/custom.css'
import './styles/vars.css'

export default {
  extends: DefaultTheme,

  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 顶部阅读进度条
      'layout-top': () => h(ReadingProgress),
      // 文章标题下方：发布日期 / 字数 / 标签
      'doc-before': () => h(PostInfo),
      // 文章底部：评论
      'doc-after': () => h(GiscusComment),
      // 全局：回到顶部 + 图片 Lightbox
      'layout-bottom': () => [h(BackToTop), h(ImageLightbox)],
      // 文章列表页右侧：标签过滤 + 归档统计（组件内部判断路径）
      'aside-outline-before': () => h(PostsAside),
    })
  },

  enhanceApp({ app }) {
    app.component('TagList', TagList)
    app.component('PostList', PostList)
  },
} satisfies Theme
