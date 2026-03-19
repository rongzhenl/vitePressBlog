<script setup lang="ts">
import { ref, onMounted } from 'vue'

const collapsed = ref(false)

const STORAGE_KEY = 'vp-sidebar-collapsed'

onMounted(() => {
  // 恢复上次状态
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'true') {
    collapsed.value = true
    document.documentElement.classList.add('sidebar-collapsed')
  }
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
  /* 垂直居中于侧边栏 */
  top: 50%;
  transform: translateY(-50%);
  /* 紧贴侧边栏右边缘 */
  left: var(--vp-sidebar-width, 272px);
  z-index: 100;
  width: 20px;
  height: 48px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-left: none;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.3s ease, background 0.15s;
  padding: 0;
  box-shadow: 2px 0 6px rgba(0,0,0,0.06);
}

.sidebar-toggle-btn:hover {
  background: var(--vp-c-brand-soft);
}

/* 收起状态时按钮移到左边缘 */
:global(.sidebar-collapsed) .sidebar-toggle-btn {
  left: 0;
}

.toggle-icon {
  font-size: 18px;
  font-weight: 300;
  color: var(--vp-c-text-2);
  line-height: 1;
  display: inline-block;
  transition: transform 0.3s ease;
  /* 默认朝左（收起方向） */
  transform: rotate(0deg);
}

.toggle-icon.collapsed {
  /* 收起后朝右（展开方向） */
  transform: rotate(180deg);
}

/* 只在有侧边栏的宽度下显示 */
@media (max-width: 959px) {
  .sidebar-toggle-btn {
    display: none;
  }
}
</style>
