"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

interface RedeemResult {
  success: boolean
  message: string
  planType?: string
}

export async function redeemCode(code: string): Promise<RedeemResult> {
  try {
    const supabase = await createClient()

    // 1. Vérifier l'authentification
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        message: "Vous devez être connecté pour activer un code d'accès.",
      }
    }

    // 2. Normaliser le code (supprimer espaces et mettre en minuscules)
    const normalizedCode = code.trim().toLowerCase()

    // 3. Définir les codes valides
    const validCodes: Record<string, { plan: string; label: string }> = {
      basic15: { plan: "basic", label: "Basic" },
      pro15: { plan: "pro", label: "Pro" },
    }

    // 4. Vérifier si le code est valide
    if (!validCodes[normalizedCode]) {
      return {
        success: false,
        message: "Code invalide ou expiré. Vérifiez votre saisie et réessayez.",
      }
    }

    const { plan, label } = validCodes[normalizedCode]

    // 5. Vérifier si l'utilisateur a déjà un plan payant
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("plan_type")
      .eq("id", user.id)
      .single()

    if (currentProfile?.plan_type === "basic" || currentProfile?.plan_type === "pro") {
      return {
        success: false,
        message: `Vous avez déjà un plan actif (${currentProfile.plan_type}). Les codes ne peuvent être utilisés que par les utilisateurs Free.`,
      }
    }

    // 6. Mettre à jour le plan utilisateur
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        plan_type: plan,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("[Redeem] Error updating profile:", updateError)
      return {
        success: false,
        message: "Une erreur est survenue lors de l'activation. Veuillez réessayer.",
      }
    }

    // 7. Logger l'utilisation du code (optionnel - pour tracking)
    await supabase.from("code_redemptions").insert({
      user_id: user.id,
      code: normalizedCode,
      plan_activated: plan,
      redeemed_at: new Date().toISOString(),
    })

    console.log(`[Redeem] ✅ User ${user.id} activated ${label} plan with code: ${normalizedCode}`)

    return {
      success: true,
      message: `Félicitations ! Vous avez activé le plan ${label} 🎉`,
      planType: label,
    }
  } catch (error) {
    console.error("[Redeem] Unexpected error:", error)
    return {
      success: false,
      message: "Une erreur inattendue est survenue. Veuillez contacter le support.",
    }
  }
}







