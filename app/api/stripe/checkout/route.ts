import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase/server"
import { getPlanConfig } from "@/lib/plans"

// ═══════════════════════════════════════════════════════════════════════════════
// 💳 STRIPE CHECKOUT - Création de session de paiement
// ═══════════════════════════════════════════════════════════════════════════════

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
})

export async function POST(request: Request) {
  console.log("============================================")
  console.log("[Stripe Checkout] 🚀 Creating checkout session...")
  console.log("============================================")

  try {
    // 🔐 Vérifier l'authentification
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[Stripe Checkout] ❌ User not authenticated")
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    console.log("[Stripe Checkout] ✅ User authenticated:", user.id)

    // 📦 Récupérer les données de la requête
    const body = await request.json()
    const { priceId, planType } = body

    if (!priceId || !planType) {
      console.log("[Stripe Checkout] ❌ Missing priceId or planType")
      return NextResponse.json(
        { error: "priceId et planType sont requis" },
        { status: 400 }
      )
    }

    // Vérifier que le planType est valide
    const planConfig = getPlanConfig(planType)
    if (!planConfig || planType === "free") {
      return NextResponse.json(
        { error: "Plan invalide" },
        { status: 400 }
      )
    }

    console.log("[Stripe Checkout] 📋 Plan:", planType)
    console.log("[Stripe Checkout] 💰 Price ID:", priceId)

    // 🌐 Récupérer l'origine (pour les URLs de retour)
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    console.log("[Stripe Checkout] 🌐 Origin:", origin)

    // 💳 Créer la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: user.id, // 🔑 CRUCIAL : Pour identifier l'utilisateur dans le webhook
      metadata: {
        planType: planType, // 🔑 CRUCIAL : Pour savoir quel plan activer
        userId: user.id,
        userEmail: user.email || "",
      },
      success_url: `${origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      customer_email: user.email || undefined, // Pré-remplir l'email
      allow_promotion_codes: true, // Autoriser les codes promo Stripe
    })

    console.log("[Stripe Checkout] ✅ Session created:", session.id)
    console.log("[Stripe Checkout] 🔗 Session URL:", session.url)

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error("============================================")
    console.error("[Stripe Checkout] ❌ ERROR:")
    console.error(error)
    console.error("============================================")

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erreur lors de la création de la session",
      },
      { status: 500 }
    )
  }
}

