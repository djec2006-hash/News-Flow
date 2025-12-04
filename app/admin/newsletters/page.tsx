import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, Calendar, User } from "lucide-react"

export default async function AdminNewslettersPage() {
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

  // Get all newsletters with user info
  const { data: newsletters } = await supabase
    .from("newsletters")
    .select(`
      *,
      profiles (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader userEmail={user.email} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Newsletters</h1>
          <p className="text-muted-foreground">Consultez toutes les newsletters générées</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Toutes les newsletters</CardTitle>
            <CardDescription>
              {newsletters?.length || 0} newsletter{newsletters && newsletters.length !== 1 ? "s" : ""} générée
              {newsletters && newsletters.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {newsletters && newsletters.length > 0 ? (
                newsletters.map((newsletter) => (
                  <div key={newsletter.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Newspaper className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{newsletter.title}</h3>
                        <Badge
                          variant={
                            newsletter.status === "sent"
                              ? "default"
                              : newsletter.status === "scheduled"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {newsletter.status === "sent"
                            ? "Envoyé"
                            : newsletter.status === "scheduled"
                              ? "Planifié"
                              : "Brouillon"}
                        </Badge>
                      </div>
                      {newsletter.summary && <p className="mt-1 text-sm text-muted-foreground">{newsletter.summary}</p>}
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {newsletter.profiles?.full_name || newsletter.profiles?.email || "Utilisateur inconnu"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(newsletter.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        {newsletter.sent_at && (
                          <span>Envoyé le {new Date(newsletter.sent_at).toLocaleDateString("fr-FR")}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Newspaper className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-semibold">Aucune newsletter</h3>
                  <p className="text-sm text-muted-foreground">Les newsletters générées apparaîtront ici</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
