import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsForm } from "@/components/settings-form"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: preferences } = await supabase.from("content_preferences").select("*").eq("user_id", user.id).single()

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Paramètres</h1>
          <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences</p>
        </div>

        <SettingsForm profile={profile} preferences={preferences} userId={user.id} />
      </div>
    </DashboardLayout>
  )
}
