"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { getSelf, login as apiLogin, logout as apiLogout } from "./api"
import type { UserInfo, LoginRequest } from "./types"

interface AuthState {
  user: UserInfo | null
  loading: boolean
  error: string | null
  login: (data: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  isAdmin: boolean
  isRoot: boolean
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const u = await getSelf()
      setUser(u)
    } catch (err) {
      setUser(null)
      // 未登录不是错误
    }
  }, [])

  const login = useCallback(async (data: LoginRequest) => {
    setLoading(true)
    setError(null)
    try {
      await apiLogin(data)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败")
      throw err
    } finally {
      setLoading(false)
    }
  }, [refresh])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  const isAdmin = user != null && user.role >= 2
  const isRoot = user != null && user.role >= 3

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, refresh, isAdmin, isRoot }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
