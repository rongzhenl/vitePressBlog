---
layout: home

hero:
  name: "技术笔记"
  text: "记录探索，分享经验"
  tagline: 专注于后端开发、系统设计与工程实践
  image:
    src: /favicon.svg
    alt: Logo
  actions:
    - theme: brand
      text: 开始阅读 →
      link: /posts/
    - theme: alt
      text: 关于我
      link: /about

features:
  - icon: 🔧
    title: 工程实践
    details: 深入探讨系统设计、架构决策与工程最佳实践，记录真实项目中的经验与教训。
  - icon: 📦
    title: 技术整理
    details: 对各类技术栈、框架、工具的系统性梳理，帮助建立完整的知识体系。
  - icon: 💡
    title: 问题解析
    details: 记录开发过程中遇到的疑难问题及解决思路，避免重复踩坑。
---

<script setup>
import PostList from './.vitepress/theme/components/PostList.vue'
</script>

<div class="home-posts">

## 最近更新

<PostList :limit="5" />

<div class="home-posts-more">
  <a href="./posts/">查看全部文章 →</a>
</div>

</div>

<style scoped>
.home-posts {
  max-width: 768px;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;
}

.home-posts h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
}

.home-posts-more {
  text-align: center;
  margin-top: 1.5rem;
}

.home-posts-more a {
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.home-posts-more a:hover {
  color: var(--vp-c-brand-2);
}
</style>
