"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/core/components/layout/sidebar"
import { LoadingScreen } from "@/core/components/shared/loading-screen"
import { STORAGE_KEYS } from "@/core/constants"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      await new Promise((r) => setTimeout(r, 400))
      const user = localStorage.getItem(STORAGE_KEYS.USER)
      if (!user) {
        router.push("/login")
        return
      }
      setIsAuthenticated(true)
      setIsLoading(false)
    }
    check()
  }, [router])

  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:pl-64 transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
