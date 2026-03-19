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
import { computed } from 'vue'
import PostList from './.vitepress/theme/components/PostList.vue'
import { usePostData } from './.vitepress/theme/composables/usePostData'

const { posts, tagMap } = usePostData()

const totalPosts = computed(() => posts.value.length)
const totalTags = computed(() => Object.keys(tagMap.value).length)
const latestDate = computed(() => {
  if (!posts.value.length) return ''
  const d = new Date(posts.value[0].date)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
})
</script>

<!-- 统计卡片 -->
<div class="home-stats">
  <div class="stat-card">
    <div class="stat-number">{{ totalPosts }}</div>
    <div class="stat-label">篇文章</div>
  </div>
  <div class="stat-divider"></div>
  <div class="stat-card">
    <div class="stat-number">{{ totalTags }}</div>
    <div class="stat-label">个标签</div>
  </div>
  <div class="stat-divider"></div>
  <div class="stat-card">
    <div class="stat-number stat-date">{{ latestDate || '—' }}</div>
    <div class="stat-label">最近更新</div>
  </div>
</div>

<!-- 最近文章 -->
<div class="home-posts">

<div class="home-section-header">
  <h2>最近更新</h2>
  <a href="./posts/" class="home-view-all">查看全部 →</a>
</div>

<PostList :limit="5" />

</div>

<style>
/* ── 统计卡片 ─────────────────────────────────────────────── */
.home-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  max-width: 480px;
  margin: -1rem auto 0;
  padding: 1.25rem 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.dark .home-stats {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.stat-card {
  flex: 1;
  text-align: center;
  padding: 0 1rem;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
}

.stat-number.stat-date {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.stat-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 2px;
  font-weight: 500;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--vp-c-divider);
  flex-shrink: 0;
}

/* ── 最近文章区域 ─────────────────────────────────────────── */
.home-posts {
  max-width: 768px;
  margin: 2.5rem auto 0;
  padding: 0 1.5rem 4rem;
}

.home-section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.home-section-header h2 {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
  border: none;
  padding: 0;
}

.home-view-all {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.15s;
}
.home-view-all:hover {
  opacity: 1;
}

/* ── 响应式 ─────────────────────────────────────────────── */
@media (max-width: 640px) {
  .home-stats {
    max-width: calc(100% - 2rem);
    margin: -0.5rem 1rem 0;
    padding: 1rem 0.5rem;
  }

  .stat-number {
    font-size: 1.4rem;
  }

  .stat-number.stat-date {
    font-size: 0.75rem;
  }

  .home-posts {
    padding: 0 1rem 3rem;
  }
}
</style>
