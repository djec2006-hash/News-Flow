import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("Stripe-Signature") as string

    // Vérification des clés
    if (!process.env.STRIPE_SK || !process.env.STRIPE_WEBHOOK_SECRET) {
      return new NextResponse("Config serveur manquante", { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SK, {
      apiVersion: "2025-02-24.acacia" as any,
      typescript: true,
    })

    // Vérification Signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err: any) {
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    // Connexion Admin Supabase
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      
      // Récupérer userId depuis metadata (prioritaire) ou client_reference_id (fallback)
      const userId = session.metadata?.userId || session.client_reference_id
      const planType = session.metadata?.planType || "basic"
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string | undefined

      if (!userId) {
        console.error("❌ User ID manquant dans les metadata")
        return new NextResponse("User ID missing in metadata", { status: 400 })
      }

      console.log(`[Stripe Webhook] 📋 Mise à jour utilisateur ${userId} vers plan ${planType}`)

      // Mettre à jour le profil avec le plan_type
      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          plan_type: planType,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
        })
        .eq("id", userId)

      if (error) {
        console.error("❌ Erreur Update Supabase:", error)
        return new NextResponse(`Erreur BDD: ${error.message}`, { status: 500 })
      }

      console.log(`✅ SUCCÈS : Profil ${userId} mis à jour vers plan ${planType}`)
    }

    return new NextResponse(null, { status: 200 })

  } catch (error: any) {
    console.error("❌ CRASH:", error)
    return new NextResponse(`Erreur Interne: ${error.message}`, { status: 500 })
  }
}