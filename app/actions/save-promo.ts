"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Codes valides avec leur configuration
const VALID_PROMO_CODES: Record<string, { plan: string; label: string; days: number }> = {
  PRO30: { plan: "pro", label: "Pro", days: 30 },
  BASIC15: { plan: "basic", label: "Basic", days: 15 },
  BASIC30: { plan: "basic", label: "Basic", days: 30 },
  pro30: { plan: "pro", label: "Pro", days: 30 }, // Version minuscule
  basic15: { plan: "basic", label: "Basic", days: 15 },
  basic30: { plan: "basic", label: "Basic", days: 30 },
}

export interface PromoCodeResult {
  success: boolean
  message: string
  error?: string
}

/**
 * Sauvegarde le code promo en cookie et redirige vers login
 * Le code sera appliqué automatiquement après connexion
 */
export async function savePromoCode(code: string): Promise<never> {
  try {
    const trimmedCode = code.trim()

    console.log("[Promo] Checking code:", trimmedCode)

    // Vérifier si le code est valide
    if (!VALID_PROMO_CODES[trimmedCode]) {
      console.log("[Promo] ❌ Invalid code")
      throw new Error("Code invalide ou expiré")
    }

    const promoConfig = VALID_PROMO_CODES[trimmedCode]
    console.log("[Promo] ✅ Valid code found:", promoConfig)

    // Sauvegarder le code en cookie sécurisé
    const cookieStore = await cookies()
    cookieStore.set("pending_promo_code", trimmedCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 heures
      path: "/",
    })

    console.log("[Promo] 🍪 Cookie set, redirecting to login...")

    // Rediriger vers la page de connexion
    // Le code sera automatiquement appliqué après connexion
  } catch (error) {
    console.error("[Promo] Error:", error)
    throw error
  }

  redirect("/login?promo=pending")
}

/**
 * Vérifie si un code promo est en attente
 */
export async function hasPendingPromoCode(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const pendingCode = cookieStore.get("pending_promo_code")
    return !!pendingCode?.value
  } catch {
    return false
  }
}



