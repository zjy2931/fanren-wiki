import { NextResponse } from 'next/server'
import { verifyKey } from '@/lib/auth'

export async function POST(request: Request) {
  const { key } = await request.json()
  if (!key) {
    return NextResponse.json({ error: '请输入道友令' }, { status: 400 })
  }
  const result = await verifyKey(key)
  if (result.valid) {
    return NextResponse.json({ valid: true, holder: result.holder })
  }
  return NextResponse.json({ valid: false, error: '令牌无效' }, { status: 401 })
}
