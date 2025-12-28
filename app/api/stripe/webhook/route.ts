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
      const userId = session.client_reference_id
      const customerId = session.customer as string

      if (userId) {
        // 👇 ICI : ON VISE LA TABLE "profiles" (et plus "users")
        const { error } = await supabaseAdmin
          .from("profiles") 
          .update({
            subscription_status: "active",
            stripe_customer_id: customerId,
            // updated_at: new Date().toISOString(), // Décommente si tu as cette colonne
          })
          .eq("id", userId)

        if (error) {
          console.error("❌ Erreur Update Supabase:", error)
          // On affiche l'erreur précise dans les logs Vercel
          return new NextResponse(`Erreur BDD: ${error.message}`, { status: 500 })
        }
        console.log("✅ SUCCÈS : Profil mis à jour !")
      }
    }

    return new NextResponse(null, { status: 200 })

  } catch (error: any) {
    console.error("❌ CRASH:", error)
    return new NextResponse(`Erreur Interne: ${error.message}`, { status: 500 })
  }
}