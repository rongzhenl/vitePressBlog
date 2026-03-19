---
title: 所有文章
description: 技术文章归档
comment: false
---

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import PostList from '../.vitepress/theme/components/PostList.vue'

const route = useRoute()

// 从 URL query 读取当前标签过滤
const activeTag = ref('')

function syncTag() {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    activeTag.value = params.get('tag') ?? ''
  }
}

onMounted(() => {
  syncTag()
  // 监听 popstate（浏览器前进/后退）
  window.addEventListener('popstate', syncTag)
})

// VitePress SPA 路由变化时同步
watch(() => route.path, syncTag)
</script>

<div class="posts-page">

<div class="posts-header">
  <h1>所有文章</h1>
  <div v-if="activeTag" class="active-filter">
    <span>标签：</span>
    <span class="filter-tag">{{ activeTag }}</span>
    <button class="clear-btn" @click="activeTag = ''; history.pushState({}, '', window.location.pathname)">✕ 清除</button>
  </div>
</div>

<PostList :tag="activeTag" />

</div>

<style scoped>
.posts-page {
  padding-top: 0.5rem;
}

.posts-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.posts-header h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  border: none;
  padding: 0;
}

.active-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  padding: 3px 10px;
}

.filter-tag {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-text-3);
  font-size: 12px;
  padding: 0 2px;
  transition: color 0.15s;
}
.clear-btn:hover {
  color: var(--vp-c-text-1);
}
</style>
