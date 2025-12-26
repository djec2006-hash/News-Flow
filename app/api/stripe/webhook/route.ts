import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

// 1. Initialisation de Stripe avec la NOUVELLE variable STRIPE_SK
const stripe = new Stripe(process.env.STRIPE_SK!, {
  apiVersion: "2025-02-24.acacia" as any,
  typescript: true,
})

// 2. Initialisation de Supabase (Admin) pour pouvoir modifier l'user sans être connecté
// Attention : On utilise la clé SERVICE_ROLE ou ANON_KEY si RLS le permet.
// Pour faire simple ici, on suppose que tu as mis SUPABASE_URL et ANON_KEY dans Vercel.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Ou SERVICE_ROLE si tu l'as
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  // 3. Vérification de la signature (Sécurité)
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("STRIPE_WEBHOOK_SECRET manquant")
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error: any) {
    console.error("❌ Erreur Signature Webhook:", error.message)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // 4. Traitement de l'événement "Paiement Réussi"
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.client_reference_id // On récupère l'ID envoyé lors du paiement

    console.log(`💰 Paiement validé pour l'utilisateur : ${userId}`)

    if (userId) {
      // 5. Mise à jour de la base de données Supabase
      // On met à jour la table 'users' ou 'subscriptions' (adapte selon ta table !)
      // Exemple : On passe le champ 'is_premium' à true
      
      const { error } = await supabase
        .from("users") // ⚠️ VÉRIFIE LE NOM DE TA TABLE (users ? profiles ?)
        .update({ 
            subscription_status: "active", // ou is_premium: true
            stripe_customer_id: session.customer as string,
            updated_at: new Date().toISOString()
        }) 
        .eq("id", userId)

      if (error) {
        console.error("❌ Erreur Supabase update:", error)
        return new NextResponse("Erreur update BDD", { status: 500 })
      }
      
      console.log("✅ Base de données mise à jour avec succès !")
    }
  }

  return new NextResponse(null, { status: 200 })
}