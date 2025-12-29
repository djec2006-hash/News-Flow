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

    // Récupération du prix et du coupon
    const body = await request.json()
    const { priceId, couponId } = body

    if (!priceId) {
      return NextResponse.json({ error: "Price ID manquant" }, { status: 400 })
    }

    // Récupérer le prix pour vérifier si on peut appliquer une réduction
    const price = await stripe.prices.retrieve(priceId)
    const originalAmount = price.unit_amount || 0

    // Si un coupon est fourni, vérifier qu'il est valide et calculer le montant final
    let finalAmount = originalAmount
    let discounts: Array<{ coupon: string }> | undefined = undefined

    if (couponId) {
      try {
        const coupon = await stripe.coupons.retrieve(couponId)
        
        // Calculer le montant final après réduction
        if (coupon.percent_off) {
          finalAmount = Math.round(originalAmount * (1 - coupon.percent_off / 100))
        } else if (coupon.amount_off) {
          finalAmount = Math.max(0, originalAmount - coupon.amount_off)
        }

        // Ajouter le coupon aux discounts
        discounts = [{ coupon: couponId }]
      } catch (couponError) {
        console.error("Erreur lors de la récupération du coupon:", couponError)
        // Continuer sans coupon si erreur
      }
    }

    // Si le montant final est 0€, créer directement l'abonnement sans checkout
    if (finalAmount === 0 && couponId) {
      try {
        // Récupérer ou créer le customer Stripe
        let customerId: string | null = null
        
        // Chercher le customer existant
        const customers = await stripe.customers.list({
          email: user.email || undefined,
          limit: 1,
        })

        if (customers.data.length > 0) {
          customerId = customers.data[0].id
        } else {
          // Créer un nouveau customer
          const customer = await stripe.customers.create({
            email: user.email || undefined,
            metadata: {
              userId: user.id,
            },
          })
          customerId = customer.id
        }

        // Créer l'abonnement directement avec le coupon
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          coupon: couponId,
          metadata: {
            userId: user.id,
          },
        })

        // Rediriger vers le dashboard avec succès
        return NextResponse.json({
          url: `${request.headers.get("origin")}/dashboard?payment=success&subscription=${subscription.id}`,
        })
      } catch (subscriptionError: any) {
        console.error("Erreur lors de la création de l'abonnement gratuit:", subscriptionError)
        return NextResponse.json(
          { error: subscriptionError.message || "Erreur lors de la création de l'abonnement" },
          { status: 500 }
        )
      }
    }

    // Configuration de base de la session pour les paiements normaux
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      allow_promotion_codes: !couponId, // Permettre les codes promo seulement si pas de coupon déjà appliqué
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
    }

    // Ajouter le coupon si fourni
    if (discounts) {
      sessionConfig.discounts = discounts
    }

    // Création de la session
    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error("❌ Erreur Stripe Checkout:", error)
    return NextResponse.json(
      { error: error.message || "Erreur interne" },
      { status: 500 }
    )
  }
}