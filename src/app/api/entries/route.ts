import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getAllEntries, getEntriesByCategory, saveEntry } from '@/lib/data'
import type { Category, WikiEntry } from '@/lib/types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  const entries: WikiEntry[] = category
    ? await getEntriesByCategory(category)
    : await getAllEntries()

  return NextResponse.json(entries)
}

export async function POST(request: Request) {
  const body = await request.json()
  const today = new Date().toISOString().split('T')[0]
  const entry: WikiEntry = {
    id: uuidv4(),
    name: body.name,
    category: body.category as Category,
    coverImage: '',
    summary: body.summary || '',
    avatars: [],
    images: [],
    descriptions: body.description
      ? [
          {
            id: uuidv4(),
            content: body.description,
            votes: 0,
            submittedBy: body.submittedBy || '匿名道友',
            submittedAt: today,
          },
        ]
      : [],
    videos: [],
    tags: body.tags || [],
    createdAt: today,
    updatedAt: today,
  }

  await saveEntry(entry)
  return NextResponse.json(entry, { status: 201 })
}
