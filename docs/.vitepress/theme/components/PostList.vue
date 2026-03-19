<script setup lang="ts">
/**
 * 文章列表组件
 * 用法：
 *   <PostList />              — 显示全部文章
 *   <PostList tag="Vue" />    — 按标签过滤
 *   <PostList :limit="5" />   — 只显示最新 5 篇
 */
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { usePostData } from '../composables/usePostData'

const props = withDefaults(defineProps<{
  tag?: string
  limit?: number
}>(), {
  tag: '',
  limit: 0,
})

const { posts } = usePostData()

const filtered = computed(() => {
  let list = posts.value
  if (props.tag) {
    list = list.filter(p => p.tags?.includes(props.tag))
  }
  if (props.limit > 0) {
    list = list.slice(0, props.limit)
  }
  return list
})

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="post-list">
    <a
      v-for="post in filtered"
      :key="post.url"
      :href="withBase(post.url)"
      class="post-card"
    >
      <h3>{{ post.title }}</h3>
      <div class="post-meta">
        <span v-if="post.date">📅 {{ formatDate(post.date) }}</span>
        <span v-if="post.readingTime">⏱ {{ post.readingTime }} 分钟阅读</span>
      </div>
      <div v-if="post.tags?.length" class="post-tags">
        <span
          v-for="t in post.tags"
          :key="t"
          class="tag-badge"
        >{{ t }}</span>
      </div>
      <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>
    </a>

    <p v-if="filtered.length === 0" class="empty-tip">
      {{ tag ? `没有标签为「${tag}」的文章` : '暂无文章' }}
    </p>
  </div>
</template>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.post-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  background: var(--vp-c-bg);
  text-decoration: none;
  display: block;
  color: inherit;
}

.post-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.post-card h3 {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
  line-height: 1.4;
}

.post-meta {
  font-size: 12px;
  color: var(--vp-c-text-3);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.post-excerpt {
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-tip {
  color: var(--vp-c-text-3);
  font-size: 14px;
  text-align: center;
  padding: 2rem;
}
</style>
