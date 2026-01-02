"use server"

import { createClient } from "@/lib/supabase/server"

export async function completeOnboarding() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: "Utilisateur non authentifié",
      }
    }

    const { error } = await supabase
      .from("profiles")
      .update({ has_seen_onboarding: true })
      .eq("id", user.id)

    if (error) {
      console.error("[completeOnboarding] Erreur:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
    }
  } catch (error: any) {
    console.error("[completeOnboarding] Erreur inattendue:", error)
    return {
      success: false,
      error: error.message || "Une erreur est survenue",
    }
  }
}



