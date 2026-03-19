<script setup lang="ts">
/**
 * 文章信息栏：显示在文章标题下方
 * 包含：发布日期、标签、字数统计、预计阅读时间
 */
import { computed, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { useRouter } from 'vitepress'

const { frontmatter, page } = useData()
const router = useRouter()

const wordCount = ref(0)
const readingTime = computed(() => Math.max(1, Math.ceil(wordCount.value / 300)))

onMounted(() => {
  // 统计正文字数（去掉代码块和 HTML 标签）
  const content = document.querySelector('.vp-doc')
  if (content) {
    const text = content.textContent ?? ''
    wordCount.value = text.replace(/\s+/g, '').length
  }
})

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function goTag(tag: string) {
  router.go(withBase(`/tags?tag=${encodeURIComponent(tag)}`))
}

const hasMeta = computed(() =>
  frontmatter.value.date || frontmatter.value.tags?.length || frontmatter.value.author
)
</script>

<template>
  <div v-if="hasMeta" class="post-info">
    <!-- 日期 -->
    <span v-if="frontmatter.date" class="post-info-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      {{ formatDate(frontmatter.date) }}
    </span>

    <!-- 字数 & 阅读时间 -->
    <span v-if="wordCount > 0" class="post-info-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
      {{ wordCount.toLocaleString() }} 字 · 约 {{ readingTime }} 分钟
    </span>

    <!-- 标签 -->
    <span v-if="frontmatter.tags?.length" class="post-info-tags">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
      <span
        v-for="tag in frontmatter.tags"
        :key="tag"
        class="post-tag"
        @click="goTag(tag)"
      >{{ tag }}</span>
    </span>
  </div>
</template>

<style scoped>
.post-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 1rem;
  margin: -0.5rem 0 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border-left: 3px solid var(--vp-c-brand-1);
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.post-info-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.post-info-tags {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.post-tag {
  display: inline-flex;
  align-items: center;
  padding: 1px 8px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  cursor: pointer;
  transition: all 0.15s ease;
}

.post-tag:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}
</style>
