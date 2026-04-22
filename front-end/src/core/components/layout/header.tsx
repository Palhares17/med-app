"use client"

import { useState } from "react"
import { Sun, Moon, User, Settings, LogOut } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/core/components/ui/avatar"
import { Button } from "@/core/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu"
import { mockUser } from "@/core/mocks/user.mock"

interface HeaderProps {
  title: string
}

export const Header = ({ title }: HeaderProps) => {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark((prev) => !prev)
    document.documentElement.classList.toggle("dark")
  }

  const initials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Alternar tema"
        >
          {isDark ? (
            <Sun className="size-5 text-muted-foreground" />
          ) : (
            <Moon className="size-5 text-muted-foreground" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative size-8 rounded-full">
              <Avatar>
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <div className="flex flex-col gap-1 px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">{mockUser.name}</p>
              <p className="text-xs text-muted-foreground">{mockUser.email}</p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <User className="mr-2 size-4" />
              Perfil
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings className="mr-2 size-4" />
              Configurações
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive">
              <LogOut className="mr-2 size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
