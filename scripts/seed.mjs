import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const entries = JSON.parse(readFileSync(join(process.cwd(), 'data', 'entries.json'), 'utf-8'))
const stmts = entries.map((e) => {
  const data = JSON.stringify(e).replace(/'/g, "''")
  return `INSERT OR REPLACE INTO entries (id, data) VALUES ('${e.id}', '${data}');`
})
writeFileSync(join(process.cwd(), 'scripts', 'seed.sql'), stmts.join('\n'))
console.log(`Generated ${stmts.length} insert statements`)
