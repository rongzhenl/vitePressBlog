<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

const progress = ref(0)
const visible = ref(false)
const route = useRoute()

function updateProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight <= 0) {
    progress.value = 0
    visible.value = false
    return
  }
  progress.value = Math.min(100, Math.round((scrollTop / docHeight) * 100))
  visible.value = scrollTop > 50
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<template>
  <div
    class="reading-progress-bar"
    :class="{ visible }"
    role="progressbar"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="reading-progress-fill" :style="{ width: `${progress}%` }" />
  </div>
</template>

<style scoped>
.reading-progress-bar {
  position: fixed;
  top: var(--vp-nav-height, 64px);
  left: 0;
  right: 0;
  height: var(--reading-progress-height, 3px);
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  background: transparent;
}

.reading-progress-bar.visible {
  opacity: 1;
}

.reading-progress-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--reading-progress-color, #3b82f6),
    #60a5fa
  );
  border-radius: 0 2px 2px 0;
  transition: width 0.1s linear;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}
</style>
