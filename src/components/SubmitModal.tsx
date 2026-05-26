'use client'

import { useState } from 'react'
import { ImagePlus, Link, Send, X } from 'lucide-react'

interface SubmitModalProps {
  entryId: string
  type: 'description' | 'image' | 'video'
  onClose: () => void
  onSuccess: () => void
}

const typeLabel = {
  description: '描述',
  image: '图片',
  video: '视频',
}

export default function SubmitModal({ entryId, type, onClose, onSuccess }: SubmitModalProps) {
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('bilibili')
  const [submittedBy, setSubmittedBy] = useState('')
  const [loading, setLoading] = useState(false)

  const [imageMode, setImageMode] = useState<'url' | 'file'>('url')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setImageFile(f)
    const reader = new FileReader()
    reader.onload = (ev) => setFilePreview(ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const user = submittedBy || '匿名道友'

    try {
      let imageContent: string | undefined

      if (type === 'image') {
        if (imageMode === 'file' && imageFile) {
          const formData = new FormData()
          formData.append('file', imageFile)
          formData.append('submittedBy', user)
          const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
          if (!uploadRes.ok) {
            setLoading(false)
            return
          }
          const uploadData = await uploadRes.json()
          imageContent = uploadData.url
        } else {
          imageContent = url
        }
      }

      const body: Record<string, string> = {
        entryId,
        type,
        submittedBy: user,
      }

      if (type === 'description') {
        body.content = content
      } else if (type === 'image') {
        body.content = imageContent || url
      } else {
        body.url = url
        body.title = title
        body.platform = platform
      }

      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      setLoading(false)
      if (res.ok) {
        onSuccess()
        onClose()
      }
    } catch {
      setLoading(false)
    }
  }

  const inputClass = 'focus-ring min-h-11 w-full rounded-md border border-[#c9a24d]/12 bg-[#0f0d0b] px-4 text-sm text-[#e5ddd0] placeholder:text-[#5c5342] transition-colors focus:border-[#c9a24d]/40'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="submit-modal-title">
      <div className="ink-paper w-full max-w-md rounded-md p-5 shadow-2xl sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h3 id="submit-modal-title" className="font-ink text-2xl text-[#f4ecd1]">
            提交{typeLabel[type]}
          </h3>
          <button
            type="button"
            aria-label="关闭"
            onClick={onClose}
            className="focus-ring grid min-h-11 min-w-11 place-items-center rounded-md text-[#8a7e65] transition-colors hover:bg-white/[0.04] hover:text-[#e5ddd0]"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modal-by" className="mb-2 block text-sm text-[#a09478]">你的称呼</label>
            <input id="modal-by" type="text" value={submittedBy} onChange={(e) => setSubmittedBy(e.target.value)} placeholder="匿名道友" className={inputClass} />
          </div>

          {type === 'description' && (
            <div>
              <label htmlFor="modal-desc" className="mb-2 block text-sm text-[#a09478]">描述内容</label>
              <textarea id="modal-desc" value={content} onChange={(e) => setContent(e.target.value)} placeholder="输入你对这个词条的描述..." rows={5} required className="focus-ring w-full resize-none rounded-md border border-[#c9a24d]/12 bg-[#0f0d0b] px-4 py-3 text-sm text-[#e5ddd0] placeholder:text-[#5c5342] transition-colors focus:border-[#c9a24d]/40" />
            </div>
          )}

          {type === 'image' && (
            <div className="space-y-3">
              <div className="flex gap-1 rounded-md border border-[#c9a24d]/12 bg-[#0f0d0b] p-1">
                <button
                  type="button"
                  onClick={() => setImageMode('url')}
                  className={`focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-sm transition-all ${
                    imageMode === 'url' ? 'bg-[#c9a24d]/12 text-[#e8c96a]' : 'text-[#8a7e65] hover:text-[#c9be9f]'
                  }`}
                >
                  <Link size={14} aria-hidden="true" />
                  图片链接
                </button>
                <button
                  type="button"
                  onClick={() => setImageMode('file')}
                  className={`focus-ring flex flex-1 items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-sm transition-all ${
                    imageMode === 'file' ? 'bg-[#c9a24d]/12 text-[#e8c96a]' : 'text-[#8a7e65] hover:text-[#c9be9f]'
                  }`}
                >
                  <ImagePlus size={14} aria-hidden="true" />
                  上传文件
                </button>
              </div>

              {imageMode === 'url' && (
                <div>
                  <label htmlFor="modal-img" className="mb-2 block text-sm text-[#a09478]">图片 URL</label>
                  <input id="modal-img" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/image.jpg" required className={inputClass} />
                </div>
              )}

              {imageMode === 'file' && (
                <div>
                  <label className="mb-2 block text-sm text-[#a09478]">选择图片</label>
                  <label className="focus-ring group flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#c9a24d]/20 bg-[#0f0d0b] px-4 text-sm text-[#8a7e65] transition-colors hover:border-[#c9a24d]/40 hover:text-[#c9be9f]">
                    <ImagePlus size={16} aria-hidden="true" />
                    {imageFile ? imageFile.name : '点击选择图片（最大 5MB）'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                      aria-label="选择图片文件"
                    />
                  </label>
                  {filePreview && (
                    <div className="mt-3 overflow-hidden rounded-md border border-[#c9a24d]/10">
                      <img src={filePreview} alt="预览" className="max-h-48 w-full object-contain" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {type === 'video' && (
            <>
              <div>
                <label htmlFor="modal-vurl" className="mb-2 block text-sm text-[#a09478]">视频链接</label>
                <input id="modal-vurl" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.bilibili.com/..." required className={inputClass} />
              </div>
              <div>
                <label htmlFor="modal-vtitle" className="mb-2 block text-sm text-[#a09478]">视频标题</label>
                <input id="modal-vtitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="视频标题" className={inputClass} />
              </div>
              <div>
                <label htmlFor="modal-plat" className="mb-2 block text-sm text-[#a09478]">平台</label>
                <select id="modal-plat" value={platform} onChange={(e) => setPlatform(e.target.value)} className={inputClass}>
                  <option value="bilibili">Bilibili</option>
                  <option value="douyin">抖音</option>
                  <option value="other">其他</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading || (type === 'image' && imageMode === 'file' && !imageFile)}
            className="focus-ring flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#c9a24d] font-medium text-[#0c0a08] transition-colors hover:bg-[#e8c96a] disabled:opacity-50"
          >
            <Send size={16} aria-hidden="true" />
            {loading ? '提交中...' : '提交'}
          </button>
        </form>
      </div>
    </div>
  )
}
