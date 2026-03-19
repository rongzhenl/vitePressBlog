<script setup lang="ts">
/**
 * PostsAside — 文章列表页右侧辅助组件
 * 仅在 /posts/ 路径下渲染（通过 useRoute 判断）
 *
 * 功能：
 *  1. 标签云：点击跳转 /posts/?tag=xxx 过滤文章
 *  2. 归档统计：按年显示文章数量
 */
import { computed } from 'vue'
import { useRoute, useRouter, withBase } from 'vitepress'
import { usePostData } from '../composables/usePostData'

const route = useRoute()
const router = useRouter()
const { posts, tagMap } = usePostData()

// 只在 /posts/ 路径下显示
const isPostsPage = computed(() =>
  route.path === '/posts/' || route.path === '/posts'
)

// 标签列表（按文章数降序）
const sortedTags = computed(() =>
  Object.entries(tagMap.value).sort((a, b) => b[1].length - a[1].length)
)

// 按年归档统计
const archiveByYear = computed(() => {
  const map = new Map<string, number>()
  for (const post of posts.value) {
    if (!post.date) continue
    const year = String(new Date(post.date).getFullYear())
    map.set(year, (map.get(year) ?? 0) + 1)
  }
  return Array.from(map.entries()).sort((a, b) => Number(b[0]) - Number(a[0]))
})

// 当前激活标签
const activeTag = computed(() => {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('tag') ?? ''
})

function goTag(tag: string) {
  if (activeTag.value === tag) {
    // 再次点击同一标签 → 清除过滤
    router.go(withBase('/posts/'))
  } else {
    router.go(withBase(`/posts/?tag=${encodeURIComponent(tag)}`))
  }
}
</script>

<template>
  <div v-if="isPostsPage" class="posts-aside">

    <!-- 标签云 -->
    <div class="aside-section">
      <div class="aside-title">🏷️ 标签</div>
      <div class="tag-cloud">
        <button
          v-for="[tag, tagPosts] in sortedTags"
          :key="tag"
          class="tag-chip"
          :class="{ active: activeTag === tag }"
          @click="goTag(tag)"
        >
          {{ tag }}
          <span class="tag-count">{{ tagPosts.length }}</span>
        </button>
        <p v-if="sortedTags.length === 0" class="empty-tip">暂无标签</p>
      </div>
    </div>

    <!-- 归档统计 -->
    <div class="aside-section">
      <div class="aside-title">📅 归档</div>
      <div class="archive-list">
        <div
          v-for="[year, count] in archiveByYear"
          :key="year"
          class="archive-row"
        >
          <span class="archive-year">{{ year }}</span>
          <span class="archive-count">{{ count }} 篇</span>
        </div>
        <p v-if="archiveByYear.length === 0" class="empty-tip">暂无文章</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
.posts-aside {
  padding: 0 0 1rem;
  font-size: 13px;
}

/* ── 分区 ─────────────────────────────────────────────────── */
.aside-section {
  margin-bottom: 1.5rem;
}

.aside-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  margin-bottom: 0.6rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

/* ── 标签云 ───────────────────────────────────────────────── */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  line-height: 1.4;
}

.tag-chip:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-soft);
}

.tag-chip.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.tag-count {
  font-size: 10px;
  opacity: 0.7;
}

/* ── 归档列表 ─────────────────────────────────────────────── */
.archive-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.archive-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}

.archive-row:hover {
  background: var(--vp-c-bg-soft);
}

.archive-year {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.archive-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

/* ── 空状态 ───────────────────────────────────────────────── */
.empty-tip {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin: 0;
}
</style>
