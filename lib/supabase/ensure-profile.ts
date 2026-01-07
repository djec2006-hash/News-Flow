import type { SupabaseClient } from "@supabase/supabase-js"

type Database = any

/**
 * Fonction utilitaire pour s'assurer qu'un profil existe pour un utilisateur.
 * Crée le profil s'il n'existe pas (lazy creation).
 * 
 * @param supabase - Client Supabase authentifié
 * @param userId - ID de l'utilisateur
 * @param userEmail - Email de l'utilisateur (optionnel, récupéré depuis auth.users si non fourni)
 * @returns { success: boolean, created: boolean, error?: string }
 */
export async function ensureProfileExists(
  supabase: SupabaseClient<Database>,
  userId: string,
  userEmail?: string
): Promise<{ success: boolean; created: boolean; error?: string }> {
  try {
    // 1. Vérifier si le profil existe déjà
    const { data: existingProfile, error: selectError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    // Si erreur autre que "no rows", c'est un vrai problème
    if (selectError && selectError.code !== "PGRST116") {
      console.error("[ensureProfile] Erreur lors de la vérification du profil:", selectError)
      return { success: false, created: false, error: selectError.code }
    }

    // Si le profil existe déjà, on retourne success
    if (existingProfile) {
      return { success: true, created: false }
    }

    // 2. Récupérer l'email si non fourni
    let email = userEmail
    if (!email) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) {
        return { success: false, created: false, error: "USER_NOT_FOUND" }
      }
      email = user.email || undefined
    }

    // 3. Créer le profil manquant
    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email: email || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      // Si erreur de conflit (profil créé entre temps), c'est OK
      if (insertError.code === "23505") {
        console.log("[ensureProfile] Profil créé entre temps, OK")
        return { success: true, created: false }
      }
      console.error("[ensureProfile] Erreur lors de la création du profil:", insertError)
      return { success: false, created: false, error: insertError.code }
    }

    console.log("[ensureProfile] Profil créé avec succès pour l'utilisateur:", userId)
    return { success: true, created: true }
  } catch (err) {
    console.error("[ensureProfile] Erreur inattendue:", err)
    return { success: false, created: false, error: "EXCEPTION" }
  }
}



