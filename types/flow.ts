export type Sentiment = "bullish" | "bearish" | "neutral"

export interface FlowSection {
  title: string
  content: string // Markdown/HTML structuré
  sentiment: Sentiment
  key_figures?: string[]
  sources?: string[]
}

export interface GeneratedFlow {
  id?: string
  summary: string
  sections: FlowSection[]
  sources: string[] // domaines ou URLs
  created_at: string
  key_events?: string[]
  topics_covered?: string
  main_image_url?: string
}

