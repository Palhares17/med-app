import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "MedBrain — Estudo Ativo com IA",
  description:
    "Transforme seus PDFs em flashcards e questões objetivas com inteligência artificial.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: "oklch(0.20 0.02 265)",
              border: "1px solid oklch(0.28 0.02 265)",
              color: "oklch(0.96 0.01 265)",
            },
          }}
        />
      </body>
    </html>
  )
}
