import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

// On garde ces options pour assurer la lecture dynamique
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    console.log("🔍 Tentative de lecture de la clé STRIPE_SK...")

    // 👇 C'EST ICI QUE TOUT CHANGE : On appelle le nouveau nom
    const stripeSecretKey = process.env.STRIPE_SK

    if (!stripeSecretKey) {
      console.error("❌ ERREUR : La variable STRIPE_SK est introuvable.")
      console.log("Clés disponibles:", Object.keys(process.env)) 
      return NextResponse.json(
        { error: "Configuration Stripe manquante sur le serveur" },
        { status: 500 }
      )
    }

    console.log("✅ SUCCÈS : Clé STRIPE_SK trouvée !")

    // Initialisation de Stripe avec la clé récupérée
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia" as any,
      typescript: true,
    })

    // Authentification Supabase
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Récupération du prix
    const body = await request.json()
    const { priceId } = body

    if (!priceId) {
      return NextResponse.json({ error: "Price ID manquant" }, { status: 400 })
    }

    // Création de la session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get("origin")}/dashboard?payment=success`,
      cancel_url: `${request.headers.get("origin")}/pricing?payment=cancelled`,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
      },
    })

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error("❌ Erreur Stripe Checkout:", error)
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 }
    )
  }
}