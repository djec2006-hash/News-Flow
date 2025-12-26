import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  try {
    console.log("API Paiement appelée...")

    // 1. Récupération de la clé
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      console.error("❌ ERREUR : STRIPE_SECRET_KEY introuvable.")
      // Astuce Debug : On affiche la liste des clés dispo (SANS les valeurs) pour voir si elle est là
      console.log("Clés disponibles:", Object.keys(process.env)) 
      
      return NextResponse.json(
        { error: "Configuration Stripe manquante sur le serveur" },
        { status: 500 }
      )
    }

    // 2. Initialisation Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia" as any,
      typescript: true,
    })

    // 3. Authentification
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // 4. Récupération du prix
    const body = await request.json()
    const { priceId } = body

    if (!priceId) {
      return NextResponse.json({ error: "Price ID manquant" }, { status: 400 })
    }

    // 5. Création Session (+ CODE PROMO AJOUTÉ ICI)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      // ✅ C'est ici qu'on active les coupons !
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

    if (!session.url) {
      throw new Error("Pas d'URL de session générée")
    }

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error("❌ Erreur Stripe Checkout:", error)
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 }
    )
  }
}