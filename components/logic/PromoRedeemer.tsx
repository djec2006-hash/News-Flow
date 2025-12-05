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
        console.log("============================================")
        console.log("[PromoRedeemer] 🚀 Component mounted, checking for pending promo...")
        console.log("[PromoRedeemer] URL:", window.location.href)
        console.log("[PromoRedeemer] Timestamp:", new Date().toISOString())
        console.log("============================================")
        
        const result = await redeemPendingPromo()

        console.log("[PromoRedeemer] Result received:", result)

        if (result.success) {
          console.log("[PromoRedeemer] ✅ Promo code redeemed successfully!")
          console.log("[PromoRedeemer] Plan:", result.planLabel)
          console.log("[PromoRedeemer] Expires:", result.expiresAt)
          
          // Afficher un toast de succès magnifique
          toast({
            title: "🎉 Bienvenue dans le club !",
            description: result.message,
            duration: 8000,
          })

          // Recharger la page après un court délai pour mettre à jour l'UI
          console.log("[PromoRedeemer] Reloading page in 2 seconds...")
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else if (result.error === "NO_PENDING_CODE") {
          // Silencieux : pas de code en attente, c'est normal
          console.log("[PromoRedeemer] ℹ️ No pending promo code - this is normal")
        } else if (result.error === "ALREADY_HAS_PLAN") {
          // L'utilisateur a déjà un plan actif
          console.log("[PromoRedeemer] ⚠️ User already has an active plan")
          toast({
            title: "ℹ️ Plan déjà actif",
            description: result.message,
            variant: "default",
          })
        } else if (result.error === "UNAUTHENTICATED") {
          console.log("[PromoRedeemer] ⚠️ User not authenticated yet")
        } else {
          console.log("[PromoRedeemer] ❌ Failed to redeem:", result.error)
          console.log("[PromoRedeemer] Message:", result.message)
          
          // Afficher une erreur si ce n'est pas juste "pas de code"
          if (result.error !== "NO_PENDING_CODE") {
            toast({
              title: "⚠️ Code promo",
              description: result.message,
              variant: "destructive",
            })
          }
        }
      } catch (error) {
        console.error("[PromoRedeemer] ❌ Unexpected error:", error)
      } finally {
        setChecked(true)
        console.log("[PromoRedeemer] ✓ Check completed")
      }
    }

    // Exécuter avec un léger délai pour laisser le dashboard se charger
    // et s'assurer que les cookies sont disponibles
    const timeout = setTimeout(checkAndRedeemPromo, 1000)

    return () => clearTimeout(timeout)
  }, [checked, toast])

  // Composant invisible - ne rend rien
  return null
}
