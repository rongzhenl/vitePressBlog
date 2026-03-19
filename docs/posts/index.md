---
title: 所有文章
description: 技术文章归档
comment: false
---

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { usePostData } from '../.vitepress/theme/composables/usePostData'
import PostList from '../.vitepress/theme/components/PostList.vue'

const route = useRoute()
const { posts, tagMap } = usePostData()

// ── 标签过滤 ──────────────────────────────────────────────
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

function selectTag(tag) {
  if (activeTag.value === tag) {
    activeTag.value = ''
    history.pushState({}, '', window.location.pathname)
  } else {
    activeTag.value = tag
    history.pushState({}, '', `${window.location.pathname}?tag=${encodeURIComponent(tag)}`)
  }
}

function clearTag() {
  activeTag.value = ''
  history.pushState({}, '', window.location.pathname)
}

// ── 标签列表（按文章数降序）──────────────────────────────
const sortedTags = computed(() => {
  const map = tagMap.value ?? {}
  return Object.entries(map).sort((a, b) => (b[1]?.length ?? 0) - (a[1]?.length ?? 0))
})

// ── 按年归档统计 ──────────────────────────────────────────
const archiveByYear = computed(() => {
  const map = new Map()
  for (const post of (posts.value ?? [])) {
    if (!post.date) continue
    const year = String(new Date(post.date).getFullYear())
    map.set(year, (map.get(year) ?? 0) + 1)
  }
  return Array.from(map.entries()).sort((a, b) => Number(b[0]) - Number(a[0]))
})
</script>

<div class="posts-layout">

  <!-- 左：文章列表 -->
  <div class="posts-main">
    <div class="posts-header">
      <h1>所有文章</h1>
      <span v-if="activeTag" class="filter-badge">
        🏷️ {{ activeTag }}
        <button class="clear-tag" @click="clearTag">✕</button>
      </span>
    </div>
    <PostList :tag="activeTag" />
  </div>

  <!-- 右：标签 + 归档 -->
  <aside class="posts-sidebar">

    <!-- 标签云 -->
    <div class="aside-block">
      <div class="aside-block-title">🏷️ 标签</div>
      <div class="tag-cloud">
        <button
          v-for="[tag, tagPosts] in sortedTags"
          :key="tag"
          class="tag-chip"
          :class="{ active: activeTag === tag }"
          @click="selectTag(tag)"
        >
          {{ tag }}<span class="tag-count">{{ tagPosts?.length ?? 0 }}</span>
        </button>
        <p v-if="!sortedTags.length" class="aside-empty">暂无标签</p>
      </div>
    </div>

    <!-- 归档统计 -->
    <div class="aside-block">
      <div class="aside-block-title">📅 归档</div>
      <div class="archive-list">
        <div v-for="[year, count] in archiveByYear" :key="year" class="archive-row">
          <span class="archive-year">{{ year }} 年</span>
          <span class="archive-count">{{ count }} 篇</span>
        </div>
        <p v-if="!archiveByYear.length" class="aside-empty">暂无文章</p>
      </div>
    </div>

  </aside>

</div>

<style scoped>
/* ── 两栏布局 ─────────────────────────────────────────────── */
.posts-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.posts-main {
  flex: 1;
  min-width: 0;
}

.posts-sidebar {
  width: 200px;
  flex-shrink: 0;
  position: sticky;
  top: calc(var(--vp-nav-height) + 1.5rem);
}

/* ── 文章列表头部 ─────────────────────────────────────────── */
.posts-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.posts-header h1 {
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

/* ── 右侧面板 ─────────────────────────────────────────────── */
.aside-block {
  margin-bottom: 1.5rem;
}

.aside-block-title {
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
  line-height: 1.5;
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
  opacity: 0.65;
}

/* ── 归档列表 ─────────────────────────────────────────────── */
.archive-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
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
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.archive-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.aside-empty {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin: 0;
}

/* ── 响应式：小屏单栏 ─────────────────────────────────────── */
@media (max-width: 768px) {
  .posts-layout {
    flex-direction: column;
  }
  .posts-sidebar {
    width: 100%;
    position: static;
  }
}
</style>
