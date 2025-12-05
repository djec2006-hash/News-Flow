"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

// Codes valides avec leur configuration
const VALID_PROMO_CODES: Record<string, { plan: string; label: string; days: number }> = {
  PRO30: { plan: "pro", label: "Pro", days: 30 },
  BASIC15: { plan: "basic", label: "Basic", days: 15 },
  BASIC30: { plan: "basic", label: "Basic", days: 30 },
  pro30: { plan: "pro", label: "Pro", days: 30 },
  basic15: { plan: "basic", label: "Basic", days: 15 },
  basic30: { plan: "basic", label: "Basic", days: 30 },
}

export interface RedeemResult {
  success: boolean
  message: string
  planType?: string
  planLabel?: string
  expiresAt?: string
  error?: string
}

/**
 * Applique automatiquement un code promo en attente après connexion
 * Appelé automatiquement par le composant PromoRedeemer
 */
export async function redeemPendingPromo(): Promise<RedeemResult> {
  console.log("============================================")
  console.log("[Promo] 🎁 REDEEM PENDING PROMO - START")
  console.log("============================================")

  try {
    // 1. Récupérer le cookie
    const cookieStore = await cookies()
    const pendingCode = cookieStore.get("pending_promo_code")

    console.log("[Promo] 🍪 Checking for pending_promo_code cookie...")
    console.log("[Promo] Cookie value:", pendingCode?.value || "NOT FOUND")

    // Pas de code en attente
    if (!pendingCode?.value) {
      console.log("[Promo] ℹ️ No pending promo code found")
      return {
        success: false,
        message: "Aucun code en attente",
        error: "NO_PENDING_CODE",
      }
    }

    const code = pendingCode.value
    console.log("[Promo] 🎁 Pending promo code found:", code)

    // 2. Vérifier l'authentification
    console.log("[Promo] 🔐 Checking authentication...")
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.log("[Promo] ❌ Auth error:", authError.message)
      return {
        success: false,
        message: "Erreur d'authentification",
        error: "AUTH_ERROR",
      }
    }

    if (!user) {
      console.log("[Promo] ❌ User not authenticated")
      return {
        success: false,
        message: "Non authentifié",
        error: "UNAUTHENTICATED",
      }
    }

    console.log("[Promo] ✅ User authenticated:", user.id)
    console.log("[Promo] User email:", user.email)

    // 3. Vérifier si le code est valide
    const promoConfig = VALID_PROMO_CODES[code]
    if (!promoConfig) {
      console.log("[Promo] ❌ Invalid code:", code)
      // Supprimer le cookie invalide
      cookieStore.delete("pending_promo_code")
      return {
        success: false,
        message: "Code invalide",
        error: "INVALID_CODE",
      }
    }

    console.log("[Promo] ✅ Valid promo config:", promoConfig)

    // 4. Vérifier si l'utilisateur a déjà un plan actif non expiré
    console.log("[Promo] 🔍 Checking current user plan...")
    const { data: currentProfile, error: profileError } = await supabase
      .from("profiles")
      .select("plan_type, plan_expires_at")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.log("[Promo] ⚠️ No profile found, will create one")
    } else {
      console.log("[Promo] Current profile:", currentProfile)
    }

    // Si l'utilisateur a déjà un plan payant non expiré
    if (currentProfile?.plan_type && currentProfile.plan_type !== "free" && currentProfile?.plan_expires_at) {
      const expirationDate = new Date(currentProfile.plan_expires_at)
      if (expirationDate > new Date()) {
        console.log("[Promo] ⚠️ User already has an active plan until:", expirationDate)
        cookieStore.delete("pending_promo_code")
        return {
          success: false,
          message: `Vous avez déjà un plan ${currentProfile.plan_type} actif jusqu'au ${expirationDate.toLocaleDateString("fr-FR")}.`,
          error: "ALREADY_HAS_PLAN",
        }
      }
    }

    // 5. Calculer la date d'expiration
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(expiresAt.getDate() + promoConfig.days)

    console.log("[Promo] 📅 Plan expiration date:", expiresAt.toISOString())

    // 6. Mettre à jour le profil utilisateur
    console.log("[Promo] 🚀 Updating profile with new plan...")
    const { error: updateError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          plan_type: promoConfig.plan,
          plan_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )

    if (updateError) {
      console.error("[Promo] ❌ Error updating profile:", updateError)
      return {
        success: false,
        message: "Erreur lors de l'activation du code",
        error: "UPDATE_ERROR",
      }
    }

    console.log("[Promo] ✅ Profile updated successfully!")

    // 7. Logger l'utilisation du code promo (optionnel, ignore les erreurs)
    console.log("[Promo] 📝 Logging code redemption...")
    try {
      const { error: logError } = await supabase.from("code_redemptions").insert({
        user_id: user.id,
        code: code,
        plan_activated: promoConfig.plan,
        expires_at: expiresAt.toISOString(),
        redeemed_at: new Date().toISOString(),
      })
      
      if (logError) {
        // Ne pas faire échouer l'opération si le logging échoue
        console.log("[Promo] ⚠️ Could not log redemption (table may not exist):", logError.message)
      } else {
        console.log("[Promo] ✅ Redemption logged")
      }
    } catch (logErr) {
      console.log("[Promo] ⚠️ Redemption logging skipped:", logErr)
    }

    // 8. Supprimer le cookie
    console.log("[Promo] 🗑️ Deleting pending_promo_code cookie...")
    cookieStore.delete("pending_promo_code")

    console.log("============================================")
    console.log("[Promo] ✅ SUCCESS!")
    console.log(`[Promo] Plan ${promoConfig.label} activated for ${promoConfig.days} days`)
    console.log("[Promo] User:", user.id)
    console.log("[Promo] Expires:", expiresAt.toISOString())
    console.log("============================================")

    return {
      success: true,
      message: `Code activé ! Vous profitez du plan ${promoConfig.label} pendant ${promoConfig.days} jours.`,
      planType: promoConfig.plan,
      planLabel: promoConfig.label,
      expiresAt: expiresAt.toISOString(),
    }
  } catch (error) {
    console.error("============================================")
    console.error("[Promo] ❌ UNEXPECTED ERROR:")
    console.error(error)
    console.error("============================================")
    return {
      success: false,
      message: "Une erreur est survenue",
      error: "SERVER_ERROR",
    }
  }
}
