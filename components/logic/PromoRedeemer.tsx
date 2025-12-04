"use client"

import { useEffect, useState } from "react"
import { redeemPendingPromo } from "@/app/actions/redeem-pending-promo"
import { useToast } from "@/hooks/use-toast"

/**
 * Composant invisible qui applique automatiquement un code promo en attente
 * après connexion de l'utilisateur
 * 
 * À intégrer dans le layout du dashboard
 */
export function PromoRedeemer() {
  const { toast } = useToast()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Exécuter une seule fois au montage
    if (checked) return

    const checkAndRedeemPromo = async () => {
      try {
        console.log("[PromoRedeemer] Checking for pending promo code...")
        
        const result = await redeemPendingPromo()

        if (result.success) {
          console.log("[PromoRedeemer] ✅ Promo code redeemed successfully")
          
          // Afficher un toast de succès magnifique
          toast({
            title: "🎉 Bienvenue dans le club !",
            description: result.message,
            duration: 8000,
          })

          // Recharger la page après un court délai pour mettre à jour l'UI
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else if (result.error === "NO_PENDING_CODE") {
          // Silencieux : pas de code en attente, c'est normal
          console.log("[PromoRedeemer] No pending promo code")
        } else if (result.error === "ALREADY_HAS_PLAN") {
          // L'utilisateur a déjà un plan actif
          toast({
            title: "ℹ️ Plan déjà actif",
            description: result.message,
            variant: "default",
          })
        } else {
          console.log("[PromoRedeemer] ❌ Failed to redeem:", result.error)
        }
      } catch (error) {
        console.error("[PromoRedeemer] Error:", error)
      } finally {
        setChecked(true)
      }
    }

    // Exécuter avec un léger délai pour laisser le dashboard se charger
    const timeout = setTimeout(checkAndRedeemPromo, 500)

    return () => clearTimeout(timeout)
  }, [checked, toast])

  // Composant invisible
  return null
}



