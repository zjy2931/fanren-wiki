import { promises as fs } from 'fs'
import path from 'path'
import type { WikiEntry } from './types'

const DATA_FILE = path.join(process.cwd(), 'data', 'entries.json')

export async function getAllEntries(): Promise<WikiEntry[]> {
  const raw = await fs.readFile(DATA_FILE, 'utf-8')
  return JSON.parse(raw)
}

export async function getEntriesByCategory(category: string): Promise<WikiEntry[]> {
  const entries = await getAllEntries()
  return entries.filter((e) => e.category === category)
}

export async function getEntryById(id: string): Promise<WikiEntry | undefined> {
  const entries = await getAllEntries()
  return entries.find((e) => e.id === id)
}

export async function saveAllEntries(entries: WikiEntry[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8')
}

export async function saveEntry(entry: WikiEntry): Promise<void> {
  const entries = await getAllEntries()
  const idx = entries.findIndex((e) => e.id === entry.id)
  if (idx >= 0) {
    entries[idx] = entry
  } else {
    entries.push(entry)
  }
  await saveAllEntries(entries)
}
