import { promises as fs } from 'fs'
import path from 'path'

interface KeyStore {
  keys: string[]
  holders: Record<string, string>
}

const KEYS_FILE = path.join(process.cwd(), 'data', 'keys.json')

export async function verifyKey(key: string): Promise<{ valid: boolean; holder?: string }> {
  const raw = await fs.readFile(KEYS_FILE, 'utf-8')
  const store: KeyStore = JSON.parse(raw)
  if (store.keys.includes(key)) {
    return { valid: true, holder: store.holders[key] || '道友' }
  }
  return { valid: false }
}

export async function addKey(key: string, holder: string): Promise<void> {
  const raw = await fs.readFile(KEYS_FILE, 'utf-8')
  const store: KeyStore = JSON.parse(raw)
  if (!store.keys.includes(key)) {
    store.keys.push(key)
    store.holders[key] = holder
    await fs.writeFile(KEYS_FILE, JSON.stringify(store, null, 2), 'utf-8')
  }
}
