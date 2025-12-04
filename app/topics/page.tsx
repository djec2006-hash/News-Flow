import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddTopicDialog } from "@/components/add-topic-dialog"
import { Lightbulb } from "lucide-react"

export default async function TopicsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: topics } = await supabase
    .from("custom_topics")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sujets personnalisés</h1>
            <p className="text-muted-foreground">
              Créez des sujets spécifiques pour recevoir des actualités ultra-ciblées
            </p>
          </div>
          <AddTopicDialog />
        </div>

        {topics && topics.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {topics.map((topic) => (
              <Card key={topic.id} className={!topic.is_active ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-1">{topic.title}</CardTitle>
                      <CardDescription>{topic.domain}</CardDescription>
                    </div>
                    <Badge variant={topic.is_active ? "default" : "secondary"}>
                      {topic.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {topic.description && <p className="text-sm text-muted-foreground">{topic.description}</p>}
                  {topic.instructions && (
                    <div className="rounded-md bg-muted p-3">
                      <p className="text-sm">{topic.instructions}</p>
                    </div>
                  )}
                  {topic.priority && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Priorité:</span>
                      <Badge variant="outline" className="text-xs">
                        {topic.priority}
                      </Badge>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Créé le {new Date(topic.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-semibold mb-2">Aucun sujet personnalisé</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Créez votre premier sujet pour recevoir des actualités ultra-ciblées
              </p>
              <AddTopicDialog />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
