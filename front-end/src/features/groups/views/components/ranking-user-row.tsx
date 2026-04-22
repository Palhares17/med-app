"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { Avatar, AvatarImage, AvatarFallback } from "@/core/components/ui/avatar"
import { Badge } from "@/core/components/ui/badge"
import type { GroupMember } from "@/core/entities/group.entity"
import { cn } from "@/core/lib/utils"
import { mockUser } from "@/core/mocks/user.mock"

interface RankingUserRowProps {
  member: GroupMember
  animateHighlight?: boolean
}

const positionStyles: Record<number, string> = {
  1: "bg-yellow-500 text-white",
  2: "bg-gray-400 text-white",
  3: "bg-amber-600 text-white",
}

export const RankingUserRow = ({ member, animateHighlight = false }: RankingUserRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null)
  const isCurrentUser = member.id === mockUser.id

  useEffect(() => {
    if (!isCurrentUser || !animateHighlight || !rowRef.current) return

    gsap.fromTo(
      rowRef.current,
      { boxShadow: "0 0 0 0 rgba(59,130,246,0)" },
      {
        boxShadow: "0 0 20px 4px rgba(59,130,246,0.25)",
        duration: 0.8,
        delay: 1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      }
    )
  }, [isCurrentUser, animateHighlight])

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return (
    <div
      ref={rowRef}
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
        isCurrentUser
          ? "bg-primary/5 border border-primary/20"
          : "hover:bg-muted/50"
      )}
    >
      {/* Position */}
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          positionStyles[member.position] ?? "bg-muted text-muted-foreground"
        )}
      >
        {member.position}
      </div>

      {/* Avatar */}
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={member.avatar} alt={member.name} />
        <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
      </Avatar>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "truncate text-sm font-medium",
              isCurrentUser ? "text-primary" : "text-foreground"
            )}
          >
            {member.name}
          </span>
          {isCurrentUser && (
            <Badge variant="outline" className="shrink-0 text-[10px] px-1.5 py-0 border-primary/40 text-primary">
              Você
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-right">
        <div className="hidden sm:block">
          <span className="text-xs text-muted-foreground">
            {member.weeklyAnswered} resp.
          </span>
        </div>
        <div className="min-w-[60px] text-right">
          <span className="text-sm font-bold text-foreground">
            {member.weeklyScore}
          </span>
          <span className="ml-1 text-xs text-muted-foreground">pts</span>
        </div>
      </div>
    </div>
  )
}
