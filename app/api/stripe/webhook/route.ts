import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

// ⚠️ IMPORTANT : On n'initialise PAS Stripe ici (en dehors de la fonction)
// On le fera à l'intérieur pour éviter le crash au build.

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  // 1. Initialisation de Stripe sécurisée (à l'intérieur)
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    console.error("❌ CLÉ MANQUANTE : STRIPE_SECRET_KEY")
    return NextResponse.json({ error: "Config serveur manquante" }, { status: 500 })
  }
  
  const stripe = new Stripe(stripeKey, {
    apiVersion: "2025-02-24.acacia" as any,
    typescript: true,
  })

  // 2. Vérification du Secret Webhook
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error("❌ CLÉ MANQUANTE : STRIPE_WEBHOOK_SECRET")
    return NextResponse.json({ error: "Config Webhook manquante" }, { status: 500 })
  }

  let event: Stripe.Event

  // 3. Vérification de la signature (C'est Stripe qui parle ?)
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error(`❌ Erreur signature Webhook: ${error.message}`)
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  // 4. Initialisation Supabase Admin (pour écrire dans la base sans être connecté)
  // On utilise le SERVICE_ROLE_KEY si dispo, sinon la clé anon (mais attention aux droits)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // 5. Traitement des événements
  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const subscriptionId = session.subscription
    const userId = session.metadata?.userId // On récupère l'ID qu'on avait passé dans checkout

    console.log(`💰 Paiement réussi pour User: ${userId}`)

    if (userId) {
      // Mettre à jour le profil utilisateur
      // NOTE : Il faudra adapter 'plan_type' selon ta logique (pro, basic...)
      // Ici on met un exemple générique, tu devras peut-être affiner selon le priceId
      await supabase
        .from("profiles")
        .update({ 
            is_subscribed: true,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: subscriptionId as string
        })
        .eq("id", userId)
    }
  }

  return NextResponse.json({ received: true })
}