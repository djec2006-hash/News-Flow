import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Calendar } from "lucide-react"

export default async function AdminUsersPage() {
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

  // Get all users with their preferences
  const { data: users } = await supabase
    .from("profiles")
    .select(`
      *,
      user_preferences (
        categories,
        frequency,
        onboarding_completed
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader userEmail={user.email} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Utilisateurs</h1>
          <p className="text-muted-foreground">Gérez et visualisez tous les utilisateurs de la plateforme</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>
              {users?.length || 0} utilisateur{users && users.length !== 1 ? "s" : ""} inscrit
              {users && users.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users && users.length > 0 ? (
                users.map((u) => (
                  <div key={u.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{u.full_name || "Sans nom"}</h3>
                        <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                          {u.role === "admin" ? "Admin" : "Utilisateur"}
                        </Badge>
                        {u.user_preferences?.[0]?.onboarding_completed && (
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            Actif
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {u.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Inscrit le {new Date(u.created_at).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                      {u.user_preferences?.[0]?.categories && u.user_preferences[0].categories.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {u.user_preferences[0].categories.slice(0, 3).map((cat) => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                          {u.user_preferences[0].categories.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{u.user_preferences[0].categories.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <User className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-semibold">Aucun utilisateur</h3>
                  <p className="text-sm text-muted-foreground">Les utilisateurs inscrits apparaîtront ici</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
