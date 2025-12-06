import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { createAdminClient } from "@/lib/supabase/admin"

// ═══════════════════════════════════════════════════════════════════════════════
// 🔔 STRIPE WEBHOOK - Activation automatique des abonnements
// ═══════════════════════════════════════════════════════════════════════════════

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
})

// Désactiver le body parsing par défaut pour Stripe
export const runtime = "nodejs"

export async function POST(request: Request) {
  console.log("============================================")
  console.log("[Stripe Webhook] 🔔 Event received")
  console.log("============================================")

  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature")

    if (!signature) {
      console.log("[Stripe Webhook] ❌ No signature found")
      return NextResponse.json({ error: "Signature manquante" }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error("[Stripe Webhook] ❌ STRIPE_WEBHOOK_SECRET not configured")
      return NextResponse.json({ error: "Webhook secret non configuré" }, { status: 500 })
    }

    // 🔐 Vérifier la signature Stripe
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log("[Stripe Webhook] ✅ Signature verified")
      console.log("[Stripe Webhook] 📋 Event type:", event.type)
    } catch (err) {
      console.error("[Stripe Webhook] ❌ Signature verification failed:", err)
      return NextResponse.json(
        { error: `Webhook Error: ${err instanceof Error ? err.message : "Invalid signature"}` },
        { status: 400 }
      )
    }

    // 🎯 Traiter l'événement selon son type
    switch (event.type) {
      case "checkout.session.completed": {
        console.log("[Stripe Webhook] 💳 Processing checkout.session.completed...")

        const session = event.data.object as Stripe.Checkout.Session

        // Récupérer les métadonnées
        const userId = session.client_reference_id
        const planType = session.metadata?.planType

        console.log("[Stripe Webhook] 👤 User ID:", userId)
        console.log("[Stripe Webhook] 📋 Plan Type:", planType)

        if (!userId || !planType) {
          console.error("[Stripe Webhook] ❌ Missing userId or planType in metadata")
          return NextResponse.json(
            { error: "Données de session incomplètes" },
            { status: 400 }
          )
        }

        // Récupérer les détails de l'abonnement
        let subscriptionId: string | undefined
        let expiresAt: Date

        if (session.mode === "subscription" && session.subscription) {
          const subscription = typeof session.subscription === "string"
            ? await stripe.subscriptions.retrieve(session.subscription)
            : session.subscription

          subscriptionId = subscription.id
          
          // Calculer la date d'expiration (fin de la période d'abonnement)
          expiresAt = new Date(subscription.current_period_end * 1000)

          console.log("[Stripe Webhook] 📅 Subscription expires at:", expiresAt.toISOString())
        } else {
          // Fallback : 1 mois depuis maintenant
          expiresAt = new Date()
          expiresAt.setMonth(expiresAt.getMonth() + 1)
          console.log("[Stripe Webhook] ⚠️ Using fallback expiration date (1 month)")
        }

        // 🔄 Mettre à jour le profil utilisateur dans Supabase
        console.log("[Stripe Webhook] 🔄 Updating user profile...")

        const supabaseAdmin = createAdminClient()

        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({
            plan_type: planType,
            plan_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (updateError) {
          console.error("[Stripe Webhook] ❌ Error updating profile:", updateError)
          return NextResponse.json(
            { error: "Erreur lors de la mise à jour du profil" },
            { status: 500 }
          )
        }

        console.log("[Stripe Webhook] ✅ Profile updated successfully!")
        console.log(`[Stripe Webhook] ✅ User ${userId} is now on plan ${planType}`)
        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        console.log(`[Stripe Webhook] 🔄 Processing ${event.type}...`)

        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (!userId) {
          console.error("[Stripe Webhook] ❌ No userId in subscription metadata")
          break
        }

        const supabaseAdmin = createAdminClient()

        if (event.type === "customer.subscription.deleted") {
          // Abonnement annulé : repasser au plan gratuit
          console.log("[Stripe Webhook] ❌ Subscription canceled, downgrading to free")

          await supabaseAdmin
            .from("profiles")
            .update({
              plan_type: "free",
              plan_expires_at: null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId)
        } else {
          // Abonnement mis à jour : mettre à jour la date d'expiration
          const expiresAt = new Date(subscription.current_period_end * 1000)

          await supabaseAdmin
            .from("profiles")
            .update({
              plan_expires_at: expiresAt.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", userId)
        }

        console.log("[Stripe Webhook] ✅ Subscription status updated")
        break
      }

      case "invoice.payment_succeeded": {
        console.log("[Stripe Webhook] 💰 Invoice payment succeeded")
        // On peut logger ou envoyer une notification ici si besoin
        break
      }

      case "invoice.payment_failed": {
        console.log("[Stripe Webhook] ⚠️ Invoice payment failed")
        // On peut envoyer un email ou une notification ici
        break
      }

      default:
        console.log(`[Stripe Webhook] ℹ️ Unhandled event type: ${event.type}`)
    }

    console.log("============================================")
    console.log("[Stripe Webhook] ✅ Event processed successfully")
    console.log("============================================")

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("============================================")
    console.error("[Stripe Webhook] ❌ UNEXPECTED ERROR:")
    console.error(error)
    console.error("============================================")

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    )
  }
}

