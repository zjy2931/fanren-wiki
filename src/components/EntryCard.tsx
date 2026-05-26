'use client'

import Link from 'next/link'
import { ArrowUpRight, Images, MessageSquareText } from 'lucide-react'
import { CATEGORY_LABELS } from '@/lib/types'
import type { Category } from '@/lib/types'
import { getCategoryBg, getCategoryGradient, getCategoryTextColor } from '@/lib/utils'
import CategoryIcon from '@/components/CategoryIcon'

interface EntryCardProps {
  entry: {
    id: string
    name: string
    category: Category
    coverImage: string
    summary: string
    descriptions: { votes: number; content: string }[]
    images: { votes: number; url: string }[]
    tags: string[]
  }
}

export default function EntryCard({ entry }: EntryCardProps) {
  const topDesc =
    entry.descriptions.length > 0
      ? [...entry.descriptions].sort((a, b) => b.votes - a.votes)[0].content
      : entry.summary

  const shortDesc = topDesc.length > 80 ? `${topDesc.slice(0, 80)}...` : topDesc

  return (
    <Link href={`/entry/${entry.id}`} className="focus-ring group block h-full rounded-md">
      <article
        className={`relative flex h-full min-h-52 flex-col overflow-hidden rounded-md border p-5 transition-all duration-300 ${getCategoryBg(
          entry.category
        )} hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]`}
      >
        <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${getCategoryGradient(entry.category)}`} />

        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#c9a24d]/[0.04] blur-2xl" />

        <div className="relative flex items-start gap-4">
          <div className={`grid h-12 w-12 flex-shrink-0 place-items-center overflow-hidden rounded-md ${entry.coverImage ? '' : `bg-gradient-to-br ${getCategoryGradient(entry.category)}`} text-[#0c0a08]`}>
            {entry.coverImage ? (
              <img src={entry.coverImage} alt={entry.name} className="h-full w-full object-cover" />
            ) : (
              <CategoryIcon category={entry.category} size={22} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="truncate font-ink text-lg text-[#f4ecd1]">{entry.name}</h3>
              <ArrowUpRight
                size={15}
                className="mt-1.5 shrink-0 text-[#8a7e65] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#c9a24d]"
                aria-hidden="true"
              />
            </div>
            <span className={`inline-flex items-center rounded-sm border border-current/20 bg-black/20 px-2 py-0.5 text-xs ${getCategoryTextColor(entry.category)}`}>
              {CATEGORY_LABELS[entry.category]}
            </span>
          </div>
        </div>

        <p className="mt-5 line-clamp-2 text-sm leading-7 text-[#a09478]">{shortDesc}</p>

        {entry.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {entry.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-sm border border-[#c9a24d]/8 bg-[#c9a24d]/[0.04] px-2 py-0.5 text-xs text-[#8a7e65]">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center gap-4 pt-5 text-xs text-[#6b614e]">
          <span className="inline-flex items-center gap-1.5">
            <MessageSquareText size={13} aria-hidden="true" />
            {entry.descriptions.length} 条描述
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Images size={13} aria-hidden="true" />
            {entry.images.length} 张图
          </span>
        </div>
      </article>
    </Link>
  )
}
