'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, X } from 'lucide-react'
import CategoryIcon from '@/components/CategoryIcon'
import type { Category } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/types'

const categories: Category[] = ['treasure', 'technique', 'character', 'episode', 'pill', 'artifact']

interface SubmitEntryModalProps {
  onClose: () => void
}

export default function SubmitEntryModal({ onClose }: SubmitEntryModalProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    category: 'treasure' as Category,
    summary: '',
    description: '',
    tags: '',
    submittedBy: '',
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(/[,，\s]+/).map((tag) => tag.trim()).filter(Boolean),
      }),
    })

    if (res.ok) {
      const entry = await res.json()
      onClose()
      router.push(`/entry/${entry.id}`)
    } else {
      setLoading(false)
    }
  }

  const inputClass = 'focus-ring min-h-10 w-full rounded-md border border-[#c9a24d]/12 bg-[#0f0d0b] px-3 text-sm text-[#e5ddd0] placeholder:text-[#5c5342] transition-colors focus:border-[#c9a24d]/40'

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="ink-paper max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-md p-5 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-ink text-2xl text-[#f4ecd1]">新建词条</h2>
          <button type="button" onClick={onClose} className="focus-ring grid min-h-10 min-w-10 place-items-center rounded-md text-[#8a7e65] hover:text-[#e5ddd0]">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="entry-name" className="mb-1.5 block text-sm text-[#a09478]">词条名称 *</label>
            <input id="entry-name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="如：青竹蜂云剑" className={inputClass} />
          </div>

          <fieldset>
            <legend className="mb-1.5 block text-sm text-[#a09478]">分类 *</legend>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`focus-ring flex min-h-10 items-center justify-center gap-1.5 rounded-md border px-2 text-sm transition-all ${
                    form.category === cat
                      ? 'border-[#c9a24d]/45 bg-[#1a160e] text-[#e8c96a]'
                      : 'border-[#c9a24d]/10 bg-[#0f0d0b]/60 text-[#8a7e65] hover:border-[#c9a24d]/22 hover:text-[#c9be9f]'
                  }`}
                >
                  <CategoryIcon category={cat} size={14} />
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="summary" className="mb-1.5 block text-sm text-[#a09478]">简介</label>
            <input id="summary" type="text" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="一句话概括" className={inputClass} />
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm text-[#a09478]">详细描述</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="输入你对这个词条的描述，作为第一个候选版本供大家投票。"
              rows={3}
              className="focus-ring w-full resize-none rounded-md border border-[#c9a24d]/12 bg-[#0f0d0b] px-3 py-2 text-sm text-[#e5ddd0] placeholder:text-[#5c5342] transition-colors focus:border-[#c9a24d]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="tags" className="mb-1.5 block text-sm text-[#a09478]">标签</label>
              <input id="tags" type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="逗号分隔" className={inputClass} />
            </div>
            <div>
              <label htmlFor="submitted-by" className="mb-1.5 block text-sm text-[#a09478]">你的称呼</label>
              <input id="submitted-by" type="text" value={form.submittedBy} onChange={(e) => setForm({ ...form, submittedBy: e.target.value })} placeholder="匿名道友" className={inputClass} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !form.name}
            className="focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#c9a24d] font-medium text-[#0c0a08] transition-colors hover:bg-[#e8c96a] disabled:opacity-50"
          >
            <Send size={16} aria-hidden="true" />
            {loading ? '提交中...' : '创建词条'}
          </button>
        </form>
      </div>
    </div>
  )
}
