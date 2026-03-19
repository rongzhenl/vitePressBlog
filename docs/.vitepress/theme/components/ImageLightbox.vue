<script setup lang="ts">
/**
 * 图片点击放大 Lightbox
 * 挂载后自动监听 .vp-doc img 的点击事件
 */
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const currentSrc = ref('')
const currentAlt = ref('')

function open(src: string, alt: string) {
  currentSrc.value = src
  currentAlt.value = alt
  visible.value = true
  document.body.style.overflow = 'hidden'
}

function close() {
  visible.value = false
  document.body.style.overflow = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

function bindImages() {
  document.querySelectorAll<HTMLImageElement>('.vp-doc img').forEach(img => {
    img.style.cursor = 'zoom-in'
    img.addEventListener('click', () => open(img.src, img.alt))
  })
}

// MutationObserver 监听 DOM 变化（路由切换后重新绑定）
let observer: MutationObserver | null = null

onMounted(() => {
  bindImages()
  window.addEventListener('keydown', onKeydown)

  observer = new MutationObserver(() => bindImages())
  const doc = document.querySelector('.vp-doc')
  if (doc) observer.observe(doc, { childList: true, subtree: true })
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  observer?.disconnect()
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="lightbox">
    <div v-if="visible" class="lightbox-overlay" @click.self="close">
      <button class="lightbox-close" aria-label="关闭" @click="close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <img :src="currentSrc" :alt="currentAlt" class="lightbox-img" @click.stop />
      <p v-if="currentAlt" class="lightbox-caption">{{ currentAlt }}</p>
    </div>
  </Transition>
</template>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(4px);
}

.lightbox-img {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  cursor: default !important;
  transform: none !important;
}

.lightbox-caption {
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  text-align: center;
}

.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
