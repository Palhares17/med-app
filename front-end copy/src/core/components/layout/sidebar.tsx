"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {
  LayoutDashboard,
  Upload,
  Layers,
  ListChecks,
  Users,
  Sparkles,
  Menu,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/core/lib/utils"
import { Button } from "@/core/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/core/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/core/components/ui/sheet"
import { CreditBar } from "@/core/components/shared/credit-bar"
import { mockUser } from "@/core/mocks/user.mock"
import { mockCredits } from "@/core/mocks/credits.mock"

interface SidebarProps {
  children?: React.ReactNode
}

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Upload", href: "/upload", icon: Upload },
  { label: "Flashcards", href: "/flashcards", icon: Layers },
  { label: "Questões", href: "/questoes", icon: ListChecks },
  { label: "Grupos", href: "/grupos", icon: Users },
]

const initials = mockUser.name
  .split(" ")
  .map((n) => n[0])
  .join("")
  .toUpperCase()
  .slice(0, 2)

function SidebarNav({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
        const Icon = item.icon

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title={collapsed ? item.label : undefined}
          >
            <Icon className="size-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <Sparkles className="size-6 shrink-0 text-primary" />
        {!collapsed && (
          <span className="text-lg font-bold text-foreground">MedBrain</span>
        )}
      </div>

      {/* Navegação */}
      <div className="mt-4 flex-1">
        <SidebarNav collapsed={collapsed} />
      </div>

      {/* Barra de créditos */}
      <div className="border-t border-border px-4 py-4">
        {!collapsed ? (
          <CreditBar
            used={mockCredits.used}
            total={mockCredits.total}
            showLabel
          />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs font-medium text-muted-foreground">
              {mockCredits.used}/{mockCredits.total}
            </div>
          </div>
        )}
      </div>

      {/* Usuário */}
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-foreground">
                {mockUser.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                Plano {mockUser.plan === "free" ? "Gratuito" : "Pago"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Sidebar = ({ children }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!sidebarRef.current) return

    gsap.to(sidebarRef.current, {
      width: collapsed ? 72 : 256,
      duration: 0.3,
      ease: "power2.inOut",
    })
  }, { dependencies: [collapsed] })

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        ref={sidebarRef}
        className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-background md:flex"
      >
        <SidebarContent collapsed={collapsed} />

        {/* Botão de recolher */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed((prev) => !prev)}
          className="absolute -right-3 top-6 z-50 size-6 rounded-full border border-border bg-background shadow-sm"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <ChevronLeft
            className={cn(
              "size-3 transition-transform",
              collapsed && "rotate-180"
            )}
          />
        </Button>
      </aside>

      {/* Sidebar Mobile (Sheet) */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed left-4 top-3 z-50"
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <SidebarContent collapsed={false} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Conteúdo principal */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300 md:ml-64",
          collapsed && "md:ml-[72px]"
        )}
      >
        {children}
      </div>
    </>
  )
}
