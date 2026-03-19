<script setup lang="ts">
/**
 * ArchiveSidebar — 侧边栏动态归档组件
 *
 * 功能：
 *  1. 文章按「年 → 月」分组，可折叠
 *  2. 标签列表，点击过滤文章（通过 URL query 参数 ?tag=xxx 联动 PostList）
 *  3. 快速导航
 */
import { computed, ref } from 'vue'
import { withBase, useRouter, useRoute } from 'vitepress'
import { usePostData } from '../composables/usePostData'

const router = useRouter()
const route = useRoute()
const { posts, tagMap } = usePostData()

// ── 当前激活的标签（从 URL query 读取）──────────────────────
const activeTag = computed(() => {
  const search = typeof window !== 'undefined' ? window.location.search : ''
  const params = new URLSearchParams(search)
  return params.get('tag') ?? ''
})

// ── 按年月分组 ───────────────────────────────────────────────
interface MonthGroup {
  label: string   // e.g. "3 月"
  posts: typeof posts.value
}
interface YearGroup {
  year: string
  months: MonthGroup[]
  collapsed: boolean
}

const archiveGroups = computed<YearGroup[]>(() => {
  const map = new Map<string, Map<string, typeof posts.value>>()

  for (const post of posts.value) {
    if (!post.date) continue
    const d = new Date(post.date)
    const year = String(d.getFullYear())
    const month = String(d.getMonth() + 1)

    if (!map.has(year)) map.set(year, new Map())
    const monthMap = map.get(year)!
    if (!monthMap.has(month)) monthMap.set(month, [])
    monthMap.get(month)!.push(post)
  }

  // 年份降序
  return Array.from(map.entries())
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, monthMap]) => ({
      year,
      collapsed: false,
      months: Array.from(monthMap.entries())
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .map(([month, ps]) => ({
          label: `${month} 月`,
          posts: ps,
        })),
    }))
})

// 折叠状态（响应式，独立于 computed）
const collapsedYears = ref<Record<string, boolean>>({})

function toggleYear(year: string) {
  collapsedYears.value[year] = !collapsedYears.value[year]
}

function isYearCollapsed(year: string) {
  return collapsedYears.value[year] ?? false
}

// ── 标签列表（按文章数降序）──────────────────────────────────
const sortedTags = computed(() =>
  Object.entries(tagMap.value).sort((a, b) => b[1].length - a[1].length)
)

function goTag(tag: string) {
  // 跳转到 /posts/ 并附带 tag 参数
  router.go(withBase(`/posts/?tag=${encodeURIComponent(tag)}`))
}

// ── 当前文章 URL（用于高亮）──────────────────────────────────
const currentUrl = computed(() => route.path)
</script>

<template>
  <div class="archive-sidebar">

    <!-- ① 文章归档 -->
    <div class="sidebar-section">
      <div class="sidebar-section-title">
        <span class="section-icon">📚</span>
        <span>文章归档</span>
        <a :href="withBase('/posts/')" class="view-all">全部</a>
      </div>

      <div v-if="archiveGroups.length === 0" class="empty-tip">暂无文章</div>

      <div
        v-for="group in archiveGroups"
        :key="group.year"
        class="year-group"
      >
        <!-- 年份标题（可折叠） -->
        <button
          class="year-header"
          @click="toggleYear(group.year)"
          :aria-expanded="!isYearCollapsed(group.year)"
        >
          <span class="caret" :class="{ collapsed: isYearCollapsed(group.year) }">▾</span>
          <span class="year-label">{{ group.year }} 年</span>
          <span class="year-count">
            {{ group.months.reduce((s, m) => s + m.posts.length, 0) }}
          </span>
        </button>

        <!-- 月份 + 文章列表 -->
        <div v-show="!isYearCollapsed(group.year)" class="month-list">
          <div
            v-for="month in group.months"
            :key="month.label"
            class="month-group"
          >
            <div class="month-label">{{ month.label }}</div>
            <a
              v-for="post in month.posts"
              :key="post.url"
              :href="withBase(post.url)"
              class="archive-link"
              :class="{ active: currentUrl === post.url }"
            >
              {{ post.title }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- ② 标签 -->
    <div class="sidebar-section">
      <div class="sidebar-section-title">
        <span class="section-icon">🏷️</span>
        <span>标签</span>
        <a :href="withBase('/tags')" class="view-all">全部</a>
      </div>

      <div v-if="sortedTags.length === 0" class="empty-tip">暂无标签</div>

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
      </div>
    </div>

    <!-- ③ 快速导航 -->
    <div class="sidebar-section">
      <div class="sidebar-section-title">
        <span class="section-icon">🔗</span>
        <span>快速导航</span>
      </div>
      <div class="nav-links">
        <a :href="withBase('/about')" class="nav-link">关于</a>
        <a href="https://github.com/rongzhenl" target="_blank" rel="noopener" class="nav-link">
          GitHub ↗
        </a>
      </div>
    </div>

  </div>
</template>

<style scoped>
.archive-sidebar {
  padding: 0.5rem 0;
  font-size: 13px;
}

/* ── 分区 ─────────────────────────────────────────────────── */
.sidebar-section {
  margin-bottom: 1.5rem;
}

.sidebar-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  margin-bottom: 0.6rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.section-icon {
  font-size: 14px;
}

.view-all {
  margin-left: auto;
  font-size: 11px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration: none;
  letter-spacing: 0;
  text-transform: none;
  opacity: 0.8;
  transition: opacity 0.15s;
}
.view-all:hover { opacity: 1; }

/* ── 年份分组 ─────────────────────────────────────────────── */
.year-group {
  margin-bottom: 0.25rem;
}

.year-header {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  background: none;
  border: none;
  padding: 4px 0;
  cursor: pointer;
  color: var(--vp-c-text-1);
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  border-radius: 4px;
  transition: background 0.15s;
}
.year-header:hover {
  background: var(--vp-c-bg-soft);
}

.caret {
  font-size: 12px;
  color: var(--vp-c-text-3);
  transition: transform 0.2s ease;
  display: inline-block;
  line-height: 1;
}
.caret.collapsed {
  transform: rotate(-90deg);
}

.year-label {
  flex: 1;
}

.year-count {
  font-size: 11px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  padding: 0 6px;
  min-width: 18px;
  text-align: center;
}

/* ── 月份 ─────────────────────────────────────────────────── */
.month-list {
  padding-left: 0.75rem;
  border-left: 2px solid var(--vp-c-divider);
  margin-left: 0.4rem;
}

.month-group {
  margin-bottom: 0.4rem;
}

.month-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-3);
  padding: 3px 0 2px;
  letter-spacing: 0.03em;
}

/* ── 文章链接 ─────────────────────────────────────────────── */
.archive-link {
  display: block;
  padding: 3px 6px;
  border-radius: 4px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 12.5px;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.15s;
}
.archive-link:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}
.archive-link.active {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  background: var(--vp-c-brand-soft);
}

/* ── 标签云 ───────────────────────────────────────────────── */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 2px 0;
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

/* ── 快速导航 ─────────────────────────────────────────────── */
.nav-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-link {
  display: block;
  padding: 4px 6px;
  border-radius: 4px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  font-size: 12.5px;
  transition: all 0.15s;
}
.nav-link:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

/* ── 空状态 ───────────────────────────────────────────────── */
.empty-tip {
  font-size: 12px;
  color: var(--vp-c-text-3);
  padding: 4px 0;
}
</style>
