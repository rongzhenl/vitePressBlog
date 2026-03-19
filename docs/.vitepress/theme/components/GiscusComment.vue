<script setup lang="ts">
/**
 * Giscus 评论组件
 * 基于 GitHub Discussions，无需数据库
 *
 * 配置步骤：
 * 1. 访问 https://giscus.app/zh-CN
 * 2. 填入你的 GitHub 仓库，获取配置参数
 * 3. 将下方 GISCUS_CONFIG 替换为你的真实值
 */
import { ref, watch, onMounted, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'

const { isDark, frontmatter } = useData()
const route = useRoute()

// ── 在此填入你的 Giscus 配置 ──────────────────────────────
const GISCUS_CONFIG = {
  repo: 'your-username/blog',           // GitHub 仓库，格式：用户名/仓库名
  repoId: 'YOUR_REPO_ID',               // 从 giscus.app 获取
  category: 'Announcements',
  categoryId: 'YOUR_CATEGORY_ID',       // 从 giscus.app 获取
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom',
  lang: 'zh-CN',
}
// ─────────────────────────────────────────────────────────

const commentRef = ref<HTMLElement | null>(null)
const isConfigured = GISCUS_CONFIG.repoId !== 'YOUR_REPO_ID'

function getTheme() {
  return isDark.value ? 'dark_dimmed' : 'light'
}

function loadGiscus() {
  if (!commentRef.value || !isConfigured) return

  // 清除旧实例
  commentRef.value.innerHTML = ''

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', GISCUS_CONFIG.repo)
  script.setAttribute('data-repo-id', GISCUS_CONFIG.repoId)
  script.setAttribute('data-category', GISCUS_CONFIG.category)
  script.setAttribute('data-category-id', GISCUS_CONFIG.categoryId)
  script.setAttribute('data-mapping', GISCUS_CONFIG.mapping)
  script.setAttribute('data-strict', GISCUS_CONFIG.strict)
  script.setAttribute('data-reactions-enabled', GISCUS_CONFIG.reactionsEnabled)
  script.setAttribute('data-emit-metadata', GISCUS_CONFIG.emitMetadata)
  script.setAttribute('data-input-position', GISCUS_CONFIG.inputPosition)
  script.setAttribute('data-theme', getTheme())
  script.setAttribute('data-lang', GISCUS_CONFIG.lang)
  script.setAttribute('data-loading', 'lazy')
  script.crossOrigin = 'anonymous'
  script.async = true

  commentRef.value.appendChild(script)
}

// 路由变化时重新加载
watch(() => route.path, () => {
  nextTick(loadGiscus)
})

// 主题切换时通知 Giscus iframe
watch(isDark, (dark) => {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  if (iframe) {
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: dark ? 'dark_dimmed' : 'light' } } },
      'https://giscus.app'
    )
  }
})

onMounted(loadGiscus)
</script>

<template>
  <!-- 仅在文章页显示评论（非首页、非标签页） -->
  <div
    v-if="frontmatter.comment !== false"
    class="giscus-wrapper"
  >
    <div class="giscus-divider" />

    <!-- 未配置时显示提示 -->
    <div v-if="!isConfigured" class="giscus-placeholder">
      <p>
        💬 评论功能需要配置 Giscus。
        请访问 <a href="https://giscus.app/zh-CN" target="_blank">giscus.app</a>
        获取配置参数，然后编辑
        <code>docs/.vitepress/theme/components/GiscusComment.vue</code>
        中的 <code>GISCUS_CONFIG</code>。
      </p>
    </div>

    <div ref="commentRef" class="giscus-container" />
  </div>
</template>

<style scoped>
.giscus-wrapper {
  margin-top: 3rem;
}

.giscus-divider {
  border-top: 1px solid var(--vp-c-divider);
  margin-bottom: 2rem;
}

.giscus-placeholder {
  padding: 1rem 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px dashed var(--vp-c-divider);
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.giscus-placeholder a {
  color: var(--vp-c-brand-1);
}

.giscus-container {
  min-height: 100px;
}
</style>
