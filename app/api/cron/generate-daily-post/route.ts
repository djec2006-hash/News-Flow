import { NextResponse } from "next/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Route API pour générer automatiquement un article de blog
 * 
 * Sécurité : Vérifie une clé secrète dans le header
 * Usage : Appeler cette route avec un cron job ou manuellement
 * 
 * Exemple d'appel :
 * curl -X POST https://votre-domaine.com/api/cron/generate-daily-post \
 *   -H "Authorization: Bearer VOTRE_CLE_SECRETE"
 */
export async function POST(request: Request) {
  try {
    // Vérification de la clé secrète
    const authHeader = request.headers.get("authorization")
    const secretKey = process.env.CRON_SECRET_KEY || "changez-moi-en-production"
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Clé d'autorisation manquante" },
        { status: 401 }
      )
    }

    const providedKey = authHeader.replace("Bearer ", "")
    if (providedKey !== secretKey) {
      return NextResponse.json(
        { error: "Clé d'autorisation invalide" },
        { status: 403 }
      )
    }

    // Vérifier que Supabase est configuré
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { 
          error: "Supabase non configuré",
          message: "Les variables d'environnement Supabase sont manquantes"
        },
        { status: 500 }
      )
    }

    // Créer un client Supabase avec service_role pour bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Générer un slug unique basé sur la date
    const today = new Date()
    const dateStr = today.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).replace(/\//g, "-")
    const slug = `actu-${dateStr}`

    // Vérifier si un article avec ce slug existe déjà
    const { data: existingPost } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .single()

    if (existingPost) {
      return NextResponse.json(
        { 
          message: "Un article pour aujourd'hui existe déjà",
          slug,
          existing: true
        },
        { status: 200 }
      )
    }

    // Générer le contenu de l'article (version mock pour l'instant)
    const title = `Actu du ${today.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })}`
    
    const excerpt = `Résumé automatique de l'actualité financière du ${today.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long"
    })}.`
    
    const content = `
      <p>Voici un résumé automatique de l'actualité financière du jour.</p>
      <h3>Points clés</h3>
      <ul>
        <li>Analyse automatique des marchés</li>
        <li>Tendances détectées par notre IA</li>
        <li>Événements marquants de la journée</li>
      </ul>
      <p><em>Cet article a été généré automatiquement par notre système d'IA.</em></p>
    `

    // Insérer l'article dans Supabase
    const { data: newPost, error: insertError } = await supabase
      .from("posts")
      .insert({
        slug,
        title,
        excerpt,
        content,
        date: today.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric"
        }),
        category: "Marchés",
        read_time: 3,
        image_url: "/images/blog/default.jpg",
        is_published: true,
      })
      .select()
      .single()

    if (insertError) {
      console.error("[cron] Erreur lors de l'insertion:", insertError)
      return NextResponse.json(
        { 
          error: "Erreur lors de la création de l'article",
          details: insertError.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Article généré avec succès",
        post: {
          id: newPost.id,
          slug: newPost.slug,
          title: newPost.title,
        }
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("[cron] Erreur inattendue:", error)
    return NextResponse.json(
      { 
        error: "Erreur serveur",
        message: error.message
      },
      { status: 500 }
    )
  }
}

// GET pour tester la route (sans créer d'article)
export async function GET() {
  return NextResponse.json(
    {
      message: "Route API pour génération automatique d'articles",
      usage: "POST avec Authorization: Bearer YOUR_SECRET_KEY",
      note: "Configurez CRON_SECRET_KEY dans vos variables d'environnement"
    },
    { status: 200 }
  )
}

