/**
 * RSS Feed 生成器
 * 在 vitepress build 完成后自动生成 /feed.xml
 */
import path from 'path'
import fs from 'fs'
import { Feed } from 'feed'
import type { SiteConfig } from 'vitepress'

// 站点信息（与 config.mts 保持一致）
const SITE_URL = 'https://rongzhenl.github.io/vitePressBlog'
const SITE_TITLE = '技术笔记'
const SITE_DESCRIPTION = '记录技术探索，分享开发经验'
const AUTHOR = {
  name: '博主',
  email: 'your@email.com',  // ← 改为你的邮箱
  link: SITE_URL,
}

export async function createRssFile(config: SiteConfig) {
  const feed = new Feed({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    id: SITE_URL,
    link: SITE_URL,
    language: 'zh-CN',
    favicon: `${SITE_URL}/favicon.svg`,
    copyright: `Copyright © ${new Date().getFullYear()} ${AUTHOR.name}`,
    author: AUTHOR,
  })

  // 读取构建产物中的文章数据
  const postsDataPath = path.join(config.outDir, '../docs/posts.data.ts')

  // 直接扫描 posts 目录读取 frontmatter
  const postsDir = path.join(config.srcDir, 'posts')
  if (!fs.existsSync(postsDir)) return

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))

  for (const file of files) {
    const content = fs.readFileSync(path.join(postsDir, file), 'utf-8')
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (!fmMatch) continue

    const fm: Record<string, any> = {}
    fmMatch[1].split('\n').forEach(line => {
      const [k, ...v] = line.split(':')
      if (k && v.length) {
        const val = v.join(':').trim().replace(/^['"]|['"]$/g, '')
        fm[k.trim()] = val
      }
    })

    if (!fm.title || !fm.date) continue

    const slug = file.replace(/\.md$/, '')
    const url = `${SITE_URL}/posts/${slug}`
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, '').slice(0, 500)

    feed.addItem({
      title: fm.title,
      id: url,
      link: url,
      description: fm.description ?? body,
      date: new Date(fm.date),
      author: [AUTHOR],
    })
  }

  // 按日期排序
  feed.items.sort((a, b) => b.date.getTime() - a.date.getTime())

  // 写入 feed.xml
  const outPath = path.join(config.outDir, 'feed.xml')
  fs.writeFileSync(outPath, feed.rss2())
  console.log(`✓ RSS feed generated: ${outPath}`)
}
