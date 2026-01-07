import type { SupabaseClient } from "@supabase/supabase-js"

type Database = any

/**
 * Vérifie si le profil de l'utilisateur contient les informations minimales
 * pour considérer l'onboarding comme terminé.
 * 
 * IMPORTANT: En cas d'erreur (RLS, timeout), on retourne `completed: true`
 * pour éviter de bloquer les utilisateurs existants qui ont un profil valide
 * mais dont la requête a échoué temporairement.
 */
export async function checkOnboardingStatus(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<{ completed: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .maybeSingle()

    // Si erreur RLS, timeout, ou autre erreur de requête
    // On considère l'onboarding comme terminé pour ne pas bloquer les utilisateurs existants
    // Le profil existe probablement mais la requête a échoué (problème réseau, RLS, etc.)
    if (error) {
      console.error("[v0] checkOnboardingStatus: erreur lors de la lecture du profil", error)
      // Code PGRST116 = "no rows returned" - c'est OK, l'utilisateur n'a pas de profil
      if (error.code === "PGRST116") {
        return { completed: false, error: "NO_PROFILE" }
      }
      // Pour toute autre erreur (RLS, timeout, etc.), on assume que l'onboarding est terminé
      // pour éviter de bloquer les utilisateurs existants
      console.warn("[v0] checkOnboardingStatus: erreur non-PGRST116, assumption: onboarding terminé", error.code)
      return { completed: true, error: error.code }
    }

    // Vérifier si full_name existe et n'est pas vide
    const completed = Boolean(data?.full_name && data.full_name.trim().length > 0)
    return { completed }
  } catch (err) {
    console.error("[v0] checkOnboardingStatus: erreur inattendue", err)
    // En cas d'exception, on assume que l'onboarding est terminé
    // pour éviter de bloquer les utilisateurs existants
    return { completed: true, error: "EXCEPTION" }
  }
}


