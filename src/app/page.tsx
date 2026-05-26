import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { getAllEntries } from '@/lib/data'
import { CATEGORY_LABELS, type Category } from '@/lib/types'
import { getCategoryGradient } from '@/lib/utils'
import EntryCard from '@/components/EntryCard'
import CategoryIcon from '@/components/CategoryIcon'

const categories: Category[] = ['treasure', 'technique', 'character', 'episode', 'pill', 'artifact']

export default async function HomePage() {
  const entries = await getAllEntries()
  const recentEntries = entries.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  const descriptionCount = entries.reduce((sum, entry) => sum + entry.descriptions.length, 0)

  return (
    <div>
      <section className="relative min-h-[32rem] overflow-hidden px-4 pb-14 pt-10 sm:px-6 sm:min-h-[36rem] lg:pb-20 lg:pt-14">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/bg-compressed.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#0c0a08]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a08]/55 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#c9a24d]/15 bg-[#0c0a08]/60 px-3 py-2 text-sm text-[#a09478] backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#c9a24d]/60" aria-hidden="true" />
            动漫资料共修 · 法宝、功法、人物、丹药、奇物、剧情
          </div>

          <div className="flex items-start gap-5 sm:gap-8">
            <div className="hidden min-h-40 w-14 place-items-center sm:grid" aria-hidden="true">
              <div className="relative">
                <div className="absolute -inset-2 border border-[#c9a24d]/15" />
                <span className="font-ink text-xl leading-none text-[#c9a24d]/70 [writing-mode:vertical-rl]">万物志</span>
              </div>
            </div>
            <div>
              <h1 className="font-ink text-5xl leading-tight text-[#f4ecd1] sm:text-6xl lg:text-7xl">
                凡人修仙传
                <span className="mt-1 block text-[#c9a24d]/80">万物志</span>
              </h1>
              <p className="mt-6 max-w-2xl text-[15px] leading-8 text-[#c9be9f]/80 sm:text-base">
                以道友投票沉淀最可信的词条版本，记录青竹蜂云剑、辟邪神雷、人物因果与动画篇章。
                水墨为底、金线勾勒、朱砂点睛——如翻开一卷会呼吸的修仙札记。
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/submit"
                  className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#c9a24d] px-5 text-sm font-medium text-[#0c0a08] transition-colors hover:bg-[#e8c96a]"
                >
                  <Plus size={17} aria-hidden="true" />
                  新建词条
                </Link>
                <Link
                  href="#recent"
                  className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#c9a24d]/18 bg-[#0c0a08]/50 px-5 text-sm text-[#c9be9f] backdrop-blur-sm transition-colors hover:border-[#c9a24d]/30 hover:bg-[#1a160e]/60"
                >
                  浏览最新
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Index */}
      <section className="px-4 pb-14 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const count = entries.filter((entry) => entry.category === cat).length
              return (
                <Link
                  key={cat}
                  href={`/category/${cat}`}
                  className="focus-ring group flex flex-col items-center gap-3 rounded-md border border-[#c9a24d]/10 bg-[#0f0d0b]/70 px-4 py-5 text-center transition-all duration-200 hover:border-[#c9a24d]/25 hover:-translate-y-0.5"
                >
                  <div className={`grid h-12 w-12 place-items-center rounded-md bg-gradient-to-br ${getCategoryGradient(cat)} text-[#0c0a08]`}>
                    <CategoryIcon category={cat} size={22} />
                  </div>
                  <div>
                    <div className="font-ink text-[#f4ecd1]">{CATEGORY_LABELS[cat]}</div>
                    <div className="mt-0.5 text-xs text-[#8a7e65]">{count} 条</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Entries */}
      <section id="recent" className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="ink-stroke mb-8 border-t" />
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#c9a24d]/70">最新勘校</p>
              <h2 className="font-ink text-3xl text-[#f4ecd1]">近期更新词条</h2>
            </div>
            <Link href="/submit" className="focus-ring hidden min-h-11 items-center gap-2 rounded-md border border-[#c9a24d]/20 px-4 text-sm text-[#c9a24d]/80 transition-colors hover:border-[#c9a24d]/35 hover:text-[#c9a24d] sm:inline-flex">
              <Plus size={16} aria-hidden="true" />
              补一笔
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentEntries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
