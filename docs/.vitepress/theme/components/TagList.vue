<script setup lang="ts">
/**
 * 标签云组件
 * 用法：在 Markdown 中直接写 <TagList />
 */
import { computed } from 'vue'
import { useRouter } from 'vitepress'
import { usePostData } from '../composables/usePostData'

const router = useRouter()
const { tagMap } = usePostData()

const sortedTags = computed(() =>
  Object.entries(tagMap.value)
    .sort((a, b) => b[1].length - a[1].length)
)

function goTag(tag: string) {
  router.go(`/tags?tag=${encodeURIComponent(tag)}`)
}
</script>

<template>
  <div class="tag-cloud">
    <span
      v-for="[tag, posts] in sortedTags"
      :key="tag"
      class="tag-badge"
      @click="goTag(tag)"
    >
      {{ tag }}
      <span class="tag-count">{{ posts.length }}</span>
    </span>
    <p v-if="sortedTags.length === 0" class="empty-tip">
      暂无标签
    </p>
  </div>
</template>

<style scoped>
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.tag-badge:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.tag-count {
  font-size: 11px;
  opacity: 0.75;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 0 5px;
  min-width: 18px;
  text-align: center;
}

.tag-badge:hover .tag-count {
  background: rgba(255, 255, 255, 0.25);
}

.empty-tip {
  color: var(--vp-c-text-3);
  font-size: 14px;
}
</style>
