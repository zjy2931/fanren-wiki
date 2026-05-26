import type { WikiEntry } from './types'
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

const localEntriesCache: { value: WikiEntry[] | null } = { value: null }

async function readLocal(): Promise<WikiEntry[]> {
  if (localEntriesCache.value) return localEntriesCache.value
  const fs = await import('fs/promises')
  const path = await import('path')
  const raw = await fs.readFile(path.join(process.cwd(), 'data', 'entries.json'), 'utf-8')
  localEntriesCache.value = JSON.parse(raw)
  return localEntriesCache.value!
}

async function writeLocal(entries: WikiEntry[]): Promise<void> {
  const fs = await import('fs/promises')
  const path = await import('path')
  const file = path.join(process.cwd(), 'data', 'entries.json')
  await fs.writeFile(file, JSON.stringify(entries, null, 2), 'utf-8')
  localEntriesCache.value = entries
}

export async function getAllEntries(): Promise<WikiEntry[]> {
  const db = getD1()
  if (db) {
    const { results } = await db.prepare('SELECT data FROM entries').all<{ data: string }>()
    return results.map((r) => JSON.parse(r.data))
  }
  return readLocal()
}

export async function getEntriesByCategory(category: string): Promise<WikiEntry[]> {
  const entries = await getAllEntries()
  return entries.filter((e) => e.category === category)
}

export async function getEntryById(id: string): Promise<WikiEntry | undefined> {
  const db = getD1()
  if (db) {
    const row = await db.prepare('SELECT data FROM entries WHERE id = ?').bind(id).first<{ data: string }>()
    return row ? JSON.parse(row.data) : undefined
  }
  const entries = await readLocal()
  return entries.find((e) => e.id === id)
}

export async function saveAllEntries(entries: WikiEntry[]): Promise<void> {
  const db = getD1()
  if (db) {
    await db.batch([
      db.prepare('DELETE FROM entries'),
      ...entries.map((e) =>
        db.prepare('INSERT INTO entries (id, data) VALUES (?, ?)').bind(e.id, JSON.stringify(e))
      ),
    ])
    return
  }
  await writeLocal(entries)
}

export async function saveEntry(entry: WikiEntry): Promise<void> {
  const db = getD1()
  if (db) {
    await db.prepare('INSERT OR REPLACE INTO entries (id, data) VALUES (?, ?)').bind(entry.id, JSON.stringify(entry)).run()
    return
  }
  const entries = await readLocal()
  const idx = entries.findIndex((e) => e.id === entry.id)
  if (idx >= 0) {
    entries[idx] = entry
  } else {
    entries.push(entry)
  }
  await writeLocal(entries)
}
