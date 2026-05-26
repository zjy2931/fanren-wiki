'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AuthState {
  key: string | null
  holder: string | null
  verified: boolean
  login: (key: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<string | null>(null)
  const [holder, setHolder] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('dao-you-ling')
    if (saved) {
      const parsed = JSON.parse(saved)
      setKey(parsed.key)
      setHolder(parsed.holder)
      setVerified(true)
    }
  }, [])

  async function login(inputKey: string): Promise<boolean> {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: inputKey }),
    })
    if (res.ok) {
      const data = await res.json()
      setKey(inputKey)
      setHolder(data.holder)
      setVerified(true)
      localStorage.setItem('dao-you-ling', JSON.stringify({ key: inputKey, holder: data.holder }))
      return true
    }
    return false
  }

  function logout() {
    setKey(null)
    setHolder(null)
    setVerified(false)
    localStorage.removeItem('dao-you-ling')
  }

  return (
    <AuthContext.Provider value={{ key, holder, verified, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
