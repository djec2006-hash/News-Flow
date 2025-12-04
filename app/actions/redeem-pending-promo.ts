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
  try {
    const cookieStore = await cookies()
    const pendingCode = cookieStore.get("pending_promo_code")

    // Pas de code en attente
    if (!pendingCode?.value) {
      return {
        success: false,
        message: "Aucun code en attente",
        error: "NO_PENDING_CODE",
      }
    }

    console.log("[Promo] 🎁 Pending promo code found:", pendingCode.value)

    // Vérifier l'authentification
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[Promo] ❌ User not authenticated")
      return {
        success: false,
        message: "Non authentifié",
        error: "UNAUTHENTICATED",
      }
    }

    // Vérifier si le code est valide
    const promoConfig = VALID_PROMO_CODES[pendingCode.value]
    if (!promoConfig) {
      console.log("[Promo] ❌ Invalid code")
      // Supprimer le cookie invalide
      cookieStore.delete("pending_promo_code")
      return {
        success: false,
        message: "Code invalide",
        error: "INVALID_CODE",
      }
    }

    // Vérifier si l'utilisateur a déjà un plan actif non expiré
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("plan_type, plan_expires_at")
      .eq("id", user.id)
      .single()

    // Si l'utilisateur a déjà un plan payant non expiré
    if (currentProfile?.plan_type !== "free" && currentProfile?.plan_expires_at) {
      const expirationDate = new Date(currentProfile.plan_expires_at)
      if (expirationDate > new Date()) {
        console.log("[Promo] ⚠️ User already has an active plan")
        cookieStore.delete("pending_promo_code")
        return {
          success: false,
          message: `Vous avez déjà un plan ${currentProfile.plan_type} actif jusqu'au ${expirationDate.toLocaleDateString("fr-FR")}.`,
          error: "ALREADY_HAS_PLAN",
        }
      }
    }

    // Calculer la date d'expiration
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(expiresAt.getDate() + promoConfig.days)

    console.log(`[Promo] 🚀 Activating ${promoConfig.label} plan for ${promoConfig.days} days`)
    console.log(`[Promo] 📅 Expires at: ${expiresAt.toISOString()}`)

    // Mettre à jour le profil utilisateur
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        plan_type: promoConfig.plan,
        plan_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("[Promo] ❌ Error updating profile:", updateError)
      return {
        success: false,
        message: "Erreur lors de l'activation du code",
        error: "UPDATE_ERROR",
      }
    }

    // Logger l'utilisation du code promo
    await supabase.from("code_redemptions").insert({
      user_id: user.id,
      code: pendingCode.value,
      plan_activated: promoConfig.plan,
      expires_at: expiresAt.toISOString(),
      redeemed_at: new Date().toISOString(),
    })

    // Supprimer le cookie maintenant qu'il est appliqué
    cookieStore.delete("pending_promo_code")

    console.log(`[Promo] ✅ Successfully activated ${promoConfig.label} plan for user ${user.id}`)

    return {
      success: true,
      message: `Code activé ! Vous profitez du plan ${promoConfig.label} pendant ${promoConfig.days} jours.`,
      planType: promoConfig.plan,
      planLabel: promoConfig.label,
      expiresAt: expiresAt.toISOString(),
    }
  } catch (error) {
    console.error("[Promo] Unexpected error:", error)
    return {
      success: false,
      message: "Une erreur est survenue",
      error: "SERVER_ERROR",
    }
  }
}



