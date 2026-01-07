"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { LiveNewsItem } from "@/app/actions/live-news"

// Étendre le type pour inclure un timestamp réel
export interface ExtendedLiveNewsItem extends LiveNewsItem {
  timestamp: number // Date.now() au moment de l'ajout
  id: string // ID unique pour la key
}

interface LiveFeedContextType {
  news: ExtendedLiveNewsItem[]
  setNews: React.Dispatch<React.SetStateAction<ExtendedLiveNewsItem[]>>
  addNews: (items: LiveNewsItem[]) => void
  clearNews: () => void
}

const LiveFeedContext = createContext<LiveFeedContextType | undefined>(undefined)

export function LiveFeedProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<ExtendedLiveNewsItem[]>([])

  // Fonction pour créer un ID unique
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Fonction pour ajouter des nouvelles news (évite les doublons)
  const addNews = (items: LiveNewsItem[]) => {
    setNews((prev) => {
      const existingUrls = new Set(prev.map((item) => item.url))
      const newItems = items
        .filter((item) => !existingUrls.has(item.url))
        .map((item) => ({
          ...item,
          timestamp: Date.now(),
          id: generateId(),
        }))
      
      // Limiter à 100 articles maximum
      const combined = [...newItems, ...prev]
      return combined.slice(0, 100)
    })
  }

  // Fonction pour vider la liste (optionnel)
  const clearNews = () => {
    setNews([])
  }

  return (
    <LiveFeedContext.Provider value={{ news, setNews, addNews, clearNews }}>
      {children}
    </LiveFeedContext.Provider>
  )
}

export function useLiveFeed() {
  const context = useContext(LiveFeedContext)
  if (context === undefined) {
    throw new Error("useLiveFeed must be used within a LiveFeedProvider")
  }
  return context
}




