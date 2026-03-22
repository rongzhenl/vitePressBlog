<script setup lang="ts">
import { ref, onMounted } from 'vue'

const collapsed = ref(false)
const hasSidebar = ref(false)

const STORAGE_KEY = 'vp-sidebar-collapsed'

function checkSidebar() {
  const sidebar = document.querySelector('.VPSidebar')
  if (!sidebar) {
    hasSidebar.value = false
    return
  }
  // 只有侧边栏实际占据宽度时才认为"有侧边栏"
  // VitePress 在无侧边栏页面不会渲染 .VPSidebar，但以防万一也检查宽度
  const rect = sidebar.getBoundingClientRect()
  hasSidebar.value = rect.width > 0
}

onMounted(() => {
  checkSidebar()

  // 恢复上次折叠状态（仅在有侧边栏的页面生效）
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'true' && hasSidebar.value) {
    collapsed.value = true
    document.documentElement.classList.add('sidebar-collapsed')
  }

  // 路由切换时重新检测侧边栏，并同步折叠状态
  const observer = new MutationObserver(() => {
    const prevHas = hasSidebar.value
    checkSidebar()

    // 切换到无侧边栏页面时，移除 collapsed class，避免影响布局
    if (!hasSidebar.value) {
      document.documentElement.classList.remove('sidebar-collapsed')
    } else if (!prevHas && hasSidebar.value) {
      // 切换回有侧边栏页面，恢复持久化状态
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'true') {
        collapsed.value = true
        document.documentElement.classList.add('sidebar-collapsed')
      } else {
        collapsed.value = false
        document.documentElement.classList.remove('sidebar-collapsed')
      }
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
})

function toggle() {
  collapsed.value = !collapsed.value
  if (collapsed.value) {
    document.documentElement.classList.add('sidebar-collapsed')
    localStorage.setItem(STORAGE_KEY, 'true')
  } else {
    document.documentElement.classList.remove('sidebar-collapsed')
    localStorage.setItem(STORAGE_KEY, 'false')
  }
}
</script>

<template>
  <button
    v-if="hasSidebar"
    id="sidebar-toggle-btn"
    class="sidebar-toggle-btn"
    :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
    :aria-label="collapsed ? '展开侧边栏' : '收起侧边栏'"
    @click="toggle"
  >
    <span class="toggle-icon" :class="{ collapsed }">‹</span>
  </button>
</template>

<style scoped>
.sidebar-toggle-btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  left: 272px;
  z-index: 99;
  width: 16px;
  height: 56px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-left: 2px solid var(--vp-c-brand-1);
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.3s ease, background 0.15s, width 0.15s;
  padding: 0;
  box-shadow: 3px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-toggle-btn:hover {
  width: 22px;
  background: var(--vp-c-brand-soft);
}

/* 收起状态样式已移至 custom.css 全局样式，避免 scoped 选择器失效 */

.toggle-icon {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  line-height: 1;
  display: inline-block;
  transition: transform 0.3s ease;
}

.toggle-icon.collapsed {
  transform: rotate(180deg);
}

/* 只在桌面端（有侧边栏）显示 */
@media (max-width: 959px) {
  .sidebar-toggle-btn {
    display: none;
  }
}
</style>
