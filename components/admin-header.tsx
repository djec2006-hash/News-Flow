"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Newspaper, User, LayoutDashboard, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AdminHeaderProps {
  userEmail?: string
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">NewsFlow Admin</span>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Vue d'ensemble
            </Link>
            <Link href="/admin/users" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Utilisateurs
            </Link>
            <Link
              href="/admin/sources"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sources
            </Link>
            <Link
              href="/admin/newsletters"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Newsletters
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Mon dashboard
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
