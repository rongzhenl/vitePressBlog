/**
 * VitePress Data Loader
 * 自动扫描 docs/posts/ 下所有 .md 文件，提取 frontmatter 元数据
 * 构建时生成静态数据，无运行时开销
 *
 * 文档：https://vitepress.dev/guide/data-loading
 */
import { createContentLoader } from 'vitepress'

export interface PostData {
  url: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  readingTime: number
}

export default createContentLoader('posts/*.md', {
  excerpt: true,
  transform(raw): PostData[] {
    return raw
      .filter(({ url, frontmatter }) =>
      frontmatter.title && !url.endsWith('/posts/')
    )
      .map(({ url, frontmatter, excerpt }) => {
        // 估算阅读时间（中文约 300 字/分钟）
        const wordCount = (excerpt ?? '').replace(/<[^>]+>/g, '').length
        const readingTime = Math.max(1, Math.ceil(wordCount / 300))

        return {
          url,
          title: frontmatter.title ?? '无标题',
          date: frontmatter.date ?? '',
          tags: frontmatter.tags ?? [],
          excerpt: frontmatter.description
            ?? (excerpt ?? '').replace(/<[^>]+>/g, '').slice(0, 120),
          readingTime,
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  },
})
