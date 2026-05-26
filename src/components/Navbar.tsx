'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BookOpen, Clapperboard, Gem, Home, KeyRound, LogOut, Menu, Plus, ScrollText, UserRound, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import SubmitEntryModal from '@/components/SubmitEntryModal'

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/category/treasure', label: '法宝', icon: Gem },
  { href: '/category/technique', label: '功法', icon: ScrollText },
  { href: '/category/character', label: '人物', icon: UserRound },
  { href: '/category/episode', label: '剧情', icon: Clapperboard },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)
  const [keyValue, setKeyValue] = useState('')
  const [keyError, setKeyError] = useState(false)
  const [keyLoading, setKeyLoading] = useState(false)
  const { verified, holder, login, logout } = useAuth()

  async function handleKeySubmit() {
    setKeyLoading(true)
    setKeyError(false)
    const ok = await login(keyValue)
    setKeyLoading(false)
    if (ok) {
      setShowKeyInput(false)
      setKeyValue('')
    } else {
      setKeyError(true)
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-[#c9a24d]/10 bg-[#0c0a08]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="focus-ring group flex min-h-11 items-center gap-3 rounded-md">
              <span className="grid h-10 w-10 place-items-center rounded-md border border-[#c9a24d]/25 bg-[#1a160e] text-[#e8c96a]">
                <BookOpen size={20} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block font-ink text-xl text-[#f4ecd1] transition-colors group-hover:text-white">
                  凡人万物志
                </span>
                <span className="block text-xs text-[#8a7e65]">灵界札记 · 词条共修</span>
              </span>
            </Link>

            <div className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`focus-ring flex min-h-11 items-center gap-2 rounded-md px-3 text-sm transition-all duration-200 ${
                      active
                        ? 'bg-[#1a160e] text-[#e8c96a] shadow-[inset_0_0_0_1px_rgba(201,162,77,0.18)]'
                        : 'text-[#a09478] hover:bg-white/[0.04] hover:text-[#e5ddd0]'
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            <div className="hidden items-center gap-2 md:flex">
              {verified ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-md border border-[#c9a24d]/20 bg-[#1a160e] px-3 py-1.5 text-xs text-[#e8c96a]">
                    <KeyRound size={13} aria-hidden="true" />
                    {holder}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="focus-ring grid min-h-9 min-w-9 place-items-center rounded-md text-[#8a7e65] transition-colors hover:bg-white/[0.04] hover:text-[#d4756b]"
                    aria-label="退出令牌"
                  >
                    <LogOut size={15} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowKeyInput(true)}
                  className="focus-ring flex min-h-11 items-center gap-2 rounded-md border border-[#c9a24d]/15 px-3 text-sm text-[#8a7e65] transition-colors hover:border-[#c9a24d]/25 hover:text-[#c9a24d]"
                >
                  <KeyRound size={15} aria-hidden="true" />
                  道友令
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowSubmit(true)}
                className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-md bg-[#c9a24d] px-4 text-sm font-medium text-[#0c0a08] transition-all duration-200 hover:bg-[#e8c96a]"
              >
                <Plus size={16} strokeWidth={2} aria-hidden="true" />
                新建词条
              </button>
            </div>

            <button
              type="button"
              aria-label={open ? '关闭导航' : '打开导航'}
              aria-expanded={open}
              className="focus-ring grid min-h-11 min-w-11 place-items-center rounded-md border border-[#c9a24d]/15 text-[#a09478] transition-colors hover:bg-white/[0.04] md:hidden"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>

          {open && (
            <div className="space-y-1 pb-4 md:hidden">
            {[...navItems, { href: '__submit__', label: '新建词条', icon: Plus }].map((item) => {
              const Icon = item.icon
              if (item.href === '__submit__') {
                return (
                  <button
                    key="submit"
                    type="button"
                    onClick={() => { setOpen(false); setShowSubmit(true) }}
                    className="focus-ring flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm text-[#c9be9f] transition-colors hover:bg-white/[0.04]"
                  >
                    <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                    {item.label}
                  </button>
                )
              }
              return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="focus-ring flex min-h-11 items-center gap-3 rounded-md px-3 text-sm text-[#c9be9f] transition-colors hover:bg-white/[0.04]"
                  >
                    <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      {showKeyInput && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="ink-paper w-full max-w-sm rounded-md p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-ink text-xl text-[#f4ecd1]">出示道友令</h3>
              <button type="button" onClick={() => { setShowKeyInput(false); setKeyError(false) }} className="focus-ring grid min-h-11 min-w-11 place-items-center rounded-md text-[#8a7e65] hover:text-[#e5ddd0]">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <p className="mb-4 text-sm text-[#8a7e65]">持有道友令的道友可以编辑和删除词条内容。</p>
            <input
              type="text"
              value={keyValue}
              onChange={(e) => { setKeyValue(e.target.value); setKeyError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && handleKeySubmit()}
              placeholder="输入道友令..."
              className="focus-ring min-h-11 w-full rounded-md border border-[#c9a24d]/12 bg-[#0f0d0b] px-4 text-sm text-[#e5ddd0] placeholder:text-[#5c5342] focus:border-[#c9a24d]/40"
            />
            {keyError && <p className="mt-2 text-xs text-[#d4756b]">令牌无效，请检查后重试。</p>}
            <button
              type="button"
              onClick={handleKeySubmit}
              disabled={keyLoading || !keyValue}
              className="focus-ring mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#c9a24d] font-medium text-[#0c0a08] hover:bg-[#e8c96a] disabled:opacity-50"
            >
              <KeyRound size={15} aria-hidden="true" />
              {keyLoading ? '验证中...' : '验证'}
            </button>
          </div>
        </div>
      )}

      {showSubmit && <SubmitEntryModal onClose={() => setShowSubmit(false)} />}
    </>
  )
}
