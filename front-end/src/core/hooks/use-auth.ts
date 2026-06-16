"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/core/entities/user.entity"
import { STORAGE_KEYS } from "@/core/constants"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"

interface StoredUser extends User {
  accessToken?: string
}

interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: () => Promise<void>
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEYS.USER)
      }
    }
  }, [])

  // Called after Supabase OAuth redirect — token is in URL hash or passed in
  const syncWithBackend = useCallback(async (accessToken: string) => {
    try {
      const res = await fetch(`${API_URL}/users/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (res.ok) {
        const userData = await res.json()
        const stored: StoredUser = { ...userData, accessToken, plan: "free", credits: { used: 0, total: 50 } }
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(stored))
        setUser(stored)
      }
    } catch {
      // If backend unavailable, continue with mock user for dev
    }
  }, [])

  // Mock login for development (when Supabase is not configured)
  const login = useCallback(async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // In production this would be replaced by Supabase OAuth redirect.
    // For now, create a dev user with a placeholder token.
    const devUser: StoredUser = {
      id: "dev-user-001",
      name: "Estudante Dev",
      email: "dev@medbrain.app",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Dev+User&backgroundColor=3b82f6&textColor=ffffff",
      plan: "free",
      credits: { used: 0, total: 50 },
      createdAt: new Date().toISOString(),
      accessToken: "dev-token",
    }

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(devUser))
    setUser(devUser)
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER)
    setUser(null)
  }, [])

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }
}
