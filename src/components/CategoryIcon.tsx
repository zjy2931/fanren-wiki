import { Clapperboard, Flame, ScrollText, Sword, UserRound } from 'lucide-react'
import type { Category } from '@/lib/types'

interface CategoryIconProps {
  category: Category
  className?: string
  size?: number
}

const iconMap = {
  treasure: Sword,
  technique: ScrollText,
  character: UserRound,
  episode: Clapperboard,
}

export default function CategoryIcon({ category, className, size = 24 }: CategoryIconProps) {
  const Icon = iconMap[category]
  return <Icon aria-hidden="true" className={className} size={size} strokeWidth={1.8} />
}
