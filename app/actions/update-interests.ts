"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface UpdateInterestsResult {
  success: boolean
  message: string
  error?: string
}

/**
 * Met à jour les centres d'intérêt (general_domains) dans content_preferences
 */
export async function updateInterests(
  domains: string[]
): Promise<UpdateInterestsResult> {
  try {
    console.log("[Interests] 🎯 Updating interests with domains:", domains)

    const supabase = await createClient()

    // Vérifier l'authentification
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[Interests] ❌ User not authenticated")
      return {
        success: false,
        message: "Non authentifié",
        error: "UNAUTHENTICATED",
      }
    }

    console.log("[Interests] ✅ User authenticated:", user.id)

    // Validation des données
    if (!Array.isArray(domains)) {
      return {
        success: false,
        message: "Format de données invalide",
        error: "INVALID_FORMAT",
      }
    }

    // Dédupliquer les domaines
    const uniqueDomains = [...new Set(domains)]

    // Mettre à jour content_preferences avec upsert
    const { error: updateError } = await supabase
      .from("content_preferences")
      .upsert(
        {
          user_id: user.id,
          general_domains: uniqueDomains,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )

    if (updateError) {
      console.error("[Interests] ❌ Error updating:", updateError)
      return {
        success: false,
        message: "Erreur lors de la sauvegarde",
        error: "UPDATE_ERROR",
      }
    }

    console.log("[Interests] ✅ Interests saved successfully:", uniqueDomains)

    // Revalider les pages concernées
    revalidatePath("/dashboard/settings")
    revalidatePath("/onboarding")

    return {
      success: true,
      message: "Préférences sauvegardées avec succès",
    }
  } catch (error) {
    console.error("[Interests] Unexpected error:", error)
    return {
      success: false,
      message: "Une erreur est survenue",
      error: "SERVER_ERROR",
    }
  }
}

/**
 * Récupère les centres d'intérêt actuels
 */
export async function getInterests(): Promise<string[] | null> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from("content_preferences")
      .select("general_domains")
      .eq("user_id", user.id)
      .single()

    if (error || !data) {
      console.log("[Interests] No existing preferences found")
      return null
    }

    return data.general_domains ?? []
  } catch (error) {
    console.error("[Interests] Error fetching interests:", error)
    return null
  }
}











