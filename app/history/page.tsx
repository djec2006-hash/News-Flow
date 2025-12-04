import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Newspaper } from "lucide-react"

export default async function HistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: recaps } = await supabase
    .from("recaps")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Historique des Flows</h1>
          <p className="text-muted-foreground">Retrouvez tous vos Flows d&apos;actualité précédents</p>
        </div>

        {recaps && recaps.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-4">
            {recaps.map((recap: any) => (
              <AccordionItem
                key={recap.id}
                value={recap.id.toString()}
                className="border rounded-lg bg-card/40 backdrop-blur"
              >
                <Card className="border-0 shadow-none">
                  <AccordionTrigger className="hover:no-underline px-6 pt-6">
                    <CardHeader className="p-0 w-full">
                      <div className="flex items-start justify-between gap-4 text-left">
                        <div className="flex-1">
                          <CardTitle className="mb-2">
                            {recap.summary || "Flow du " + new Date(recap.created_at).toLocaleDateString("fr-FR")}
                          </CardTitle>
                          <CardDescription>
                            {new Date(recap.created_at).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant={recap.type === "daily" ? "default" : "secondary"} className="capitalize">
                            {recap.type}
                          </Badge>
                          {recap.email_sent && (
                            <Badge variant="outline" className="text-xs">
                              Email envoyé
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </AccordionTrigger>

                  <AccordionContent>
                    <CardContent className="space-y-6 pt-4 pb-6 px-6">
                      {recap.body && (
                        <section>
                          <h4 className="font-semibold mb-3 text-base">Contenu du Flow</h4>
                          <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                            {recap.body}
                          </div>
                        </section>
                      )}

                      {recap.key_events && (
                        <section>
                          <h4 className="font-semibold mb-2 text-sm">Événements clés</h4>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                            {recap.key_events}
                          </p>
                        </section>
                      )}

                      {recap.topics_covered && (
                        <section>
                          <h4 className="font-semibold mb-2 text-sm">Sujets couverts</h4>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                            {recap.topics_covered}
                          </p>
                        </section>
                      )}

                      {recap.channels && Array.isArray(recap.channels) && recap.channels.length > 0 && (
                        <section>
                          <h4 className="font-semibold mb-2 text-sm">Canaux</h4>
                          <div className="flex flex-wrap gap-2">
                            {recap.channels.map((channel: string, idx: number) => (
                              <Badge key={idx} variant="outline">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </section>
                      )}

                      <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span>Niveau : {recap.complexity_level || "standard"}</span>
                        <span>ID Flow : {recap.id}</span>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Newspaper className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-semibold mb-2">Aucun Flow dans l&apos;historique</h3>
              <p className="text-sm text-muted-foreground text-center">
                Vos Flows apparaîtront ici une fois qu&apos;ils auront été générés.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
