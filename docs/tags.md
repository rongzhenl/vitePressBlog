---
title: 标签
description: 按标签浏览文章
comment: false
---

# 标签

<TagList />

<script setup>
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import { usePostData } from './.vitepress/theme/composables/usePostData'

const route = useRoute()
const { tagMap } = usePostData()

const currentTag = computed(() => {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('tag') ?? ''
})
</script>

<div v-if="currentTag">

## # {{ currentTag }}

<PostList :tag="currentTag" />

</div>
