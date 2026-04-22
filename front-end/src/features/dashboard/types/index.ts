import type { LucideIcon } from "lucide-react"

export interface StatCard {
  id: string
  label: string
  value: number
  suffix?: string
  icon: LucideIcon
}

export interface RecentActivity {
  id: string
  type: "flashcard" | "quiz" | "upload"
  description: string
  date: Date
}
