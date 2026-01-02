"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

interface GuideLayoutProps {
  title: string
  children: React.ReactNode
}

export default function GuideLayout({ title, children }: GuideLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Bouton retour */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            asChild
            variant="ghost"
            className="text-zinc-400 hover:text-white mb-4"
          >
            <Link href="/dashboard/help">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'aide
            </Link>
          </Button>
        </motion.div>

        {/* Titre */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          {title}
        </motion.h1>

        {/* Contenu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none space-y-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}



