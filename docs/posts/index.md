---
title: 所有文章
description: 技术文章归档
comment: false
---

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import PostList from '../.vitepress/theme/components/PostList.vue'

const route = useRoute()
const activeTag = ref('')

function syncTag() {
  if (typeof window !== 'undefined') {
    activeTag.value = new URLSearchParams(window.location.search).get('tag') ?? ''
  }
}

onMounted(() => {
  syncTag()
  window.addEventListener('popstate', syncTag)
})

watch(() => route.path, syncTag)
</script>

<div class="posts-page-header">
  <h1>所有文章</h1>
  <span v-if="activeTag" class="filter-badge">
    🏷️ {{ activeTag }}
    <button
      class="clear-tag"
      @click="activeTag = ''; history.pushState({}, '', window.location.pathname)"
    >✕</button>
  </span>
</div>

<PostList :tag="activeTag" />

<style scoped>
.posts-page-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.posts-page-header h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  border: none;
  padding: 0;
}

.filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px 3px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-soft);
}

.clear-tag {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  padding: 0;
  line-height: 1;
  opacity: 0.7;
  transition: opacity 0.15s;
}
.clear-tag:hover { opacity: 1; }
</style>
