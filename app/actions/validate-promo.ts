"use server"

import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SK || "", {
  apiVersion: "2025-02-24.acacia" as any,
  typescript: true,
})

export interface PromoValidationResult {
  valid: boolean
  discount?: {
    percent_off?: number
    amount_off?: number
    currency?: string
  }
  couponId?: string
  error?: string
}

/**
 * Valide un code promo avec Stripe et retourne les informations de réduction
 */
export async function validatePromoCode(code: string): Promise<PromoValidationResult> {
  try {
    if (!code || !code.trim()) {
      return {
        valid: false,
        error: "Code promo requis",
      }
    }

    const trimmedCode = code.trim().toUpperCase()

    // Rechercher le coupon dans Stripe
    try {
      const coupons = await stripe.coupons.list({ limit: 100 })
      const coupon = coupons.data.find((c) => c.id === trimmedCode || c.name === trimmedCode)

      if (!coupon) {
        // Essayer aussi avec les promotion codes
        const promoCodes = await stripe.promotionCodes.list({ limit: 100, active: true })
        const promoCode = promoCodes.data.find(
          (pc) => pc.code === trimmedCode || pc.code?.toUpperCase() === trimmedCode
        )

        if (promoCode && promoCode.coupon) {
          return {
            valid: true,
            discount: {
              percent_off: promoCode.coupon.percent_off || undefined,
              amount_off: promoCode.coupon.amount_off || undefined,
              currency: promoCode.coupon.currency || undefined,
            },
            couponId: promoCode.coupon.id,
          }
        }

        return {
          valid: false,
          error: "Code promo invalide ou expiré",
        }
      }

      // Vérifier si le coupon est valide
      if (coupon.valid === false) {
        return {
          valid: false,
          error: "Code promo expiré",
        }
      }

      // Vérifier les dates de validité
      if (coupon.redeem_by && coupon.redeem_by < Math.floor(Date.now() / 1000)) {
        return {
          valid: false,
          error: "Code promo expiré",
        }
      }

      return {
        valid: true,
        discount: {
          percent_off: coupon.percent_off || undefined,
          amount_off: coupon.amount_off || undefined,
          currency: coupon.currency || undefined,
        },
        couponId: coupon.id,
      }
    } catch (stripeError: any) {
      console.error("[Promo] Erreur Stripe:", stripeError)
      return {
        valid: false,
        error: stripeError.message || "Erreur lors de la validation du code",
      }
    }
  } catch (error: any) {
    console.error("[Promo] Erreur validation:", error)
    return {
      valid: false,
      error: error.message || "Erreur lors de la validation",
    }
  }
}








