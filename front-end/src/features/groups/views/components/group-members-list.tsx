"use client"

import { Crown } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/core/components/ui/avatar"
import { Badge } from "@/core/components/ui/badge"
import { StaggerChildren } from "@/core/components/animations/stagger-children"
import type { GroupMember } from "@/core/entities/group.entity"
import { cn } from "@/core/lib/utils"
import { mockUser } from "@/core/mocks/user.mock"

interface GroupMembersListProps {
  members: GroupMember[]
  createdBy: string
}

export const GroupMembersList = ({
  members,
  createdBy,
}: GroupMembersListProps) => {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">
          Membros ({members.length})
        </h3>
      </div>

      <StaggerChildren
        stagger={0.05}
        delay={0.2}
        className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {members.map((member) => {
          const isCreator = member.id === createdBy
          const isCurrentUser = member.id === mockUser.id

          return (
            <div
              key={member.id}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5",
                isCurrentUser && "bg-primary/5"
              )}
            >
              <Avatar className="size-9 shrink-0">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "truncate text-sm font-medium",
                      isCurrentUser ? "text-primary" : "text-foreground"
                    )}
                  >
                    {member.name}
                  </span>
                  {isCreator && (
                    <Crown className="size-3.5 shrink-0 text-yellow-500" />
                  )}
                </div>
                {(isCreator || isCurrentUser) && (
                  <div className="flex gap-1 mt-0.5">
                    {isCreator && (
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0 border-yellow-500/40 text-yellow-500"
                      >
                        Criador
                      </Badge>
                    )}
                    {isCurrentUser && (
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0 border-primary/40 text-primary"
                      >
                        Você
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </StaggerChildren>
    </div>
  )
}
