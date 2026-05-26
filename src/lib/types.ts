export type Category = 'treasure' | 'technique' | 'character' | 'episode' | 'pill' | 'artifact'

export interface ImageCandidate {
  id: string
  url: string
  description: string
  votes: number
  submittedBy: string
  submittedAt: string
}

export interface DescCandidate {
  id: string
  content: string
  votes: number
  submittedBy: string
  submittedAt: string
}

export interface VideoLink {
  id: string
  platform: 'bilibili' | 'douyin' | 'other'
  url: string
  title: string
  votes: number
  submittedBy: string
  submittedAt: string
}

export interface AvatarCandidate {
  id: string
  url: string
  votes: number
  submittedBy: string
  submittedAt: string
}

export interface WikiEntry {
  id: string
  name: string
  category: Category
  coverImage: string
  summary: string
  avatars: AvatarCandidate[]
  images: ImageCandidate[]
  descriptions: DescCandidate[]
  videos: VideoLink[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export const CATEGORY_LABELS: Record<Category, string> = {
  treasure: '法宝',
  technique: '功法',
  character: '人物',
  episode: '剧情',
  pill: '丹药灵材',
  artifact: '奇物异兽',
}

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  treasure: '飞剑、灵宝与奇物的来历、威能和持有者。',
  technique: '修炼法门、神通秘术与境界突破线索。',
  character: '人物关系、修为履历与关键抉择。',
  episode: '动画篇章、名场面与事件脉络。',
  pill: '丹药、灵草、矿石、灵液等天材地宝。',
  artifact: '元磁神山、灵兽妖兽等不属于他类的奇异之物。',
}
