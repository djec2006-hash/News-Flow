import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rss, ExternalLink } from "lucide-react"

export default async function AdminSourcesPage() {
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

  // Get all news sources
  const { data: sources } = await supabase.from("news_sources").select("*").order("category", { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader userEmail={user.email} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Sources d'actualité</h1>
          <p className="text-muted-foreground">Gérez les flux RSS et sources d'information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Flux RSS configurés</CardTitle>
            <CardDescription>
              {sources?.length || 0} source{sources && sources.length !== 1 ? "s" : ""} d'actualité active
              {sources && sources.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sources && sources.length > 0 ? (
                sources.map((source) => (
                  <div key={source.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10">
                      <Rss className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{source.name}</h3>
                        <Badge variant={source.is_active ? "default" : "secondary"}>
                          {source.is_active ? "Actif" : "Inactif"}
                        </Badge>
                        <Badge variant="outline">{source.category}</Badge>
                        <Badge variant="outline">{source.language.toUpperCase()}</Badge>
                      </div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {source.url}
                      </a>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Ajouté le {new Date(source.created_at).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Rss className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-semibold">Aucune source configurée</h3>
                  <p className="text-sm text-muted-foreground">Les sources d'actualité apparaîtront ici</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
