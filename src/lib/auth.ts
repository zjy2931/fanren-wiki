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

interface KeyStore {
  keys: string[]
  holders: Record<string, string>
}

let localKeysCache: KeyStore | null = null

async function readLocalKeys(): Promise<KeyStore> {
  if (localKeysCache) return localKeysCache
  const fs = await import('fs/promises')
  const path = await import('path')
  const raw = await fs.readFile(path.join(process.cwd(), 'data', 'keys.json'), 'utf-8')
  localKeysCache = JSON.parse(raw)
  return localKeysCache!
}

export async function verifyKey(key: string): Promise<{ valid: boolean; holder?: string }> {
  const db = getD1()
  if (db) {
    const row = await db.prepare('SELECT holder FROM keys WHERE key = ?').bind(key).first<{ holder: string }>()
    if (row) return { valid: true, holder: row.holder }
    return { valid: false }
  }
  const store = await readLocalKeys()
  if (store.keys.includes(key)) {
    return { valid: true, holder: store.holders[key] || '道友' }
  }
  return { valid: false }
}

export async function addKey(key: string, holder: string): Promise<void> {
  const db = getD1()
  if (db) {
    await db.prepare('INSERT OR IGNORE INTO keys (key, holder) VALUES (?, ?)').bind(key, holder).run()
    return
  }
  const store = await readLocalKeys()
  if (!store.keys.includes(key)) {
    store.keys.push(key)
    store.holders[key] = holder
    const fs = await import('fs/promises')
    const path = await import('path')
    await fs.writeFile(path.join(process.cwd(), 'data', 'keys.json'), JSON.stringify(store, null, 2), 'utf-8')
    localKeysCache = store
  }
}
