"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Newspaper, History, Settings, LogOut, FolderKanban, Radio, Mail, Activity, HelpCircle, Mic } from "lucide-react"
import Logo from "@/components/ui/logo"

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const navItems = [
    { href: "/dashboard", label: "Mon flux", icon: Newspaper },
    { href: "/dashboard/projects", label: "Gestion de projets", icon: FolderKanban },
    { href: "/dashboard/live-feed", label: "Live Feed", icon: Activity },
    { href: "/dashboard/email-config", label: "Emails & Alertes", icon: Mail },
    { href: "/dashboard/history", label: "Historique", icon: History },
    { href: "/dashboard/podcast", label: "Live Podcast", icon: Mic },
    { href: "/dashboard/help", label: "Aide & Tutos", icon: HelpCircle },
    { href: "/dashboard/settings", label: "Profil", icon: Settings },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r border-white/5 bg-zinc-950">
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-6">
        <Logo className="h-7 w-7" />
        <span className="text-xl font-bold text-white">NewsFlow</span>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          // Dégradé des couleurs : Violet → Fuchsia → Rose (intense)
          const iconColors = [
            "text-violet-400",  // Item 1 (Haut)
            "text-purple-400",  // Item 2
            "text-fuchsia-400", // Item 3 (Milieu)
            "text-fuchsia-500", // Item 4
            "text-pink-400",    // Item 5 (Bas)
            "text-pink-500",    // Item 6
            "text-pink-500",    // Item 7
            "text-pink-400",    // Item 8
          ]
          const iconColor = iconColors[index] || "text-zinc-400"
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-white/5 border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.1)] backdrop-blur-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
              <span className={isActive ? "text-white" : ""}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-border p-4" suppressHydrationWarning={true}>
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-3 h-5 w-5" />
          Se déconnecter
        </Button>
      </div>
    </div>
  )
}
