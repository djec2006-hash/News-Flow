import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Stripe from "stripe"

// ✅ Force le mode dynamique pour que Vercel lise bien les clés au moment du clic
export const dynamic = 'force-dynamic' 

export async function POST(request: Request) {
  try {
    // On récupère la variable d'environnement (Pas de clé en dur ici !)
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY

    if (!stripeSecretKey) {
      console.error("❌ ERREUR : STRIPE_SECRET_KEY est vide/introuvable.")
      return NextResponse.json(
        { error: "Erreur serveur : Clé Stripe manquante" },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia" as any,
      typescript: true,
    })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await request.json()
    const { priceId } = body

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${request.headers.get("origin")}/dashboard?payment=success`,
      cancel_url: `${request.headers.get("origin")}/pricing?payment=cancelled`,
      client_reference_id: user.id,
      metadata: { userId: user.id },
    })

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error("❌ Erreur Stripe:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}