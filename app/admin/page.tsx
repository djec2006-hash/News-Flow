import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Newspaper, Rss, TrendingUp } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Get stats
  const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: newslettersCount } = await supabase.from("newsletters").select("*", { count: "exact", head: true })

  const { count: sourcesCount } = await supabase.from("news_sources").select("*", { count: "exact", head: true })

  const { count: activeUsersCount } = await supabase
    .from("user_preferences")
    .select("*", { count: "exact", head: true })
    .eq("onboarding_completed", true)

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader userEmail={user.email} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Tableau de bord Admin</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme NewsFlow</p>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount || 0}</div>
              <p className="text-xs text-muted-foreground">{activeUsersCount || 0} actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Newsletters envoyées</CardTitle>
              <Newspaper className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newslettersCount || 0}</div>
              <p className="text-xs text-muted-foreground">Au total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sources d'actualité</CardTitle>
              <Rss className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sourcesCount || 0}</div>
              <p className="text-xs text-muted-foreground">Flux RSS configurés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux d'activation</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usersCount && usersCount > 0 ? Math.round(((activeUsersCount || 0) / usersCount) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Utilisateurs ayant terminé l'onboarding</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent activity placeholder */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Les fonctionnalités d'activité détaillées seront disponibles prochainement.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
