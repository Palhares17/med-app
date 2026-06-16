"use client"

import { useRef, useCallback } from "react"
import Link from "next/link"
import gsap from "gsap"
import { Users, Calendar, Trophy } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { Group } from "@/core/entities/group.entity"
import { Badge } from "@/core/components/ui/badge"
import { mockUser } from "@/core/mocks/user.mock"

interface GroupCardProps {
  group: Group
}

export const GroupCard = ({ group }: GroupCardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null)

  const currentUser = group.members.find((m) => m.id === mockUser.id)
  const userPosition = currentUser?.position ?? null

  const getPositionLabel = (pos: number) => {
    if (pos === 1) return "🥇 1º lugar"
    if (pos === 2) return "🥈 2º lugar"
    if (pos === 3) return "🥉 3º lugar"
    return `📊 ${pos}º lugar`
  }

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1.03,
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        scale: 1,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }, [])

  const formattedDate = format(new Date(group.createdAt), "dd MMM yyyy", {
    locale: ptBR,
  })

  return (
    <Link
      ref={cardRef}
      href={`/grupos/${group.id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="size-4" />
            <span className="text-sm">{group.memberCount} membros</span>
          </div>
          {userPosition && (
            <Badge
              variant={userPosition <= 3 ? "default" : "secondary"}
              className={
                userPosition === 1
                  ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                  : userPosition === 2
                    ? "bg-gray-400/10 text-gray-400 hover:bg-gray-400/20"
                    : userPosition === 3
                      ? "bg-amber-600/10 text-amber-600 hover:bg-amber-600/20"
                      : ""
              }
            >
              {getPositionLabel(userPosition)}
            </Badge>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground leading-tight">
            {group.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {group.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>{formattedDate}</span>
          </div>
          {userPosition && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Trophy className="size-3.5" />
              <span>{currentUser?.weeklyScore} pts</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
