"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Rocket,
  Search,
  Plug,
  FileText,
  Settings,
  Zap,
  ChevronRight,
} from "lucide-react"
import Navbar from "@/components/layout/navbar"

const navigation = [
  {
    name: "Introduction",
    icon: BookOpen,
    items: [
      { name: "Bienvenue", href: "/docs/intro" },
      { name: "Concepts de base", href: "/docs/concepts" },
      { name: "FAQ", href: "/docs/faq" },
    ],
  },
  {
    name: "Premiers pas",
    icon: Rocket,
    items: [
      { name: "Créer votre premier Flow", href: "/docs/create-flow" },
      { name: "Configurer vos alertes", href: "/docs/alerts" },
      { name: "Comprendre le score de pertinence", href: "/docs/score" },
    ],
  },
  {
    name: "Gérer les Sources",
    icon: Search,
    items: [
      { name: "Ajouter des sources", href: "/docs/sources" },
      { name: "Filtrer le contenu", href: "/docs/sources/filter" },
      { name: "Gérer vos projets", href: "/docs/sources/projects" },
    ],
  },
  {
    name: "Comprendre l'IA",
    icon: Zap,
    items: [
      { name: "Modes de recherche", href: "/docs/flows/modes" },
      { name: "Deep Search", href: "/docs/deep-search" },
      { name: "Personnalisation", href: "/docs/ai/personalization" },
    ],
  },
  {
    name: "Compte & Facturation",
    icon: Settings,
    items: [
      { name: "Paramètres du compte", href: "/docs/account" },
      { name: "Plans et limites", href: "/docs/account/plans" },
      { name: "Facturation", href: "/docs/account/billing" },
    ],
  },
]

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <div className="flex pt-24">
        {/* Sidebar fixe */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-zinc-900/50 h-[calc(100vh-6rem)] sticky top-24 overflow-y-auto">
          <div className="p-6">
            <Link href="/docs" className="flex items-center gap-2 mb-8">
              <BookOpen className="h-6 w-6 text-indigo-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Documentation
              </span>
            </Link>

            <nav className="space-y-8">
              {navigation.map((section) => {
                const Icon = section.icon
                return (
                  <div key={section.name}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-4 w-4 text-zinc-500" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        {section.name}
                      </h3>
                    </div>
                    <ul className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                "group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative",
                                isActive
                                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border-l-2 border-indigo-400"
                                  : "text-zinc-400 hover:text-white hover:bg-white/5"
                              )}
                            >
                              {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r" />
                              )}
                              <span>{item.name}</span>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

