import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Navbar from "@/components/layout/navbar"

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Bouton retour */}
        <Button
          asChild
          variant="ghost"
          className="text-zinc-400 hover:text-white mb-8"
        >
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>

        {/* Contenu */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="prose-headings:text-white prose-p:text-zinc-300 prose-p:leading-relaxed prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300 prose-strong:text-white prose-ul:text-zinc-300 prose-li:text-zinc-300">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}



