import type { Category, WikiEntry } from './types'

export function getTopDescription(entry: WikiEntry): string {
  if (entry.descriptions.length === 0) return entry.summary
  const sorted = [...entry.descriptions].sort((a, b) => b.votes - a.votes)
  return sorted[0].content
}

export function getTopImage(entry: WikiEntry): string | null {
  if (entry.images.length === 0) return null
  const sorted = [...entry.images].sort((a, b) => b.votes - a.votes)
  return sorted[0].url
}

export function getCategoryGradient(category: Category): string {
  const map: Record<Category, string> = {
    treasure: 'from-[#c9a24d] to-[#a67c2e]',
    technique: 'from-[#5a9e8f] to-[#3d7a6d]',
    character: 'from-[#4a7a9b] to-[#345e78]',
    episode: 'from-[#bf3b2e] to-[#8b2d23]',
    pill: 'from-[#9b6bbf] to-[#7a4d9b]',
    artifact: 'from-[#bf8a3b] to-[#9b6d2e]',
  }
  return map[category]
}

export function getCategoryBg(category: Category): string {
  const map: Record<Category, string> = {
    treasure: 'bg-[#1a160e]/80 border-[#c9a24d]/20',
    technique: 'bg-[#0f1a17]/80 border-[#5a9e8f]/18',
    character: 'bg-[#0f1520]/80 border-[#4a7a9b]/18',
    episode: 'bg-[#1a0f0e]/80 border-[#bf3b2e]/18',
    pill: 'bg-[#150f1a]/80 border-[#9b6bbf]/18',
    artifact: 'bg-[#1a150e]/80 border-[#bf8a3b]/18',
  }
  return map[category]
}

export function getCategoryAccent(category: Category): string {
  const map: Record<Category, string> = {
    treasure: '#c9a24d',
    technique: '#5a9e8f',
    character: '#4a7a9b',
    episode: '#bf3b2e',
    pill: '#9b6bbf',
    artifact: '#bf8a3b',
  }
  return map[category]
}

export function getCategoryTextColor(category: Category): string {
  const map: Record<Category, string> = {
    treasure: 'text-[#e8c96a]',
    technique: 'text-[#7cc4b4]',
    character: 'text-[#7aafcc]',
    episode: 'text-[#d4756b]',
    pill: 'text-[#c49bdf]',
    artifact: 'text-[#d4a85a]',
  }
  return map[category]
}
