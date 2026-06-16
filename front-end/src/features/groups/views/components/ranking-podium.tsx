"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { Avatar, AvatarImage, AvatarFallback } from "@/core/components/ui/avatar"
import type { GroupMember } from "@/core/entities/group.entity"
import { cn } from "@/core/lib/utils"
import { mockUser } from "@/core/mocks/user.mock"

interface RankingPodiumProps {
  members: GroupMember[]
}

const medals = ["🥇", "🥈", "🥉"] as const
const podiumHeights = ["h-32", "h-24", "h-20"] as const
const podiumOrder = [1, 0, 2] as const // 2nd, 1st, 3rd visual order

export const RankingPodium = ({ members }: RankingPodiumProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const podiumRefs = useRef<(HTMLDivElement | null)[]>([])
  const medalRefs = useRef<(HTMLSpanElement | null)[]>([])

  const top3 = members.slice(0, 3)

  useEffect(() => {
    if (!containerRef.current) return

    // Animate podiums rising: 3rd → 2nd → 1st
    const orderedRefs = [podiumRefs.current[2], podiumRefs.current[1], podiumRefs.current[0]]

    orderedRefs.forEach((el, i) => {
      if (!el) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: 0.2 + i * 0.2,
          ease: "back.out(1.4)",
        }
      )
    })

    // Animate medals with pulse
    medalRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.fromTo(
        el,
        { scale: 0, rotate: -30 },
        {
          scale: 1,
          rotate: 0,
          duration: 0.5,
          delay: 0.8 + i * 0.15,
          ease: "elastic.out(1, 0.5)",
        }
      )
      // Subtle glow pulse
      gsap.to(el, {
        textShadow: "0 0 12px rgba(255,215,0,0.4)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      })
    })
  }, [])

  if (top3.length < 3) return null

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return (
    <div
      ref={containerRef}
      className="flex items-end justify-center gap-3 py-6 sm:gap-6"
    >
      {podiumOrder.map((memberIdx) => {
        const member = top3[memberIdx]
        const isFirst = memberIdx === 0
        const isCurrentUser = member.id === mockUser.id

        return (
          <div
            key={member.id}
            ref={(el) => {
              podiumRefs.current[memberIdx] = el
            }}
            className="flex flex-col items-center gap-3"
            style={{ opacity: 0 }}
          >
            {/* Avatar + Medal */}
            <div className="relative">
              <Avatar
                className={cn(
                  "border-2",
                  isFirst ? "size-20 sm:size-24" : "size-16 sm:size-20",
                  memberIdx === 0
                    ? "border-yellow-500"
                    : memberIdx === 1
                      ? "border-gray-400"
                      : "border-amber-600",
                  isCurrentUser && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-sm">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <span
                ref={(el) => {
                  medalRefs.current[memberIdx] = el
                }}
                className="absolute -bottom-2 -right-2 text-2xl sm:text-3xl"
                style={{ transform: "scale(0)" }}
              >
                {medals[memberIdx]}
              </span>
            </div>

            {/* Name */}
            <div className="text-center">
              <p
                className={cn(
                  "text-sm font-semibold text-foreground sm:text-base",
                  isCurrentUser && "text-primary"
                )}
              >
                {member.name}
                {isCurrentUser && (
                  <span className="ml-1 text-xs text-primary">(Você)</span>
                )}
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {member.weeklyScore} pts
              </p>
            </div>

            {/* Podium block */}
            <div
              className={cn(
                "flex w-20 items-center justify-center rounded-t-lg sm:w-28",
                podiumHeights[memberIdx],
                memberIdx === 0
                  ? "bg-gradient-to-t from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30"
                  : memberIdx === 1
                    ? "bg-gradient-to-t from-gray-400/20 to-gray-400/5 border border-gray-400/30"
                    : "bg-gradient-to-t from-amber-600/20 to-amber-600/5 border border-amber-600/30"
              )}
            >
              <span
                className={cn(
                  "text-3xl font-black sm:text-4xl",
                  memberIdx === 0
                    ? "text-yellow-500/60"
                    : memberIdx === 1
                      ? "text-gray-400/60"
                      : "text-amber-600/60"
                )}
              >
                {memberIdx + 1}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
