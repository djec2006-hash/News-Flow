import type React from "react"
import type { Metadata } from "next"
import "./globals.css" // <--- CETTE LIGNE EST VITALE
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NewsFlow - Actualités personnalisées par IA",
  description:
    "Recevez chaque jour un résumé intelligent des actualités qui vous intéressent vraiment. Alimenté par l'IA.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
