"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Loader2, Radio, RefreshCw } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { LiveNewsItem } from "@/app/actions/live-news"
import { useToast } from "@/hooks/use-toast"
import { useLiveFeed, type ExtendedLiveNewsItem } from "@/contexts/LiveFeedContext"

// Interface pour la configuration du Live Feed
interface LiveFeedConfig {
  refreshRate: number // en millisecondes
  maxItems: number
  autoRefresh: boolean
  categories: string[]
}

// Configuration par défaut
const DEFAULT_CONFIG: LiveFeedConfig = {
  refreshRate: 900000, // 15 minutes (900 secondes * 1000)
  maxItems: 15, // Afficher au minimum 10-15 articles
  autoRefresh: true,
  categories: [], // Toutes les catégories par défaut
}

const STORAGE_KEY = "newsflow_feed_config"

// Fallback news réalistes en cas d'échec de l'API
const FALLBACK_NEWS: LiveNewsItem[] = [
  {
    url: "https://www.bloomberg.com",
    title: "Global Macro : les desks restent prudents avant le NFP",
    source: "Bloomberg",
    published_date: new Date(Date.now() - 30 * 60000).toISOString(),
    snippet: "",
  },
  {
    url: "https://www.reuters.com",
    title: "FX : l'EUR/USD oscille autour de 1.08 avant les données US",
    source: "Reuters",
    published_date: new Date(Date.now() - 60 * 60000).toISOString(),
    snippet: "",
  },
  {
    url: "https://www.ft.com",
    title: "Tech : les mégacaps prolongent le rallye malgré la hausse des rendements",
    source: "Financial Times",
    published_date: new Date(Date.now() - 90 * 60000).toISOString(),
    snippet: "",
  },
]

type ApiNewsItem = {
  title: string
  url: string
  source?: string
  published_at?: string
  published_date?: string
  snippet?: string
}

export function LiveFeed() {
  const { news, addNews } = useLiveFeed() // Utiliser le Context pour persister les news
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [config, setConfig] = useState<LiveFeedConfig>(DEFAULT_CONFIG)
  const [timeKey, setTimeKey] = useState(0) // Pour forcer le re-render des timestamps
  const [error, setError] = useState<string | null>(null) // État pour les erreurs non-bloquantes
  const [isHovering, setIsHovering] = useState(false) // Pause du ticker au survol
  const { toast } = useToast()
  const supabase = createClient()

  // Récupérer les news live via l'API interne (Tavily + custom_topics)
  const fetchLiveNews = useCallback(async (): Promise<LiveNewsItem[]> => {
    try {
      const res = await fetch("/api/get-live-news")
      if (!res.ok) {
        console.warn("[LiveFeed] ⚠️ API live news non OK:", res.status)
        return FALLBACK_NEWS
      }

      const data = await res.json()
      const items: ApiNewsItem[] = Array.isArray(data?.news) ? data.news : []

      if (items.length === 0) {
        console.warn("[LiveFeed] ⚠️ API live news vide - fallback")
        return FALLBACK_NEWS
      }

      const mapped: LiveNewsItem[] = items
        .map((item) => ({
          url: item.url || "",
          title: item.title || "Sans titre",
          source: item.source || "source",
          published_date: item.published_at || item.published_date || new Date().toISOString(),
          snippet: item.snippet || "",
        }))
        .filter((n) => n.url && n.title)

      return mapped.length > 0 ? mapped : FALLBACK_NEWS
    } catch (error) {
      console.warn("[LiveFeed] ⚠️ Erreur API live news - fallback:", error)
      return FALLBACK_NEWS
    }
  }, [])

  // Définition de loadNews AVANT les useEffect qui l'utilisent (fail-safe)
  const loadNews = useCallback(async (isRefresh = false) => {
    console.log("[LiveFeed] Chargement des news...", { isRefresh })
    
    // Réinitialiser l'erreur au début du chargement
    setError(null)
    
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    try {
      const items = await fetchLiveNews()
      console.log("[LiveFeed] News live récupérées:", items?.length || 0, "articles")

      setError(null)

      if (isRefresh) {
        addNews(items)
      } else {
        if (news.length === 0) {
          addNews(items)
        }
      }
    } catch (error: any) {
      console.warn("[LiveFeed] ⚠️ Erreur inattendue - fallback:", error)
      setError(null)
      if (news.length === 0) {
        addNews(FALLBACK_NEWS)
      }
    } finally {
      // CRUCIAL : On arrête le chargement quoi qu'il arrive
      console.log("[LiveFeed] Fin du chargement")
      if (isRefresh) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }, [addNews, fetchLiveNews])

  // Gestion de l'hydratation Next.js
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Chargement de la configuration depuis Supabase au montage
  useEffect(() => {
    if (!isMounted) return

    const loadConfigFromDB = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          // Pas d'utilisateur connecté, utiliser la config par défaut
          return
        }

        const { data, error } = await supabase
          .from("live_feed_settings")
          .select("refresh_rate, auto_refresh")
          .eq("user_id", user.id)
          .single()

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows returned, ce qui est OK (première utilisation)
          console.warn("[LiveFeed] Erreur lors du chargement de la config:", error)
          return
        }

        if (data) {
          setConfig((prev) => {
            const updates: Partial<LiveFeedConfig> = {}
            
            // Convertir refresh_rate (en secondes) en millisecondes pour refreshRate
            if (data.refresh_rate !== undefined) {
              updates.refreshRate = data.refresh_rate * 1000
            }
            
            // Mettre à jour auto_refresh
            if (data.auto_refresh !== undefined) {
              updates.autoRefresh = data.auto_refresh
            }
            
            return { ...prev, ...updates }
          })
        }
      } catch (error) {
        console.warn("[LiveFeed] Erreur lors du chargement de la config depuis la DB:", error)
        // Fallback sur localStorage si erreur
        try {
          const savedConfig = localStorage.getItem(STORAGE_KEY)
          if (savedConfig) {
            const parsed = JSON.parse(savedConfig)
            setConfig({ ...DEFAULT_CONFIG, ...parsed })
          }
        } catch (localError) {
          console.warn("[LiveFeed] Erreur lors du chargement depuis localStorage:", localError)
        }
      }
    }

    loadConfigFromDB()
  }, [isMounted, supabase])

  // Écouter les changements de paramètres en temps réel via Supabase Realtime
  useEffect(() => {
    if (!isMounted) return

    let channel: ReturnType<typeof supabase.channel> | null = null

    const setupRealtimeListener = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel("live_feed_settings_changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "live_feed_settings",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setConfig((prev) => {
              const updates: Partial<LiveFeedConfig> = {}
              
              if (payload.new.refresh_rate !== undefined) {
                updates.refreshRate = payload.new.refresh_rate * 1000
              }
              
              if (payload.new.auto_refresh !== undefined) {
                updates.autoRefresh = payload.new.auto_refresh
              }
              
              return { ...prev, ...updates }
            })
          }
        )
        .subscribe()
    }

    setupRealtimeListener()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [isMounted, supabase])

  // Rafraîchissement automatique si activé
  useEffect(() => {
    if (!isMounted || !config.autoRefresh) return

    const interval = setInterval(() => {
      loadNews(true)
    }, config.refreshRate)

    return () => clearInterval(interval)
  }, [isMounted, config.autoRefresh, config.refreshRate, loadNews])

  useEffect(() => {
    if (isMounted) {
      console.log("[LiveFeed] useEffect: Appel de loadNews au montage")
      loadNews()
    }
  }, [isMounted, loadNews])


  // Fonction pour mettre à jour la configuration avec feedback
  const updateConfig = (newConfig: Partial<LiveFeedConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig }
      // Afficher un toast de confirmation
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos préférences ont été enregistrées",
        duration: 2000,
      })
      return updated
    })
  }

  // Fonction pour formater le temps relatif (utilise published_date de l'article)
  const formatTimeAgo = useCallback((publishedDate: string) => {
    try {
      const published = new Date(publishedDate)
      const now = new Date()
      const diffMs = now.getTime() - published.getTime()
      
      if (diffMs < 0) return "À l'instant"
      
      const diffMins = Math.floor(diffMs / 60000)
      
      if (diffMins < 1) return "À l'instant"
      if (diffMins < 60) return `Il y a ${diffMins} min`
      
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) return `Il y a ${diffHours} h`
      
      const diffDays = Math.floor(diffHours / 24)
      return `Il y a ${diffDays} j`
    } catch (error) {
      console.error("[LiveFeed] Erreur formatage date:", error)
      return "Récemment"
    }
  }, [])

  // Intervalle pour mettre à jour les timestamps relatifs toutes les minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeKey((prev) => prev + 1) // Force le re-render
    }, 60000) // Toutes les 60 secondes

    return () => clearInterval(interval)
  }, [])

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
    <div className="flex flex-col h-[calc(100vh-120px)] bg-zinc-900/50 rounded-xl border border-white/5 overflow-hidden relative">
      {/* 1. Header fixe */}
      <div className="flex-none p-4 border-b border-white/5 bg-zinc-900/80 backdrop-blur-sm z-20 flex justify-between items-center">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          Live Feed
        </h3>
        <button
          onClick={() => window.location.reload()}
          className="text-[10px] bg-white/5 hover:bg-white/10 text-zinc-400 px-2 py-1 rounded transition-colors"
        >
          Actualiser
        </button>
      </div>

      {/* 2. Liste scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }
        `}</style>
        {news.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-sm">Aucune actualité récente disponible</div>
        ) : (
          news.map((item) => (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group"
            >
              <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white leading-snug line-clamp-2">
                {item.title}
              </h4>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-500">
                <span className={`text-indigo-400 font-medium ${getSourceColor(item.source)}`}>{item.source}</span>
                <span>•</span>
                <span>{formatTimeAgo(item.published_date)}</span>
                <ExternalLink className="h-3 w-3 text-zinc-600 ml-auto" />
              </div>
            </motion.a>
          ))
        )}
      </div>
    </div>
  )
}

