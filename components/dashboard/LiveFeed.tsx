"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Loader2, Radio, RefreshCw } from "lucide-react"
import { getLiveNews, type LiveNewsItem } from "@/app/actions/live-news"
import { createClient } from "@/lib/supabase/client"

export function LiveFeed() {
  const [news, setNews] = useState<LiveNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    try {
      // Récupérer l'userId pour personnaliser le flux
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const items = await getLiveNews(user?.id)
      setNews(items)
    } catch (error) {
      console.error("Failed to load live news:", error)
    } finally {
      if (isRefresh) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  // Calcule le temps relatif
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 60) {
      return `il y a ${diffMins} min`
    } else if (diffHours < 24) {
      return `il y a ${diffHours}h`
    } else {
      return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
    }
  }

  // Couleur de la source
  const getSourceColor = (source: string) => {
    const colorMap: Record<string, string> = {
      "Bloomberg": "text-orange-400",
      "Reuters": "text-red-400",
      "CNBC": "text-blue-400",
      "Financial Times": "text-pink-400",
      "Wall Street Journal": "text-purple-400",
      "Les Échos": "text-rose-400",
      "Le Monde": "text-cyan-400",
      "CoinDesk": "text-yellow-400",
      "TechCrunch": "text-green-400",
      "The Economist": "text-red-500",
    }
    return colorMap[source] || "text-indigo-400"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header - Fixe */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        <Radio className="h-4 w-4 text-red-500 animate-pulse" />
        <h3 className="text-lg font-bold text-white">Live Feed</h3>
        <span className="text-xs text-zinc-500">Dernières 24h</span>
      </div>

      {/* Liste des news - Scrollable optimisée */}
      {news.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-sm">
          Aucune actualité récente disponible
        </div>
      ) : (
        <div 
          className="space-y-2 overflow-y-auto overscroll-contain pr-2 flex-1 max-h-[400px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent hover:scrollbar-thumb-zinc-600"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#3f3f46 transparent'
          }}
        >
          {news.map((item, index) => (
            <motion.a
              key={`${item.url}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group block relative overflow-hidden rounded-xl border border-white/5 bg-zinc-900/40 backdrop-blur-sm p-4 hover:bg-white/5 hover:border-indigo-500/30 transition-all duration-300"
            >
              {/* Ligne d'accentuation qui apparaît au hover */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

              <div className="relative z-10 pl-2">
                {/* Titre */}
                <h4 className="text-white font-medium text-sm mb-2 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h4>

                {/* Métadonnées */}
                <div className="flex items-center gap-3 text-xs">
                  <span className={`font-bold ${getSourceColor(item.source)}`}>
                    {item.source}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-500">{getRelativeTime(item.published_date)}</span>
                  <ExternalLink className="h-3 w-3 text-zinc-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all ml-auto" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {/* Bouton refresh - Fixe en bas */}
      <motion.button
        onClick={() => loadNews(true)}
        disabled={refreshing}
        whileHover={{ scale: refreshing ? 1 : 1.02 }}
        whileTap={{ scale: refreshing ? 1 : 0.98 }}
        className={`w-full mt-4 py-2 text-xs transition-colors flex-shrink-0 flex items-center justify-center gap-2 ${
          refreshing ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-500 hover:text-indigo-400'
        }`}
      >
        <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
        {refreshing ? 'Actualisation...' : 'Actualiser'}
      </motion.button>
    </div>
  )
}

