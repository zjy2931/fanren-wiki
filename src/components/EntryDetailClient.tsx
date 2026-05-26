'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, FileText, ImagePlus, Plus, Trash2, Video } from 'lucide-react'
import VoteList from '@/components/VoteList'
import SubmitModal from '@/components/SubmitModal'
import CategoryIcon from '@/components/CategoryIcon'
import { CATEGORY_LABELS, type Category, type WikiEntry } from '@/lib/types'
import { getCategoryGradient, getCategoryTextColor } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

interface EntryDetailClientProps {
  initialEntry: WikiEntry
}

export default function EntryDetailClient({ initialEntry }: EntryDetailClientProps) {
  const router = useRouter()
  const { verified, key } = useAuth()
  const [entry, setEntry] = useState(initialEntry)
  const [modalType, setModalType] = useState<'description' | 'image' | 'video' | null>(null)
  const [uploading, setUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const imageDropRef = useRef<HTMLDivElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const isCharacter = entry.category === 'character'
  const category = entry.category as Category

  const topAvatar = isCharacter && entry.avatars && entry.avatars.length > 0
    ? [...entry.avatars].sort((a, b) => b.votes - a.votes)[0]
    : null

  const fetchEntry = useCallback(async () => {
    const res = await fetch(`/api/entries/${entry.id}`)
    if (res.ok) {
      const data = await res.json()
      setEntry(data)
    }
  }, [entry.id])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('entryId', entry.id)
    formData.append('mode', 'avatar')
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (res.ok) {
      const data = await res.json()
      if (data.avatar) {
        setEntry((prev) => ({
          ...prev,
          avatars: [...(prev.avatars || []), data.avatar],
          coverImage: data.url,
        }))
      }
    }
    setUploading(false)
    if (avatarInputRef.current) avatarInputRef.current.value = ''
  }

  async function handleImageDrop(files: FileList) {
    const file = files[0]
    if (!file || !file.type.startsWith('image/')) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('submittedBy', '匿名道友')
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
    if (uploadRes.ok) {
      const uploadData = await uploadRes.json()
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: entry.id, type: 'image', content: uploadData.url, submittedBy: '匿名道友' }),
      })
      fetchEntry()
    }
    setUploading(false)
  }

  const sectionTitle = (icon: React.ReactNode, text: string, count: number, onAdd?: () => void) => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        {icon}
        <h2 className="font-ink text-xl text-[#f4ecd1]">{text}</h2>
        <span className="rounded-full bg-[#c9a24d]/[0.08] px-2.5 py-0.5 text-xs text-[#8a7e65]">{count}</span>
      </div>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="focus-ring inline-flex min-h-9 items-center gap-1.5 rounded-md border border-[#c9a24d]/15 px-3 text-sm text-[#c9be9f] transition-colors hover:border-[#c9a24d]/28 hover:text-[#e8c96a]"
        >
          <Plus size={14} aria-hidden="true" />
          补充
        </button>
      )}
    </div>
  )

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          href={`/category/${entry.category}`}
          className="focus-ring mb-6 inline-flex min-h-11 items-center gap-2 rounded-md text-sm text-[#8a7e65] transition-colors hover:text-[#e5ddd0]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          返回{CATEGORY_LABELS[category]}
        </Link>

        <header className="ink-paper relative mb-8 overflow-hidden rounded-md p-6 sm:p-8">
          <div className="absolute right-6 top-0 h-44 w-44 rounded-full bg-[#c9a24d]/[0.04] blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
            {isCharacter ? (
              <div className="flex flex-col items-center gap-1">
                <label className={`group relative flex h-24 w-24 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#c9a24d]/20 transition-all hover:border-[#c9a24d]/40 ${uploading ? 'pointer-events-none opacity-60' : ''}`}>
                  {topAvatar ? (
                    <img src={topAvatar.url} alt={entry.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${getCategoryGradient(category)}`}>
                      <CategoryIcon category={category} size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera size={22} className="text-[#e8c96a]" aria-hidden="true" />
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    aria-label="上传头像"
                  />
                </label>
              </div>
            ) : (
              <div className={`grid h-24 w-24 flex-shrink-0 place-items-center rounded-full border-2 border-[#c9a24d]/20 bg-gradient-to-br ${getCategoryGradient(category)} text-[#0c0a08]`}>
                <CategoryIcon category={category} size={36} />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-ink text-4xl text-[#f4ecd1] sm:text-5xl">{entry.name}</h1>
                <span className="ink-seal">{CATEGORY_LABELS[category]}</span>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#a09478] sm:text-[15px]">{entry.summary}</p>
              {entry.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="rounded-sm border border-[#c9a24d]/10 bg-[#c9a24d]/[0.04] px-2.5 py-0.5 text-xs text-[#8a7e65]">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            {verified && (
              <button
                type="button"
                onClick={async () => {
                  if (!confirm('确定要删除整个词条吗？此操作不可撤销。')) return
                  const res = await fetch(`/api/entries/${entry.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key }),
                  })
                  if (res.ok) router.push('/')
                }}
                className="focus-ring hidden min-h-11 items-center gap-2 rounded-md border border-[#d4756b]/15 px-4 text-sm text-[#d4756b]/70 transition-colors hover:border-[#d4756b]/30 hover:text-[#d4756b] sm:inline-flex"
              >
                <Trash2 size={15} aria-hidden="true" />
                删除
              </button>
            )}
          </div>
        </header>

        <div className="space-y-10">
          <section>
            <div className="mb-4">
              {sectionTitle(
                <FileText size={18} className={getCategoryTextColor(category)} aria-hidden="true" />,
                '描述',
                entry.descriptions.length,
                () => setModalType('description')
              )}
            </div>
            <VoteList entryId={entry.id} type="description" items={entry.descriptions} category={category} onDelete={fetchEntry} />
          </section>

          {isCharacter && entry.avatars && entry.avatars.length > 0 && (
            <section>
              <div className="mb-4">
                {sectionTitle(
                  <Camera size={18} className={getCategoryTextColor(category)} aria-hidden="true" />,
                  '头像',
                  entry.avatars.length,
                  undefined
                )}
              </div>
              <VoteList entryId={entry.id} type="avatar" items={entry.avatars} category={category} onDelete={fetchEntry} />
            </section>
          )}

          <section>
            <div className="mb-4">
              {sectionTitle(
                <ImagePlus size={18} className={getCategoryTextColor(category)} aria-hidden="true" />,
                '图片',
                entry.images.length,
                () => setModalType('image')
              )}
            </div>
            <div
              ref={imageDropRef}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleImageDrop(e.dataTransfer.files) }}
              className={`rounded-md border-2 border-dashed p-6 text-center transition-colors ${
                dragOver ? 'border-[#c9a24d]/50 bg-[#c9a24d]/[0.04]' : 'border-[#c9a24d]/10'
              }`}
            >
              <p className="text-sm text-[#8a7e65]">拖拽图片到此处上传，或点击下方"补充"按钮</p>
            </div>
            <div className="mt-4">
              <VoteList entryId={entry.id} type="image" items={entry.images} category={category} onDelete={fetchEntry} />
            </div>
          </section>

          <section>
            <div className="mb-4">
              {sectionTitle(
                <Video size={18} className={getCategoryTextColor(category)} aria-hidden="true" />,
                '视频',
                entry.videos.length,
                () => setModalType('video')
              )}
            </div>
            <VoteList entryId={entry.id} type="video" items={entry.videos} category={category} onDelete={fetchEntry} />
          </section>
        </div>

        {modalType && (
          <SubmitModal
            entryId={entry.id}
            type={modalType}
            onClose={() => setModalType(null)}
            onSuccess={fetchEntry}
          />
        )}
      </div>
    </div>
  )
}
