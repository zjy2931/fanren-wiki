import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getEntriesByCategory } from '@/lib/data'
import { CATEGORY_DESCRIPTIONS, CATEGORY_LABELS, type Category } from '@/lib/types'
import { getCategoryGradient } from '@/lib/utils'
import EntryCard from '@/components/EntryCard'
import CategoryIcon from '@/components/CategoryIcon'

const validCategories: Category[] = ['treasure', 'technique', 'character', 'episode', 'pill', 'artifact']

export default async function CategoryPage(props: { params: Promise<{ type: string }> }) {
  const { type } = await props.params
  const category = type as Category

  if (!validCategories.includes(category)) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-lg text-[#8a7e65]">未知分类</p>
      </div>
    )
  }

  const entries = await getEntriesByCategory(category)

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="focus-ring mb-6 inline-flex min-h-11 items-center gap-2 rounded-md text-sm text-[#8a7e65] transition-colors hover:text-[#e5ddd0]">
          <ArrowLeft size={16} aria-hidden="true" />
          返回首页
        </Link>

        <header className="ink-paper relative mb-8 overflow-hidden rounded-md p-6 sm:p-8">
          <div className="absolute right-8 top-0 h-40 w-40 rounded-full bg-[#c9a24d]/[0.04] blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className={`grid h-16 w-16 place-items-center rounded-md bg-gradient-to-br ${getCategoryGradient(category)} text-[#0c0a08]`}>
                <CategoryIcon category={category} size={28} />
              </div>
              <div>
                <p className="text-sm text-[#c9a24d]/60">分类卷宗</p>
                <h1 className="font-ink text-4xl text-[#f4ecd1]">{CATEGORY_LABELS[category]}</h1>
              </div>
            </div>
            <div className="max-w-lg text-sm leading-7 text-[#a09478] sm:text-right">
              <p>{CATEGORY_DESCRIPTIONS[category]}</p>
              <p className="mt-1 text-[#8a7e65]">共 {entries.length} 条记录</p>
            </div>
          </div>
        </header>

        {entries.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <div className="ink-panel rounded-md py-20 text-center">
            <p className="text-lg text-[#a09478]">该分类下暂无词条</p>
            <p className="mt-2 text-sm text-[#8a7e65]">道友，不妨来提交第一条。</p>
          </div>
        )}
      </div>
    </div>
  )
}
