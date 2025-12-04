import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const extraInstructions = body.extraInstructions || ""

    // 1. Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // 2. Fetch user data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    const { data: preferences, error: preferencesError } = await supabase
      .from("content_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single()

    const { data: customTopics } = await supabase
      .from("custom_topics")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)

    if (!profile || !preferences) {
      return NextResponse.json(
        { error: "Profil ou préférences manquants. Veuillez compléter votre onboarding." },
        { status: 400 },
      )
    }

    // 3. Build prompt for OpenAI
    const prompt = `Tu es un assistant spécialisé dans la création de recaps d'actualité personnalisés.

Informations sur l'utilisateur :
- Âge : ${profile.age || "Non spécifié"}
- Niveau d'éducation : ${profile.education_level || "Non spécifié"}
- Activité actuelle : ${profile.current_activity || "Non spécifié"}
- Niveau de complexité souhaité : ${profile.complexity_level || "standard"}
- Langue : ${profile.language || "fr"}

Préférences de contenu :
- Domaines généraux : ${preferences.general_domains?.join(", ") || "Aucun"}
- Marchés financiers : ${preferences.financial_markets?.join(", ") || "Aucun"}
- Régions : ${preferences.regions?.join(", ") || "Aucun"}

${
  customTopics && customTopics.length > 0
    ? `Sujets personnalisés (par ordre de priorité) :
${customTopics
  .sort((a, b) => (a.priority || 0) - (b.priority || 0))
  .map(
    (topic) =>
      `- ${topic.title} : ${topic.description}${topic.instructions ? ` (Instructions: ${topic.instructions})` : ""}`,
  )
  .join("\n")}`
    : ""
}
${
  extraInstructions.trim()
    ? `
CONSIGNE SPÉCIFIQUE POUR CE RECAP :
${extraInstructions}

Cette consigne est prioritaire et doit être respectée dans le recap généré.`
    : ""
}

Génère un recap d'actualité personnalisé basé sur ces préférences. Le recap doit :
- Être adapté au niveau de complexité demandé (${profile.complexity_level || "standard"})
- Couvrir les domaines et régions spécifiés
- Intégrer les sujets personnalisés selon leur priorité
${extraInstructions.trim() ? "- RESPECTER STRICTEMENT la consigne spécifique fournie ci-dessus" : ""}
- Être rédigé en ${profile.language === "en" ? "anglais" : "français"}
- Être factuel et informatif

IMPORTANT : Tu dois répondre UNIQUEMENT avec un objet JSON valide dans ce format exact :
{
  "summary": "Un résumé global du recap en 3-5 phrases",
  "sections": [
    { "title": "Titre de la section 1", "content": "Contenu détaillé de la section..." },
    { "title": "Titre de la section 2", "content": "Contenu détaillé de la section..." }
  ],
  "key_events": [
    "Événement clé 1",
    "Événement clé 2",
    "Événement clé 3"
  ],
  "topics_covered": "Brève description des sujets traités dans ce recap"
}

Ne retourne RIEN d'autre que le JSON. Pas de markdown, pas de texte avant ou après.`

    // Call OpenAI API
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json({ error: "OpenAI API key non configurée" }, { status: 500 })
    }

    console.log("[v0] Calling OpenAI API...")
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Tu es un assistant qui génère des recaps d'actualité personnalisés. Tu réponds UNIQUEMENT en JSON valide.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error("[v0] OpenAI API error:", errorText)
      return NextResponse.json({ error: "Erreur lors de l'appel à OpenAI" }, { status: 500 })
    }

    const openaiData = await openaiResponse.json()
    const rawContent = openaiData.choices?.[0]?.message?.content

    if (!rawContent) {
      return NextResponse.json({ error: "Réponse vide de OpenAI" }, { status: 500 })
    }

    console.log("[v0] OpenAI raw response:", rawContent)

    // 4. Parse JSON response
    let parsedResponse
    try {
      // Remove potential markdown code blocks
      const cleanedContent = rawContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      parsedResponse = JSON.parse(cleanedContent)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      console.error("[v0] Raw content:", rawContent)
      return NextResponse.json({ error: "Impossible de parser la réponse JSON de OpenAI" }, { status: 500 })
    }

    // 5. Build recap data
    const summary = parsedResponse.summary || "Recap généré"
    const recapBody = parsedResponse.sections
      ?.map((section: { title: string; content: string }) => `${section.title}\n\n${section.content}`)
      .join("\n\n---\n\n")
    const keyEvents = parsedResponse.key_events?.join("\n") || ""
    const topicsCovered = parsedResponse.topics_covered || ""
    const sourceJson = JSON.stringify(parsedResponse)

    // 6. Insert into recaps table
    const { data: newRecap, error: insertError } = await supabase
      .from("recaps")
      .insert({
        user_id: user.id,
        type: "on_demand",
        channels: ["app"],
        complexity_level: profile.complexity_level || "standard",
        summary,
        body: recapBody,
        key_events: keyEvents,
        topics_covered: topicsCovered,
        source_json: sourceJson,
      })
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Insert error:", insertError)
      return NextResponse.json({ error: "Erreur lors de la sauvegarde du recap" }, { status: 500 })
    }

    console.log("[v0] Recap created successfully:", newRecap.id)

    return NextResponse.json({
      id: newRecap.id,
      created_at: newRecap.created_at,
      summary: newRecap.summary,
      body: newRecap.body,
      key_events: newRecap.key_events,
      topics_covered: newRecap.topics_covered,
    })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Erreur serveur inattendue" }, { status: 500 })
  }
}
