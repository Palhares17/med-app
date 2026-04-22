"use client"

import { useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { Brain, Sparkles } from "lucide-react"
import { useAuth } from "@/core/hooks/use-auth"
import { ROUTES, APP_NAME } from "@/core/constants"
import { GoogleLoginButton } from "./components/google-login-button"

export const LoginPage = () => {
  const router = useRouter()
  const { login, isLoading } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    const logo = containerRef.current.querySelector("[data-login-logo]")
    const tagline = containerRef.current.querySelector("[data-login-tagline]")
    const subtitle = containerRef.current.querySelector("[data-login-subtitle]")
    const button = containerRef.current.querySelector("[data-login-button]")

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

    tl.fromTo(
      logo,
      { opacity: 0, scale: 0.5, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8 }
    )
      .fromTo(
        tagline,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      )
      .fromTo(
        subtitle,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.2"
      )
      .fromTo(
        button,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.1"
      )

    // Animated grid background
    if (gridRef.current) {
      gsap.to(gridRef.current, {
        backgroundPosition: "40px 40px",
        duration: 20,
        repeat: -1,
        ease: "none",
      })
    }
  }, { scope: containerRef })

  const handleLogin = useCallback(async () => {
    await login()
    router.push(ROUTES.DASHBOARD)
  }, [login, router])

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 px-4"
    >
      {/* Animated background grid */}
      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gradient orbs */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
        <div className="size-[500px] rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0">
        <div className="size-[300px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Logo */}
        <div
          data-login-logo
          className="flex flex-col items-center gap-4"
          style={{ opacity: 0 }}
        >
          <div className="relative flex size-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
            <Brain className="size-10 text-primary" />
            <Sparkles className="absolute -right-2 -top-2 size-5 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {APP_NAME}
          </h1>
        </div>

        {/* Tagline */}
        <p
          data-login-tagline
          className="max-w-md text-xl font-medium text-gray-300 sm:text-2xl"
          style={{ opacity: 0 }}
        >
          Transforme seus PDFs em conhecimento ativo
        </p>

        {/* Subtitle */}
        <p
          data-login-subtitle
          className="max-w-sm text-base text-gray-500"
          style={{ opacity: 0 }}
        >
          Estude com flashcards e questoes geradas por IA
        </p>

        {/* Google Login Button */}
        <div data-login-button style={{ opacity: 0 }}>
          <GoogleLoginButton onLogin={handleLogin} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
