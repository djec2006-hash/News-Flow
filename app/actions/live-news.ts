"use server"

import { tavily } from "@tavily/core"
import { createClient } from "@/lib/supabase/server"

// 🌐 Client Tavily
const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY || "",
})

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
      max_results: 10, // 🔥 Sélection drastique (10 max)
      include_answer: false,
      include_domains: TRUSTED_DOMAINS, // 🔥 Filtre strict des sources
      topic: "news", // Force le focus sur l'actualité
      days: 1, // 🔥 Strictement les dernières 24 heures
    })

    if (!response || !response.results || response.results.length === 0) {
      console.warn("[LiveFeed] No results from Tavily")
      return []
    }

    // Mapper les résultats
    const newsItems: LiveNewsItem[] = response.results
      .map((result: any) => ({
        url: result.url || "",
        title: result.title || "Sans titre",
        source: extractSourceName(result.url || ""),
        published_date: result.published_date || new Date().toISOString(),
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

    return sortedItems.slice(0, 10) // 🔥 Limite stricte à 10 items
  } catch (error) {
    console.error("[LiveFeed] Error fetching live news:", error)
    return []
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

