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
  const trimmedCode = code.trim()

  console.log("============================================")
  console.log("[Promo] 🔍 SAVE PROMO CODE - START")
  console.log("[Promo] Code reçu:", trimmedCode)
  console.log("============================================")

  // Vérifier si le code est valide
  if (!VALID_PROMO_CODES[trimmedCode]) {
    console.log("[Promo] ❌ Code invalide ou non trouvé dans la liste")
    console.log("[Promo] Codes valides:", Object.keys(VALID_PROMO_CODES))
    throw new Error("Code invalide ou expiré")
  }

  const promoConfig = VALID_PROMO_CODES[trimmedCode]
  console.log("[Promo] ✅ Code valide trouvé:", promoConfig)

  try {
    // Sauvegarder le code en cookie sécurisé
    const cookieStore = await cookies()
    
    // Configuration du cookie optimisée pour la persistance
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24, // 24 heures
      path: "/",
    }

    console.log("[Promo] 🍪 Setting cookie with options:", cookieOptions)
    
    cookieStore.set("pending_promo_code", trimmedCode, cookieOptions)

    // Vérifier que le cookie a bien été défini
    const verifySet = cookieStore.get("pending_promo_code")
    console.log("[Promo] 🍪 Cookie verification after set:", verifySet?.value || "NOT FOUND")

    console.log("[Promo] ✅ Cookie défini avec succès")
    console.log("[Promo] 🔄 Redirection vers /login?promo=pending")
    console.log("============================================")
  } catch (cookieError) {
    console.error("[Promo] ❌ Erreur lors de la définition du cookie:", cookieError)
    throw new Error("Erreur lors de la sauvegarde du code")
  }

  // Rediriger vers la page de connexion
  // Le code sera automatiquement appliqué après connexion
  redirect("/login?promo=pending")
}

/**
 * Vérifie si un code promo est en attente
 */
export async function hasPendingPromoCode(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const pendingCode = cookieStore.get("pending_promo_code")
    
    console.log("[Promo] 🔍 Checking pending promo code:", pendingCode?.value || "NONE")
    
    return !!pendingCode?.value
  } catch (error) {
    console.error("[Promo] Error checking pending code:", error)
    return false
  }
}

/**
 * Récupère le code promo en attente (pour debug)
 */
export async function getPendingPromoCode(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const pendingCode = cookieStore.get("pending_promo_code")
    return pendingCode?.value || null
  } catch {
    return null
  }
}
