"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Logo from "@/components/ui/logo"

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl mx-auto"
    >
      <motion.nav
        className="flex items-center justify-between rounded-full border border-white/10 bg-black/40 backdrop-blur-xl px-4 py-3 md:px-6"
        whileHover={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span className="text-lg font-semibold">NewsFlow</span>
        </Link>
        <nav className="hidden items-center gap-4 lg:gap-6 xl:gap-8 md:flex">
          <Link href="/features" className="text-sm lg:text-base font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap">
            Fonctionnalités
          </Link>
          <Link href="/how-it-works" className="text-sm lg:text-base font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap">
            Comment ça marche
          </Link>
          <Link href="/for-who" className="text-sm lg:text-base font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap">
            Pour qui ?
          </Link>
          <Link href="/pricing" className="text-sm lg:text-base font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap">
            Tarifs
          </Link>
          <Link href="/docs" className="text-sm lg:text-base font-medium text-zinc-400 hover:text-white transition-colors whitespace-nowrap">
            Documentation
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 bg-[length:200%_auto] animate-gradient-x hover:brightness-125 transition-all"
          >
            Se connecter
          </Link>
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 hover:shadow-lg hover:shadow-purple-500/50 transition-all rounded-full"
          >
            <Link href="/signup">Commencer</Link>
          </Button>
        </div>
      </motion.nav>
    </motion.header>
  )
}

