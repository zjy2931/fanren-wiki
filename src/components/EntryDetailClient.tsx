'use client'

import { useCallback, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, FileText, Image as ImageIcon, Plus, Trash2, UserCircle, Video } from 'lucide-react'
import VoteList from '@/components/VoteList'
import SubmitModal from '@/components/SubmitModal'
import CategoryIcon from '@/components/CategoryIcon'
import { CATEGORY_LABELS, type Category, type WikiEntry } from '@/lib/types'
import { getCategoryGradient, getCategoryTextColor } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'

type TabType = 'description' | 'image' | 'video' | 'avatar'

interface EntryDetailClientProps {
  initialEntry: WikiEntry
}

export default function EntryDetailClient({ initialEntry }: EntryDetailClientProps) {
  const router = useRouter()
  const { verified, key } = useAuth()
  const [entry, setEntry] = useState(initialEntry)
  const [activeTab, setActiveTab] = useState<TabType>('description')
  const [modalType, setModalType] = useState<TabType | null>(null)
  const [uploading, setUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

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

  const topAvatar = entry.avatars && entry.avatars.length > 0
    ? [...entry.avatars].sort((a, b) => b.votes - a.votes)[0]
    : null

  const fetchEntry = useCallback(async () => {
    const res = await fetch(`/api/entries/${entry.id}`)
    if (res.ok) {
      const data = await res.json()
      setEntry(data)
    }
  }, [entry.id])

  const category = entry.category as Category
  const tabConfig: { key: TabType; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'avatar', label: '头像', icon: <UserCircle size={16} aria-hidden="true" />, count: (entry.avatars || []).length },
    { key: 'description', label: '描述', icon: <FileText size={16} aria-hidden="true" />, count: entry.descriptions.length },
    { key: 'image', label: '图片', icon: <ImageIcon size={16} aria-hidden="true" />, count: entry.images.length },
    { key: 'video', label: '视频', icon: <Video size={16} aria-hidden="true" />, count: entry.videos.length },
  ]

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
              {entry.avatars && entry.avatars.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-[#8a7e65]">
                  <span>{entry.avatars.length} 个候选</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('avatar')}
                    className="text-[#c9a24d]/60 hover:text-[#c9a24d] transition-colors"
                  >
                    查看
                  </button>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-ink text-4xl text-[#f4ecd1] sm:text-5xl">{entry.name}</h1>
                <span className="ink-seal">
                  {CATEGORY_LABELS[category]}
                </span>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[#a09478] sm:text-[15px]">{entry.summary}</p>
              {entry.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="rounded-sm border border-[#c9a24d]/10 bg-[#c9a24d]/[0.04] px-2.5 py-0.5 text-xs text-[#8a7e65]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="mb-6 flex flex-col gap-4 border-b border-[#c9a24d]/10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex overflow-x-auto">
            {tabConfig.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`focus-ring flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? `${getCategoryTextColor(category)} border-current`
                    : 'border-transparent text-[#8a7e65] hover:text-[#c9be9f]'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className="rounded-full bg-[#c9a24d]/[0.06] px-2 py-0.5 text-xs">{tab.count}</span>
              </button>
            ))}
          </div>

          {activeTab === 'avatar' ? (
            <label className="focus-ring mb-3 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#c9a24d]/15 bg-[#1a160e]/80 px-4 text-sm text-[#c9be9f] transition-colors hover:border-[#c9a24d]/28 hover:bg-[#1a160e]">
              <Camera size={16} aria-hidden="true" />
              上传头像
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          ) : (
            <button
              type="button"
              onClick={() => setModalType(activeTab)}
              className="focus-ring mb-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#c9a24d]/15 bg-[#1a160e]/80 px-4 text-sm text-[#c9be9f] transition-colors hover:border-[#c9a24d]/28 hover:bg-[#1a160e]"
            >
              <Plus size={16} aria-hidden="true" />
              提交{activeTab === 'description' ? '描述' : activeTab === 'image' ? '图片' : '视频'}
            </button>
          )}

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
              className="focus-ring mb-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#d4756b]/15 px-4 text-sm text-[#d4756b]/70 transition-colors hover:border-[#d4756b]/30 hover:text-[#d4756b]"
            >
              <Trash2 size={15} aria-hidden="true" />
              删除词条
            </button>
          )}
        </div>

        <VoteList
          entryId={entry.id}
          type={activeTab}
          items={
            activeTab === 'avatar' ? (entry.avatars || []) :
            activeTab === 'description' ? entry.descriptions :
            activeTab === 'image' ? entry.images :
            entry.videos
          }
          category={category}
          onDelete={fetchEntry}
        />

        {modalType && modalType !== 'avatar' && (
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
