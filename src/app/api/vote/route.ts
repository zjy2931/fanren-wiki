import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getAllEntries, saveAllEntries } from '@/lib/data'

export async function POST(request: Request) {
  const body = await request.json()
  const { entryId, type, content, submittedBy, platform, url, title } = body

  if (!entryId || !type) {
    return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
  }

  const entries = await getAllEntries()
  const entry = entries.find((item) => item.id === entryId)

  if (!entry) {
    return NextResponse.json({ error: '词条不存在' }, { status: 404 })
  }

  const now = new Date().toISOString().split('T')[0]
  const user = submittedBy || '匿名道友'

  switch (type) {
    case 'image':
      entry.images.push({
        id: uuidv4(),
        url: content,
        description: '',
        votes: 0,
        submittedBy: user,
        submittedAt: now,
      })
      break
    case 'description':
      entry.descriptions.push({
        id: uuidv4(),
        content,
        votes: 0,
        submittedBy: user,
        submittedAt: now,
      })
      break
    case 'video':
      entry.videos.push({
        id: uuidv4(),
        platform: platform || 'other',
        url,
        title: title || '',
        votes: 0,
        submittedBy: user,
        submittedAt: now,
      })
      break
    default:
      return NextResponse.json({ error: '未知类型' }, { status: 400 })
  }

  entry.updatedAt = now
  await saveAllEntries(entries)

  return NextResponse.json({ success: true, entry })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { entryId, type, itemId, direction } = body

  if (!entryId || !type || !itemId || !direction) {
    return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
  }

  const entries = await getAllEntries()
  const entry = entries.find((item) => item.id === entryId)

  if (!entry) {
    return NextResponse.json({ error: '词条不存在' }, { status: 404 })
  }

  let list: { id: string; votes: number }[] = []
  switch (type) {
    case 'image':
      list = entry.images
      break
    case 'description':
      list = entry.descriptions
      break
    case 'video':
      list = entry.videos
      break
  }

  const item = list.find((candidate) => candidate.id === itemId)
  if (!item) {
    return NextResponse.json({ error: '项目不存在' }, { status: 404 })
  }

  item.votes += direction === 'up' ? 1 : -1
  entry.updatedAt = new Date().toISOString().split('T')[0]
  await saveAllEntries(entries)

  return NextResponse.json({ success: true, votes: item.votes })
}
