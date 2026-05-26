import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextResponse } from 'next/server'

function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params
  const kvKey = key.join('/')

  const kv = (() => {
    if (!isProduction()) return null
    try {
      const ctx = getCloudflareContext()
      return (ctx?.env as Record<string, unknown>)?.IMAGES_KV as KVNamespace | null ?? null
    } catch {
      return null
    }
  })()

  if (kv) {
    const value = await kv.get(kvKey, { type: 'arrayBuffer' })
    if (!value) {
      return NextResponse.json({ error: '图片不存在' }, { status: 404 })
    }
    const ext = kvKey.split('.').pop() || 'jpg'
    const contentType = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    }[ext] || 'image/jpeg'

    return new Response(value, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }

  const fs = await import('fs/promises')
  const path = await import('path')
  const filePath = path.join(process.cwd(), 'public', kvKey)
  try {
    const buffer = await fs.readFile(filePath)
    const ext = kvKey.split('.').pop() || 'jpg'
    const contentType = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    }[ext] || 'image/jpeg'
    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: '图片不存在' }, { status: 404 })
  }
}
