import type { SupabaseClient } from "@supabase/supabase-js"

type Database = any

/**
 * Vérifie si le profil de l'utilisateur contient les informations minimales
 * pour considérer l'onboarding comme terminé.
 */
export async function checkOnboardingStatus(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<{ completed: boolean }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle()

    if (error) {
      console.error("[v0] checkOnboardingStatus: erreur lors de la lecture du profil", error)
      return { completed: false }
    }

    const completed = Boolean(data?.full_name && data.full_name.trim().length > 0)
    return { completed }
  } catch (err) {
    console.error("[v0] checkOnboardingStatus: erreur inattendue", err)
    return { completed: false }
  }
}


