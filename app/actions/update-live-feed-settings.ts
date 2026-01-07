"use server"

import { createClient } from "@/lib/supabase/server"

interface LiveFeedSettingsInput {
  mode: "auto" | "custom"
  refresh_rate: number
  auto_refresh: boolean
  custom_domains: string[]
  custom_instructions?: string
}

interface ActionResult {
  success: boolean
  message: string
  data?: any
}

/**
 * Met à jour les paramètres du Live Feed pour l'utilisateur connecté
 */
export async function updateLiveFeedSettings(settings: LiveFeedSettingsInput): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        message: "Non authentifié",
      }
    }

    const settingsToSave = {
      user_id: user.id,
      mode: settings.mode,
      refresh_rate: settings.refresh_rate,
      auto_refresh: settings.auto_refresh,
      custom_domains: settings.custom_domains,
      custom_instructions: settings.custom_instructions || null,
    }

    const { error } = await supabase.from("live_feed_settings").upsert(settingsToSave, {
      onConflict: "user_id",
    })

    if (error) {
      console.error("[LiveFeedSettings] Update error:", error)
      return {
        success: false,
        message: `Erreur de sauvegarde : ${error.message}`,
      }
    }

    return {
      success: true,
      message: "Préférences sauvegardées avec succès",
    }
  } catch (error) {
    console.error("[LiveFeedSettings] Unexpected error:", error)
    return {
      success: false,
      message: "Une erreur inattendue s'est produite",
    }
  }
}

/**
 * Récupère les paramètres du Live Feed pour l'utilisateur connecté
 */
export async function getLiveFeedSettings(): Promise<any> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data, error } = await supabase
      .from("live_feed_settings")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("[LiveFeedSettings] Fetch error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("[LiveFeedSettings] Unexpected error:", error)
    return null
  }
}
