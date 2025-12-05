"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface EmailSettings {
  email_active: boolean
  email_days: number[]
  email_time: string
  email_recipients: string[]
}

export interface UpdateEmailSettingsResult {
  success: boolean
  message: string
  error?: string
}

/**
 * Met à jour les paramètres d'email dans content_preferences
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
    if (settings.email_active && settings.email_recipients.length === 0) {
      return {
        success: false,
        message: "Veuillez ajouter au moins une adresse email",
        error: "NO_RECIPIENTS",
      }
    }

    if (settings.email_recipients.length > 3) {
      return {
        success: false,
        message: "Maximum 3 adresses email autorisées",
        error: "TOO_MANY_RECIPIENTS",
      }
    }

    // Validation des emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    for (const email of settings.email_recipients) {
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: `Email invalide: ${email}`,
          error: "INVALID_EMAIL",
        }
      }
    }

    // Mettre à jour content_preferences avec upsert
    const { error: updateError } = await supabase
      .from("content_preferences")
      .upsert(
        {
          user_id: user.id,
          email_active: settings.email_active,
          email_days: settings.email_days,
          email_time: settings.email_time,
          email_recipients: settings.email_recipients,
          updated_at: new Date().toISOString(),
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
 * Récupère les paramètres d'email actuels
 */
export async function getEmailSettings(): Promise<EmailSettings | null> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from("content_preferences")
      .select("email_active, email_days, email_time, email_recipients")
      .eq("user_id", user.id)
      .single()

    if (error || !data) {
      console.log("[EmailSettings] No existing settings found")
      return null
    }

    return {
      email_active: data.email_active ?? false,
      email_days: data.email_days ?? [1, 2, 3, 4, 5],
      email_time: data.email_time ?? "08:00",
      email_recipients: data.email_recipients ?? [],
    }
  } catch (error) {
    console.error("[EmailSettings] Error fetching settings:", error)
    return null
  }
}

