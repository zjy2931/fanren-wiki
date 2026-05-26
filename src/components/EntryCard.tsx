'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORY_LABELS } from '@/lib/types'
import type { Category } from '@/lib/types'
import { getCategoryBg, getCategoryGradient, getCategoryTextColor } from '@/lib/utils'
import CategoryIcon from '@/components/CategoryIcon'

interface EntryCardProps {
  entry: {
    id: string
    name: string
    category: Category
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

  const topImage =
    entry.images.length > 0
      ? [...entry.images].sort((a, b) => b.votes - a.votes)[0].url
      : null

  return (
    <Link href={`/entry/${entry.id}`} className="focus-ring group block h-full rounded-md">
      <article
        className={`relative flex h-full min-h-52 flex-col overflow-hidden rounded-md border transition-all duration-300 ${getCategoryBg(
          entry.category
        )} hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]`}
      >
        <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${getCategoryGradient(entry.category)}`} />

        {topImage ? (
          <div className="relative aspect-video overflow-hidden">
            <img src={topImage} alt={entry.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08]/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <h3 className="truncate font-ink text-lg text-[#f4ecd1] drop-shadow-md">{entry.name}</h3>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-5 pb-0">
            <div className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-md bg-gradient-to-br ${getCategoryGradient(entry.category)} text-[#0c0a08]`}>
              <CategoryIcon category={entry.category} size={18} />
            </div>
            <h3 className="truncate font-ink text-lg text-[#f4ecd1]">{entry.name}</h3>
          </div>
        )}

        <div className={`flex flex-col gap-3 ${topImage ? 'px-4 pt-3' : 'px-5 pt-3'}`}>
          {!topImage && (
            <span className={`inline-flex w-fit items-center rounded-sm border border-current/20 bg-black/20 px-2 py-0.5 text-xs ${getCategoryTextColor(entry.category)}`}>
              {CATEGORY_LABELS[entry.category]}
            </span>
          )}
          <p className="line-clamp-2 text-sm leading-7 text-[#a09478]">{shortDesc}</p>
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-sm border border-[#c9a24d]/8 bg-[#c9a24d]/[0.04] px-2 py-0.5 text-xs text-[#8a7e65]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between px-4 pb-4 pt-4 sm:px-5">
          {topImage && (
            <span className={`inline-flex items-center rounded-sm border border-current/20 bg-black/20 px-2 py-0.5 text-xs ${getCategoryTextColor(entry.category)}`}>
              {CATEGORY_LABELS[entry.category]}
            </span>
          )}
          {!topImage && <span />}
          <ArrowUpRight
            size={15}
            className="text-[#8a7e65] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#c9a24d]"
            aria-hidden="true"
          />
        </div>
      </article>
    </Link>
  )
}
