/**
 * usePostData
 * 从 VitePress 的 data loader 读取所有文章元数据
 * 提供 posts（按日期排序）和 tagMap（标签 → 文章列表）
 */
import { computed } from 'vue'
import { useData } from 'vitepress'
// @ts-ignore — 由 posts.data.ts 生成
import { data as postsData } from '../../../posts.data'

export interface PostMeta {
  url: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  readingTime: number
}

export function usePostData() {
  const posts = computed<PostMeta[]>(() =>
    (postsData as PostMeta[]).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  )

  const tagMap = computed<Record<string, PostMeta[]>>(() => {
    const map: Record<string, PostMeta[]> = {}
    for (const post of posts.value) {
      for (const tag of post.tags ?? []) {
        if (!map[tag]) map[tag] = []
        map[tag].push(post)
      }
    }
    return map
  })

  return { posts, tagMap }
}
