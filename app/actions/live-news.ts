"use server"

import { tavily } from "@tavily/core"
import { createClient } from "@/lib/supabase/server"
import Groq from "groq-sdk"

// 🌐 Client Tavily
const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY || "",
})

// 🔑 Client Groq pour la curation IA
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" })

// 📰 Liste blanche des sources premium/fiables
const TRUSTED_DOMAINS = [
  "bloomberg.com",
  "reuters.com",
  "cnbc.com",
  "ft.com",
  "wsj.com",
  "lesechos.fr",
  "lemonde.fr",
  "coindesk.com",
  "techcrunch.com",
  "economist.com",
  "bfmtv.com",
  "investing.com",
  "marketwatch.com",
  "financialtimes.com",
]

// 🎯 Mapping domaines → mots-clés de recherche
const DOMAIN_KEYWORDS: Record<string, string> = {
  finance: "financial markets stocks bonds trading",
  crypto: "cryptocurrency bitcoin ethereum blockchain",
  geopolitics: "geopolitics international relations conflicts diplomacy",
  tech: "technology startups AI software innovation",
  sport: "sports competitions tournaments athletes",
  health: "health medicine healthcare medical research",
  environment: "environment climate sustainability energy",
  culture: "culture arts entertainment media",
}

export interface LiveNewsItem {
  url: string
  title: string
  source: string
  published_date: string
  snippet: string
}

export async function getLiveNews(userId?: string): Promise<LiveNewsItem[]> {
  if (!process.env.TAVILY_API_KEY) {
    console.warn("[LiveFeed] Tavily API key not configured")
    return []
  }

  try {
    let query = "financial markets crypto breaking news"

    // 🎯 Récupérer les préférences utilisateur si userId fourni
    if (userId) {
      const supabase = await createClient()
      const { data: settings } = await supabase
        .from("live_feed_settings")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (settings) {
        if (settings.mode === "custom") {
          // Mode custom : construire query depuis domaines + instructions
          const domainKeywords = settings.custom_domains
            .map((domain: string) => DOMAIN_KEYWORDS[domain] || "")
            .filter(Boolean)
            .join(" ")

          query = domainKeywords || "breaking news latest updates"

          if (settings.custom_instructions) {
            query += " " + settings.custom_instructions
          }

          console.log("[LiveFeed] Custom mode - Query:", query)
        } else {
          // Mode auto : récupérer les projets actifs
          const { data: projects } = await supabase
            .from("custom_topics")
            .select("title, description, domain")
            .eq("user_id", userId)
            .eq("is_active", true)
            .limit(5)

          if (projects && projects.length > 0) {
            const projectKeywords = projects
              .map((p: any) => {
                const parts = []
                if (p.title) parts.push(p.title)
                if (p.description) parts.push(p.description)
                if (p.domain && DOMAIN_KEYWORDS[p.domain]) {
                  parts.push(DOMAIN_KEYWORDS[p.domain])
                }
                return parts.join(" ")
              })
              .join(" ")

            query = projectKeywords + " breaking news latest"
            console.log("[LiveFeed] Auto mode - Query from projects:", query)
          }
        }
      }
    }

    console.log("[LiveFeed] Fetching live news from premium sources...")

    const response = await tvly.search(query + " from major reputable news outlets", {
      search_depth: "advanced",
      max_results: 5, // 🔥 LIMITE STRICTE : 5 max pour réduire le bruit
      include_answer: false,
      include_domains: TRUSTED_DOMAINS, // 🔥 Filtre strict des sources
      topic: "news", // Force le focus sur l'actualité
      days: 1, // 🔥 Strictement les dernières 24 heures
    })

    if (!response || !response.results || response.results.length === 0) {
      console.warn("[LiveFeed] No results from Tavily")
      return []
    }

    // NOUVEAU CODE: Parsing robuste de la date avec fallback
    // ANCIEN CODE: Utilisait directement result.published_date sans validation
    const parsePublishedDate = (result: any): string => {
      // Essayer plusieurs formats de date possibles depuis RSS
      const dateString = result.published_date || result.isoDate || result.pubDate || result.date
      
      if (!dateString) {
        // Si aucune date n'est fournie, utiliser la date actuelle
        return new Date().toISOString()
      }
      
      // Créer un objet Date pour valider le format
      const date = new Date(dateString)
      
      // Si la date est invalide, utiliser la date actuelle
      if (isNaN(date.getTime())) {
        console.warn("[LiveFeed] Date invalide reçue, utilisation de la date actuelle:", dateString)
        return new Date().toISOString()
      }
      
      // Retourner la date au format ISO
      return date.toISOString()
    }

    // Mapper les résultats
    const newsItems: LiveNewsItem[] = response.results
      .map((result: any) => ({
        url: result.url || "",
        title: result.title || "Sans titre",
        source: extractSourceName(result.url || ""),
        published_date: parsePublishedDate(result),
        snippet: result.content || "",
      }))
      .filter((item) => item.url && item.title) // Filtre les résultats incomplets

    // 🧹 DÉDOUBLONNAGE : Supprimer les articles avec le même titre
    const uniqueItems = Array.from(
      new Map(newsItems.map(item => [item.title.toLowerCase().trim(), item])).values()
    )

    // 📅 TRI : Du plus récent au plus ancien
    const sortedItems = uniqueItems.sort((a, b) => {
      const dateA = new Date(a.published_date).getTime()
      const dateB = new Date(b.published_date).getTime()
      return dateB - dateA // Plus récent d'abord
    })

    console.log(`[LiveFeed] ✅ Retrieved ${sortedItems.length} unique news items (sorted by date)`)

    // 🎯 CURATION IA : Filtrer pour ne garder que la "Crème de la Crème"
    const curatedItems = await curateNewsWithAI(sortedItems, query)

    return curatedItems.slice(0, 3) // 🔥 LIMITE FINALE : Maximum 3 news les plus critiques
  } catch (error) {
    console.error("[LiveFeed] Error fetching live news:", error)
    return []
  }
}

/**
 * 🎯 CURATEUR IMPITOYABLE - Filtre les news pour ne garder que les plus critiques
 * Utilise l'IA pour évaluer la pertinence et l'impact de chaque news
 */
async function curateNewsWithAI(
  newsItems: LiveNewsItem[],
  userQuery: string
): Promise<LiveNewsItem[]> {
  if (newsItems.length === 0) return []
  
  // Si on a 3 items ou moins, pas besoin de curation
  if (newsItems.length <= 3) {
    return newsItems
  }

  // Si Groq n'est pas configuré, on fait un filtrage basique
  if (!process.env.GROQ_API_KEY) {
    console.warn("[LiveFeed] Groq API key not configured, using basic filtering")
    return newsItems.slice(0, 3)
  }

  try {
    // Préparer le prompt de curation
    const newsList = newsItems
      .map((item, index) => {
        const hoursAgo = Math.floor(
          (Date.now() - new Date(item.published_date).getTime()) / (1000 * 60 * 60)
        )
        return `${index + 1}. [${item.source}] ${item.title} (il y a ${hoursAgo}h)`
      })
      .join("\n")

    const curationPrompt = `Tu es un CURATEUR IMPITOYABLE d'actualités de niveau Bloomberg Terminal.

TA MISSION : Sélectionner UNIQUEMENT les 2-3 news les plus CRITIQUES et IMPACTANTES parmi cette liste.

=== CONTEXTE UTILISATEUR ===
Intérêts : ${userQuery}

=== LISTE DES NEWS ===
${newsList}

=== CRITÈRES DE SÉLECTION STRICTS ===
✅ GARDE UNE NEWS SI :
- Elle a un impact DIRECT et SIGNIFICATIF sur les marchés, l'économie ou le sujet de l'utilisateur
- Elle contient des informations NOUVELLES et ACTIONNABLES (pas du bruit, pas une redite)
- Elle est FRAÎCHE (moins de 12h idéalement)
- Elle provient d'une source PREMIUM et CRÉDIBLE

❌ JETTE UNE NEWS SI :
- C'est du bruit informationnel (redite, analyse superficielle)
- L'impact est mineur ou indirect
- C'est une opinion plutôt qu'un fait
- Le titre est clickbait sans substance

=== RÈGLES STRICTES ===
- Tu dois sélectionner MAXIMUM 3 news (idéalement 2)
- Réponds UNIQUEMENT avec les NUMÉROS des news sélectionnées, séparés par des virgules
- Exemple de réponse : "1,3,5"
- Si aucune news n'est vraiment critique, réponds avec moins de 3 numéros
- Ne justifie pas, ne commente pas, juste les numéros

=== MAINTENANT, SÉLECTIONNE ===`

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // Modèle rapide pour la curation
      messages: [
        {
          role: "system",
          content: "Tu es un curateur impitoyable d'actualités. Tu sélectionnes uniquement les news les plus critiques. Réponds UNIQUEMENT avec les numéros séparés par des virgules.",
        },
        {
          role: "user",
          content: curationPrompt,
        },
      ],
      temperature: 0.2, // Très bas pour être cohérent et strict
      max_tokens: 50,
    })

    const selectedNumbers = response.choices?.[0]?.message?.content?.trim() || ""
    
    if (!selectedNumbers) {
      console.warn("[LiveFeed] AI curation returned empty, using first 3 items")
      return newsItems.slice(0, 3)
    }

    // Parser les numéros sélectionnés
    const indices = selectedNumbers
      .split(",")
      .map((n) => parseInt(n.trim()) - 1) // Convertir en index (0-based)
      .filter((idx) => idx >= 0 && idx < newsItems.length)

    if (indices.length === 0) {
      console.warn("[LiveFeed] AI curation returned invalid indices, using first 3 items")
      return newsItems.slice(0, 3)
    }

    const curated = indices.map((idx) => newsItems[idx]).filter(Boolean)
    
    console.log(`[LiveFeed] 🎯 AI curation: ${newsItems.length} → ${curated.length} news sélectionnées`)
    
    return curated
  } catch (error) {
    console.error("[LiveFeed] Error in AI curation:", error)
    // En cas d'erreur, on retourne les 3 plus récentes
    return newsItems.slice(0, 3)
  }
}

// 🏷️ Extrait le nom de la source depuis l'URL
function extractSourceName(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace("www.", "")
    
    // Mapping des noms premium
    const sourceMap: Record<string, string> = {
      "bloomberg.com": "Bloomberg",
      "reuters.com": "Reuters",
      "cnbc.com": "CNBC",
      "ft.com": "Financial Times",
      "wsj.com": "Wall Street Journal",
      "lesechos.fr": "Les Échos",
      "lemonde.fr": "Le Monde",
      "coindesk.com": "CoinDesk",
      "techcrunch.com": "TechCrunch",
      "economist.com": "The Economist",
      "bfmtv.com": "BFM Business",
      "investing.com": "Investing.com",
      "marketwatch.com": "MarketWatch",
      "financialtimes.com": "Financial Times",
    }

    return sourceMap[hostname] || hostname
  } catch {
    return "Source inconnue"
  }
}

