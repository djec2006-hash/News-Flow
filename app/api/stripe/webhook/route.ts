import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    
    // ✅ CORRECTION ICI : On prend les headers directement depuis la requête
    // Plus besoin de "import { headers } from 'next/headers'" qui faisait planter
    const signature = req.headers.get("Stripe-Signature") as string

    if (!process.env.STRIPE_SK || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("❌ Clés Stripe manquantes dans Vercel")
      return new NextResponse("Config serveur manquante", { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SK, {
      apiVersion: "2025-02-24.acacia" as any,
      typescript: true,
    })

    // 2. Vérification Signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err: any) {
      console.error(`⚠️ Erreur Signature: ${err.message}`)
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    // 3. Connexion Supabase ADMIN (Indispensable pour modifier les users)
    // Assure-toi d'avoir ajouté SUPABASE_SERVICE_ROLE_KEY dans Vercel !
    // Si tu ne l'as pas, remplace par process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY (mais ça risque de bloquer niveau permissions)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // 4. Traitement
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id
      const customerId = session.customer as string

      console.log(`🔔 Webhook reçu pour UserID: ${userId}`)

      if (userId) {
        // ⚠️ VÉRIFIE QUE TA TABLE S'APPELLE BIEN "users" (ou "profiles" ?)
        const { error } = await supabaseAdmin
          .from("users") 
          .update({
            subscription_status: "active",
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (error) {
          console.error("❌ Erreur Update Supabase:", error)
          return new NextResponse(`Erreur BDD: ${error.message}`, { status: 500 })
        }
        
        console.log("✅ Succès ! Base de données mise à jour.")
      }
    }

    return new NextResponse(null, { status: 200 })

  } catch (error: any) {
    console.error("❌ CRASH SERVEUR:", error)
    return new NextResponse(`Erreur Interne: ${error.message}`, { status: 500 })
  }
}