import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { tavily } from "@tavily/core"

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY || "",
})

function extractSource(url: string): string {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "")
    return hostname.split(".").slice(-2).join(".") || "source"
  } catch {
    return "source"
  }
}

export async function GET() {
  if (!process.env.TAVILY_API_KEY) {
    console.warn("[LiveNews] TAVILY_API_KEY manquant")
    return NextResponse.json({ news: [] })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let topics: string[] = []

  if (user) {
    const { data: projects, error } = await supabase
      .from("custom_topics")
      .select("title")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("position", { ascending: true })
      .limit(3)

    if (!error && projects) {
      topics = projects.map((p) => p.title).filter(Boolean)
    }
  }

  if (topics.length === 0) {
    topics = ["Global Finance News"]
  }

  const query = `${topics.join(" ")} finance news today`

  try {
    const response = await tvly.search(query, {
      topic: "news",
      days: 1, // dernières 24h
      include_images: false,
      include_answer: false,
      max_results: 12,
      search_depth: "advanced",
    })

    const news =
      response?.results?.map((result: any) => {
        const published =
          result.published_date ||
          result.isoDate ||
          result.pubDate ||
          result.date ||
          new Date().toISOString()

        return {
          title: result.title || "Sans titre",
          url: result.url || "",
          source: extractSource(result.url || ""),
          published_at: new Date(published).toISOString(),
        }
      }) ?? []

    const filtered = news.filter((n) => n.title && n.url)

    return NextResponse.json({ news: filtered })
  } catch (error) {
    console.error("[LiveNews] Erreur Tavily:", error)
    return NextResponse.json({ news: [] })
  }
}



