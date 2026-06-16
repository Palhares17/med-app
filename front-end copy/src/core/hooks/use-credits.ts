"use client"

import { useState, useCallback } from "react"
import type { CreditInfo } from "@/core/entities/credit.entity"
import { mockCredits } from "@/core/mocks/credits.mock"

interface UseCreditsReturn {
  credits: CreditInfo
  remaining: number
  percentage: number
  canAfford: (cost: number) => boolean
  consume: (amount: number) => void
}

export function useCredits(): UseCreditsReturn {
  const [credits, setCredits] = useState<CreditInfo>(mockCredits)

  const remaining = credits.total - credits.used
  const percentage = Math.round((credits.used / credits.total) * 100)

  const canAfford = useCallback(
    (cost: number) => remaining >= cost,
    [remaining]
  )

  const consume = useCallback(
    (amount: number) => {
      setCredits((prev) => ({
        ...prev,
        used: Math.min(prev.used + amount, prev.total),
      }))
    },
    []
  )

  return {
    credits,
    remaining,
    percentage,
    canAfford,
    consume,
  }
}
