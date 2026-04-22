"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/core/entities/user.entity"
import { mockUser } from "@/core/mocks/user.mock"
import { STORAGE_KEYS } from "@/core/constants"

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

  const login = useCallback(async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser))
    setUser(mockUser)
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
