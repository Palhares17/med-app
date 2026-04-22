"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/core/components/layout/sidebar"
import { LoadingScreen } from "@/core/components/shared/loading-screen"
import { STORAGE_KEYS } from "@/core/constants"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800))
      const user = localStorage.getItem(STORAGE_KEYS.USER)
      if (!user) {
        router.push("/login")
        return
      }
      setIsAuthenticated(true)
      setIsLoading(false)
    }
    checkAuth()
  }, [router])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
