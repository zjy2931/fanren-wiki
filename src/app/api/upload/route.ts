import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getCloudflareContext } from '@opennextjs/cloudflare'

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

function getD1(): D1Database | null {
  if (!isProduction()) return null
  try {
    const ctx = getCloudflareContext()
    return (ctx?.env as Record<string, unknown>)?.DB as D1Database | null ?? null
  } catch {
    return null
  }
}

function getKV(): KVNamespace | null {
  if (!isProduction()) return null
  try {
    const ctx = getCloudflareContext()
    return (ctx?.env as Record<string, unknown>)?.IMAGES_KV as KVNamespace | null ?? null
  } catch {
    return null
  }
}

async function saveFileLocal(file: File): Promise<string> {
  const fs = await import('fs/promises')
  const path = await import('path')
  const ext = file.name.split('.').pop() || 'jpg'
  const fileName = `${uuidv4().slice(0, 8)}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadDir, { recursive: true })
  const filePath = path.join(uploadDir, fileName)
  const bytes = await file.arrayBuffer()
  await fs.writeFile(filePath, Buffer.from(bytes))
  return `/uploads/${fileName}`
}

async function saveFileKV(file: File): Promise<string> {
  const kv = getKV()
  if (!kv) throw new Error('KV not available')
  const ext = file.name.split('.').pop() || 'jpg'
  const key = `img/${uuidv4().slice(0, 12)}.${ext}`
  const bytes = await file.arrayBuffer()
  await kv.put(key, bytes, {
    httpMetadata: { contentType: file.type },
  })
  return `/api/image/${key}`
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const entryId = formData.get('entryId') as string | null
  const mode = formData.get('mode') as string | null
  const submittedBy = (formData.get('submittedBy') as string) || '匿名道友'

  if (!file) {
    return NextResponse.json({ error: '没有文件' }, { status: 400 })
  }

  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: '仅支持 jpg/png/gif/webp' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: '文件不能超过 5MB' }, { status: 400 })
  }

  let url: string
  if (getKV()) {
    url = await saveFileKV(file)
  } else {
    url = await saveFileLocal(file)
  }

  if (mode === 'avatar' && entryId) {
    const { getAllEntries, saveAllEntries } = await import('@/lib/data')
    const entries = await getAllEntries()
    const entry = entries.find((e) => e.id === entryId)
    if (entry) {
      const avatarItem = {
        id: uuidv4(),
        url,
        votes: 0,
        submittedBy,
        submittedAt: new Date().toISOString().split('T')[0],
      }
      entry.avatars = entry.avatars || []
      entry.avatars.push(avatarItem)
      const topAvatar = [...entry.avatars].sort((a: { votes: number }, b: { votes: number }) => b.votes - a.votes)[0]
      entry.coverImage = topAvatar.url
      entry.updatedAt = new Date().toISOString().split('T')[0]
      await saveAllEntries(entries)
      return NextResponse.json({ url, avatar: avatarItem })
    }
  }

  return NextResponse.json({ url })
}
