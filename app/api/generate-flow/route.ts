import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkFlowLimit } from "@/lib/usage-limits"
import { searchProjectNews, searchGeneralNews } from "@/lib/services/search"
import { generateSectionContent, generateIntro, generateOutro } from "@/lib/services/generation"
import { getUserProfile, checkAndDeductCredits, saveGeneratedFlow, getUserTopics } from "@/lib/services/database"
import type { FlowSection } from "@/types/flow"

export const maxDuration = 60

type Project = {
  id: string
  title: string
  description?: string | null
  domain?: string | null
  length_level?: string | null
  position?: number | null
  is_active?: boolean | null
}

export async function POST(request: Request) {
  const startTime = Date.now()
  console.log("\n" + "=".repeat(80))
  console.log("[NewsFlow] 🚀 SEQUENTIAL ENGINE - START")
  console.log("=".repeat(80))

  if (!process.env.TAVILY_API_KEY) {
    console.error("CRITICAL: TAVILY_KEY MISSING")
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const profileData = await getUserProfile(user.id).catch((e) => {
    console.error("[NewsFlow] ❌ Profile fetch failed:", e)
    return null
  })

  const userProfile = {
    plan_type: profileData?.plan_type ?? "free",
    complexity_level: profileData?.complexity_level ?? "standard",
  }

  try {
    const flowLimitCheck = await checkFlowLimit(user.id, userProfile.plan_type)
    if (!flowLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: "LIMIT_REACHED",
          message: `Quota atteint : ${flowLimitCheck.count}/${flowLimitCheck.limit} Flows.`,
        },
        { status: 403 },
      )
    }
  } catch (limitError) {
    console.warn("[NewsFlow] ⚠️ Limit check failed:", limitError)
  }

  // Crédits (coût unitaire = 1)
  const hasCredits = await checkAndDeductCredits(user.id, 1)
  if (!hasCredits) {
    return NextResponse.json({ error: "CREDITS_EXCEEDED", message: "Crédits insuffisants" }, { status: 402 })
  }

  const body = await request.json().catch(() => ({}))
  const extraInstructions = (body?.extraInstructions || body?.daily_instruction || "")?.toString().trim()

  const activeProjects = await getUserTopics(user.id).catch((e) => {
    console.error("[NewsFlow] ❌ Failed to load topics:", e)
    return []
  })

  if (!activeProjects || activeProjects.length === 0) {
    return NextResponse.json({ error: "Aucun projet actif." }, { status: 400 })
  }

  const sections: FlowSection[] = []
  const allSources: string[] = []

  const generalNewsPromise = searchGeneralNews().catch((e) => {
    console.warn("[NewsFlow] ⚠️ General news search failed", e)
    return []
  })

  const extractDomain = (url?: string, fallback?: string): string | undefined => {
    if (url) {
      try {
        return new URL(url).hostname.replace(/^www\./, "")
      } catch {
        // ignore parse error
      }
    }
    if (fallback) return fallback.replace(/^www\./, "")
    return undefined
  }

  for (const project of activeProjects as Project[]) {
    // Fail-safe temps : si on approche de 50s, on arrête la boucle
    const elapsed = (Date.now() - startTime) / 1000
    if (elapsed > 50) {
      console.warn("[NewsFlow] ⏳ Temps limite approché, arrêt anticipé de la boucle")
      break
    }

    console.log(`[NewsFlow] ▶️ Traitement du projet: "${project.title}"`)
    try {
      const keywords = [project.description || "", project.domain || ""].filter(Boolean)
      const articles = (await searchProjectNews(project.title || "Sujet", keywords)) as any[]
      const sectionDomains = Array.from(
        new Set(
          articles
            .map((a: any) => extractDomain(a.url, a.source))
            .filter((d): d is string => Boolean(d))
        )
      )
      allSources.push(...sectionDomains)

      const context = articles
        .map(
          (a, idx) =>
            `[SOURCE ${idx + 1}] ${a.title}\nDate: ${a.published_date}\nSource: ${a.source}\nURL: ${a.url}\nContenu: ${a.content}`,
        )
        .join("\n\n---\n\n")

      const instructions = extraInstructions || "Rédige un briefing concis, orienté marché."
      const result = await generateSectionContent(
        project.title || "Sujet",
        context,
        instructions,
        project.length_level || "standard",
      )

      sections.push({
        title: result.title || project.title,
        content: result.content || "",
        sentiment: result.sentiment || "neutral",
        key_figures: result.key_figures || [],
        sources: sectionDomains,
      })
    } catch (error) {
      console.error(`[NewsFlow] ❌ Echec pour "${project.title}", on continue`, error)
      continue
    }
  }

  if (sections.length === 0) {
    return NextResponse.json({ error: "Aucune section générée." }, { status: 500 })
  }

  const introContext = sections
    .map((s, i) => `[SECTION ${i + 1}] ${s.title}\n${s.content}`)
    .join("\n\n---\n\n")
  const topicTitles = sections.map((s) => s.title)
  const intro = await generateIntro(introContext, topicTitles)

  // Génération de la section "Bon à savoir" (outro) avec news généralistes
  const generalNews = await generalNewsPromise
  const generalNewsList: any[] = Array.isArray(generalNews) ? generalNews : []
  const outroContext = generalNewsList
    .map(
      (a: any, idx: number) =>
        `[GENERAL ${idx + 1}] ${a.title}\nDate: ${a.published_date || a.date || a.isoDate || ""}\nSource: ${
          a.source || ""
        }\nURL: ${a.url}\nContenu: ${a.content || ""}`,
    )
    .join("\n\n---\n\n")
  const outro = await generateOutro(outroContext)

  const assembledSections: FlowSection[] = [
    { title: "Introduction", content: intro.content || "", sentiment: intro.sentiment || "neutral" },
    ...sections,
    { title: outro.title, content: outro.content || "", sentiment: outro.sentiment || "neutral", key_figures: outro.key_figures },
  ]

  const bodyText = assembledSections
    .map((s) => `## ${s.title}\n\n${s.content}\n\n---`)
    .join("\n\n")

  const topicsCovered = activeProjects.map((p: any) => p.title).join(", ")
  const summary = intro.title || `Flow du ${new Date().toLocaleDateString("fr-FR")}`

  // Dé-duplication finale des sources pour éviter les doublons dans l'affichage
  const uniqueSources = Array.from(new Set(allSources))

  const fullFlowJson = {
    summary,
    created_at: new Date().toISOString(),
    main_image_url: "",
    sections: assembledSections,
    key_events: [],
    topics_covered: topicsCovered,
    sources: uniqueSources,
  }

  try {
    const newFlow = await saveGeneratedFlow(user.id, {
      complexity_level: userProfile.complexity_level,
      summary,
      body: bodyText,
      key_events: "",
      topics_covered: topicsCovered,
      source_json: fullFlowJson,
    })

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`[NewsFlow] ✅ Flow ${newFlow.id} généré en ${elapsedTime}s | Sections: ${assembledSections.length}`)

    return NextResponse.json({
      id: newFlow.id,
      summary: newFlow.summary,
      body: newFlow.body,
      elapsedTime: `${elapsedTime}s`,
    })
  } catch (insertError: any) {
    console.error("[NewsFlow] ❌ DB error:", insertError)
    return NextResponse.json(
      {
        warning: "Enregistrement BDD échoué",
        summary,
        body: bodyText,
        sections: assembledSections,
        sources: uniqueSources,
      },
      { status: 200 },
    )
  }
}

