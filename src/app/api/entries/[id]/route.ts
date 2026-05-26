import { NextResponse } from 'next/server'
import { getEntryById, getAllEntries, saveAllEntries } from '@/lib/data'
import { verifyKey } from '@/lib/auth'

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const entry = await getEntryById(id)

  if (!entry) {
    return NextResponse.json({ error: '词条不存在' }, { status: 404 })
  }

  return NextResponse.json(entry)
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params
  const { key, deleteType, itemId } = await request.json()

  if (!key) {
    return NextResponse.json({ error: '需要道友令' }, { status: 401 })
  }

  const auth = await verifyKey(key)
  if (!auth.valid) {
    return NextResponse.json({ error: '令牌无效' }, { status: 401 })
  }

  const entries = await getAllEntries()
  const entryIdx = entries.findIndex((e) => e.id === id)

  if (entryIdx < 0) {
    return NextResponse.json({ error: '词条不存在' }, { status: 404 })
  }

  if (deleteType === 'item' && itemId) {
    const entry = entries[entryIdx]
    const lists: Record<string, { id: string }[]> = {
      description: entry.descriptions,
      image: entry.images,
      video: entry.videos,
    }
    const list = lists['description'] || lists['image'] || lists['video']
    for (const l of Object.values(lists)) {
      const idx = l.findIndex((i) => i.id === itemId)
      if (idx >= 0) {
        l.splice(idx, 1)
        break
      }
    }
    entry.updatedAt = new Date().toISOString().split('T')[0]
    await saveAllEntries(entries)
    return NextResponse.json({ success: true, message: '已删除' })
  }

  entries.splice(entryIdx, 1)
  await saveAllEntries(entries)
  return NextResponse.json({ success: true, message: '词条已删除' })
}
