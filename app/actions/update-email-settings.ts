"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface EmailSettings {
  is_enabled: boolean
  delivery_days: string[]
  delivery_time: string
  recipients: string[]
  email_frequency?: "INSTANT" | "DAILY" | "WEEKLY"
  alert_keywords?: string
}

export interface UpdateEmailSettingsResult {
  success: boolean
  message: string
  error?: string
}

/**
 * Met à jour les paramètres d'email dans email_settings
 */
export async function updateEmailSettings(
  settings: EmailSettings
): Promise<UpdateEmailSettingsResult> {
  try {
    console.log("[EmailSettings] Starting update with:", settings)

    const supabase = await createClient()

    // Vérifier l'authentification
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[EmailSettings] ❌ User not authenticated")
      return {
        success: false,
        message: "Non authentifié",
        error: "UNAUTHENTICATED",
      }
    }

    console.log("[EmailSettings] User authenticated:", user.id)

    // Validation des données
    if (settings.is_enabled && settings.recipients.length === 0) {
      return {
        success: false,
        message: "Veuillez ajouter au moins une adresse email",
        error: "NO_RECIPIENTS",
      }
    }

    if (settings.recipients.length > 3) {
      return {
        success: false,
        message: "Maximum 3 adresses email autorisées",
        error: "TOO_MANY_RECIPIENTS",
      }
    }

    // Validation des emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    for (const email of settings.recipients) {
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: `Email invalide: ${email}`,
          error: "INVALID_EMAIL",
        }
      }
    }

    // Validation de l'heure (format HH:MM)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
    if (!timeRegex.test(settings.delivery_time)) {
      return {
        success: false,
        message: "Format d'heure invalide (attendu: HH:MM)",
        error: "INVALID_TIME",
      }
    }

    // Mettre à jour email_settings avec upsert
    const { error: updateError } = await supabase
      .from("email_settings")
      .upsert(
        {
          user_id: user.id,
          is_enabled: settings.is_enabled,
          delivery_days: settings.delivery_days,
          delivery_time: settings.delivery_time,
          recipients: settings.recipients,
          email_frequency: settings.email_frequency || "DAILY",
          alert_keywords: settings.alert_keywords || null,
        },
        { onConflict: "user_id" }
      )

    if (updateError) {
      console.error("[EmailSettings] ❌ Error updating:", updateError)
      return {
        success: false,
        message: "Erreur lors de la sauvegarde",
        error: "UPDATE_ERROR",
      }
    }

    console.log("[EmailSettings] ✅ Settings saved successfully")

    // Revalider la page pour forcer le rechargement des données
    revalidatePath("/dashboard/email-config")

    return {
      success: true,
      message: "Préférences d'email enregistrées avec succès",
    }
  } catch (error) {
    console.error("[EmailSettings] Unexpected error:", error)
    return {
      success: false,
      message: "Une erreur est survenue",
      error: "SERVER_ERROR",
    }
  }
}

/**
 * Récupère les paramètres d'email actuels depuis email_settings
 */
export async function getEmailSettings(): Promise<EmailSettings | null> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from("email_settings")
      .select("is_enabled, delivery_days, delivery_time, recipients, email_frequency, alert_keywords")
      .eq("user_id", user.id)
      .single()

    if (error) {
      // PGRST116 = no rows returned (pas de settings existants)
      if (error.code === "PGRST116") {
        console.log("[EmailSettings] No existing settings found, returning defaults")
        return null
      }
      console.error("[EmailSettings] Error fetching:", error)
      return null
    }

    if (!data) {
      return null
    }

    return {
      is_enabled: data.is_enabled ?? false,
      delivery_days: data.delivery_days ?? [],
      delivery_time: data.delivery_time ?? "08:00",
      recipients: data.recipients ?? [],
      email_frequency: (data.email_frequency as "INSTANT" | "DAILY" | "WEEKLY") || "DAILY",
      alert_keywords: data.alert_keywords || undefined,
    }
  } catch (error) {
    console.error("[EmailSettings] Error fetching settings:", error)
    return null
  }
}




