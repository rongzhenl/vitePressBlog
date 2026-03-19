---
title: Markdown 写作功能展示
date: 2026-03-18
tags: [Markdown, 写作, 代码]
description: 展示博客支持的所有 Markdown 特性：代码高亮、图片、表格、提示框等。
---

# Markdown 写作功能展示

这篇文章展示博客支持的所有写作特性，可以作为写作参考。

## 代码块

支持语法高亮、行号、一键复制，以及高亮指定行：

```python{4-6}
import hashlib
import hmac

def make_sign(message: str, secret: str) -> str:
    """HMAC-SHA1 签名"""
    return hmac.new(
        secret.encode(),
        message.encode(),
        hashlib.sha1
    ).hexdigest().upper()

# 调用示例
sign = make_sign("hello", "my-secret-key")
print(sign)
```

```typescript
// TypeScript 示例
interface User {
  id: number
  name: string
  email: string
}

async function fetchUser(id: number): Promise<User> {
  const res = await fetch(`/api/users/${id}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
```

```bash
# Shell 命令
npm run dev        # 本地开发
npm run build      # 构建生产版本
npm run preview    # 预览构建结果
```

## 行内代码

使用 `const` 声明常量，`let` 声明变量，避免使用 `var`。

## 提示框

VitePress 内置多种提示框：

::: info 信息
这是一条普通信息提示。
:::

::: tip 技巧
这是一条使用技巧。
:::

::: warning 注意
这是一条警告信息，需要特别留意。
:::

::: danger 危险
这是一条危险提示，操作不可逆。
:::

::: details 点击展开详情
这里是折叠的详细内容，适合放补充说明或较长的代码示例。

```python
# 折叠代码示例
def complex_function():
    pass
```
:::

## 表格

| 特性 | VitePress | Hugo | Hexo |
|------|-----------|------|------|
| 构建速度 | ⚡ 极快 | ⚡ 极快 | 🐢 较慢 |
| 代码高亮 | ✅ 内置 Shiki | ✅ 内置 | ⚠️ 需插件 |
| 全文搜索 | ✅ 内置 | ⚠️ 需插件 | ⚠️ 需插件 |
| Vue 组件 | ✅ 原生支持 | ❌ | ❌ |
| 学习成本 | 低 | 中 | 低 |

## 图片

图片支持懒加载，鼠标悬停有放大效果：

![示例图片](https://picsum.photos/800/400?random=1)

*图片说明：可以在图片下方加说明文字*

## 数学公式

行内公式：$E = mc^2$

块级公式：

$$
\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n
$$

## 任务列表

- [x] 搭建博客框架
- [x] 配置代码高亮
- [x] 配置全文搜索
- [x] 配置评论系统
- [ ] 写更多技术文章
- [ ] 配置自定义域名

## 引用

> 任何足够先进的技术，都与魔法无异。
>
> — Arthur C. Clarke

## 脚注

VitePress[^1] 是基于 Vite[^2] 构建的静态站点生成器。

[^1]: VitePress 官网：https://vitepress.dev
[^2]: Vite 官网：https://vitejs.dev
