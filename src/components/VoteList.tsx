'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, ThumbsDown, ThumbsUp, Trash2 } from 'lucide-react'
import type { AvatarCandidate, Category, DescCandidate, ImageCandidate, VideoLink } from '@/lib/types'
import { getCategoryTextColor } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

const PAGE_SIZE = 12

interface VoteListProps {
  entryId: string
  type: 'description' | 'image' | 'video' | 'avatar'
  items: DescCandidate[] | ImageCandidate[] | VideoLink[] | AvatarCandidate[]
  category: Category
  onDelete?: () => void
}

const emptyLabel: Record<string, string> = {
  description: '描述',
  image: '图片',
  video: '视频',
  avatar: '头像',
}

const platformLabel: Record<string, string> = {
  bilibili: 'Bilibili',
  douyin: '抖音',
  other: '其他',
}

export default function VoteList({ entryId, type, items, category, onDelete }: VoteListProps) {
  const [localItems, setLocalItems] = useState([...items])
  const [page, setPage] = useState(1)
  const { verified, key } = useAuth()
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalItems([...items])
    setPage(1)
  }, [items])

  const sorted = [...localItems].sort((a, b) => b.votes - a.votes)
  const displayItems = sorted.slice(0, page * PAGE_SIZE)
  const hasMore = displayItems.length < sorted.length

  useEffect(() => {
    if (!hasMore || !observerRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1)
      },
      { rootMargin: '200px' }
    )
    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasMore])

  async function handleVote(itemId: string, direction: 'up' | 'down') {
    const res = await fetch('/api/vote', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId, type, itemId, direction }),
    })
    if (res.ok) {
      const data = await res.json()
      setLocalItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, votes: data.votes } : item
        ) as typeof prev
      )
    }
  }

  async function handleDelete(itemId: string) {
    if (!key || !confirm('确定删除此条内容？')) return
    const res = await fetch(`/api/entries/${entryId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, deleteType: 'item', itemId }),
    })
    if (res.ok) {
      setLocalItems((prev) => prev.filter((i) => i.id !== itemId))
      onDelete?.()
    }
  }

  if (items.length === 0) {
    return (
      <div className="ink-panel rounded-md px-5 py-14 text-center">
        <p className="text-sm text-[#8a7e65]">尚无{emptyLabel[type]}，道友来补第一笔。</p>
      </div>
    )
  }

  if (type === 'image') {
    return (
      <div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {displayItems.map((item) => {
            const img = item as ImageCandidate
            return (
              <div key={item.id} className="group relative overflow-hidden rounded-md border border-[#c9a24d]/10 bg-[#0f0d0b]">
                <div className="aspect-square overflow-hidden">
                  <img src={img.url} alt={img.description || '词条图片'} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#0c0a08]/90 via-[#0c0a08]/50 to-transparent px-2.5 pb-2 pt-6">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="赞同"
                      onClick={() => handleVote(item.id, 'up')}
                      className="focus-ring flex items-center gap-1 rounded-sm px-1.5 py-1 text-xs text-[#8a7e65] transition-colors hover:text-[#c9a24d]"
                    >
                      <ThumbsUp size={11} aria-hidden="true" />
                    </button>
                    <span className="font-ink text-xs text-[#f4ecd1]">{item.votes}</span>
                    <button
                      type="button"
                      aria-label="反对"
                      onClick={() => handleVote(item.id, 'down')}
                      className="focus-ring flex items-center gap-1 rounded-sm px-1.5 py-1 text-xs text-[#8a7e65] transition-colors hover:text-[#d4756b]"
                    >
                      <ThumbsDown size={11} aria-hidden="true" />
                    </button>
                  </div>
                  {verified && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-[#8a7e65]/50 transition-colors hover:text-[#d4756b]"
                    >
                      <Trash2 size={12} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {hasMore && <div ref={observerRef} className="mt-4 py-4 text-center text-sm text-[#8a7e65]">加载中...</div>}
        {!hasMore && sorted.length > PAGE_SIZE && (
          <p className="mt-3 text-center text-xs text-[#6b614e]">已展示全部 {sorted.length} 条</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {displayItems.map((item, index) => (
        <article key={item.id} className="ink-panel rounded-md p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              {type === 'description' && (
                <p className="text-sm leading-[1.85] text-[#c9be9f]">
                  {(item as DescCandidate).content}
                </p>
              )}

              {type === 'avatar' && (
                <div className="flex justify-center">
                  <img
                    src={(item as AvatarCandidate).url}
                    alt="候选头像"
                    className="h-40 w-40 rounded-full border-2 border-[#c9a24d]/15 object-cover"
                  />
                </div>
              )}

              {type === 'video' && (
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={(item as VideoLink).url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`focus-ring inline-flex min-h-11 items-center gap-2 rounded-md text-sm ${getCategoryTextColor(category)} hover:underline`}
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                    {(item as VideoLink).title || '观看视频'}
                  </a>
                  <span className="text-xs text-[#8a7e65]">
                    {platformLabel[(item as VideoLink).platform] || (item as VideoLink).platform}
                  </span>
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#6b614e]">
                <span>{item.submittedBy} 录</span>
                <span aria-hidden="true">·</span>
                <time dateTime={item.submittedAt}>{item.submittedAt}</time>
                {index === 0 && sorted[0]?.id === item.id && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#c9a24d]/60">榜首</span>
                  </>
                )}
                {verified && (
                  <>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex items-center gap-1 text-[#d4756b]/50 hover:text-[#d4756b] transition-colors"
                    >
                      <Trash2 size={12} aria-hidden="true" />
                      删除
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                aria-label="赞同"
                onClick={() => handleVote(item.id, 'up')}
                className="focus-ring flex min-h-10 items-center gap-1.5 rounded-md border border-[#c9a24d]/10 px-3 text-xs text-[#8a7e65] transition-colors hover:border-[#c9a24d]/25 hover:bg-[#1a160e] hover:text-[#c9a24d]"
              >
                <ThumbsUp size={13} aria-hidden="true" />
                赞
              </button>
              <span className="min-w-[2.5rem] text-center font-ink text-base text-[#f4ecd1]">{item.votes}</span>
              <button
                type="button"
                aria-label="反对"
                onClick={() => handleVote(item.id, 'down')}
                className="focus-ring flex min-h-10 items-center gap-1.5 rounded-md border border-[#c9a24d]/10 px-3 text-xs text-[#8a7e65] transition-colors hover:border-[#d4756b]/25 hover:bg-[#1a0f0e] hover:text-[#d4756b]"
              >
                <ThumbsDown size={13} aria-hidden="true" />
                踩
              </button>
            </div>
          </div>
        </article>
      ))}
      {hasMore && <div ref={observerRef} className="py-4 text-center text-sm text-[#8a7e65]">加载中...</div>}
      {!hasMore && sorted.length > PAGE_SIZE && (
        <p className="text-center text-xs text-[#6b614e]">已展示全部 {sorted.length} 条</p>
      )}
    </div>
  )
}
