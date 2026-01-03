"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Loader2, Radio, RefreshCw } from "lucide-react"
import { getLiveNews, type LiveNewsItem } from "@/app/actions/live-news"
import { createClient } from "@/lib/supabase/client"
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

export function LiveFeed() {
  const { news, addNews } = useLiveFeed() // Utiliser le Context pour persister les news
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [config, setConfig] = useState<LiveFeedConfig>(DEFAULT_CONFIG)
  const [timeKey, setTimeKey] = useState(0) // Pour forcer le re-render des timestamps
  const { toast } = useToast()
  const supabase = createClient()

  // Définition de loadNews AVANT les useEffect qui l'utilisent
  const loadNews = useCallback(async (isRefresh = false) => {
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
      
      if (isRefresh) {
        // Mode refresh : ajouter les nouveaux articles (le Context gère les doublons)
        addNews(items)
      } else {
        // Premier chargement : seulement si la liste est vide
        if (news.length === 0) {
          addNews(items)
        }
      }
    } catch (error) {
      console.error("Failed to load live news:", error)
    } finally {
      if (isRefresh) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }, [addNews, news.length])

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
          .select("refresh_rate")
          .eq("user_id", user.id)
          .single()

        if (error && error.code !== "PGRST116") {
          // PGRST116 = no rows returned, ce qui est OK (première utilisation)
          console.warn("[LiveFeed] Erreur lors du chargement de la config:", error)
          return
        }

        if (data && data.refresh_rate) {
          // Convertir refresh_rate (en secondes) en millisecondes pour refreshRate
          const refreshRateMs = data.refresh_rate * 1000
          setConfig((prev) => ({
            ...prev,
            refreshRate: refreshRateMs,
          }))
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
            if (payload.new.refresh_rate) {
              const refreshRateMs = payload.new.refresh_rate * 1000
              setConfig((prev) => ({
                ...prev,
                refreshRate: refreshRateMs,
              }))
            }
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
      loadNews()
    }
  }, [isMounted, loadNews])

  // Simulation : ajouter une fausse news toutes les 5-10 secondes (pour tester)
  useEffect(() => {
    if (!isMounted || loading) return

    const fakeSources = ["CNBC", "Reuters", "Bloomberg", "Financial Times", "TechCrunch"]
    const fakeTitles = [
      "Nouvelle actualité financière importante",
      "Développement technologique majeur annoncé",
      "Mouvement sur les marchés internationaux",
      "Actualité géopolitique en développement",
      "Innovation majeure dans le secteur tech",
      "Tendances économiques à surveiller",
      "Actualité cryptomonnaie en temps réel",
    ]

    const addFakeNews = () => {
      const randomSource = fakeSources[Math.floor(Math.random() * fakeSources.length)]
      const randomTitle = fakeTitles[Math.floor(Math.random() * fakeTitles.length)]

      const fakeItem: LiveNewsItem = {
        url: `https://example.com/news-${Date.now()}`,
        title: randomTitle,
        source: randomSource,
        published_date: new Date().toISOString(),
        snippet: "",
      }

      // Utiliser addNews du Context (gère les doublons automatiquement)
      addNews([fakeItem])
    }

    // Intervalle aléatoire entre 5 et 10 secondes
    const getRandomInterval = () => 5000 + Math.random() * 5000
    let timeoutId: NodeJS.Timeout

    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        addFakeNews()
        scheduleNext()
      }, getRandomInterval())
    }

    scheduleNext()

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isMounted, loading, addNews])

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

  // Fonction pour formater le temps relatif (utilise timestamp réel)
  const formatTimeAgo = useCallback((timestamp: number) => {
    const now = Date.now()
    const diffMs = now - timestamp
    
    if (diffMs < 0) return "À l'instant"
    
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return "À l'instant"
    if (diffMins < 60) return `Il y a ${diffMins} min`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `Il y a ${diffHours} h`
    
    const diffDays = Math.floor(diffHours / 24)
    return `Il y a ${diffDays} j`
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
    <div className="flex flex-col h-full min-h-0">
      {/* Header - Fixe */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-red-500 animate-pulse" />
          <h3 className="text-lg font-bold text-white">Live Feed</h3>
        </div>
        <span className="text-xs text-zinc-500">Dernières 24h</span>
      </div>

      {/* Liste des news - Scrollable avec hauteur fixe */}
      {news.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-sm flex-grow flex items-center justify-center">
          Aucune actualité récente disponible
        </div>
      ) : (
        <div 
          className="space-y-2 overflow-y-auto overscroll-contain pr-2 min-h-0 max-h-[500px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent hover:scrollbar-thumb-zinc-600"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#3f3f46 transparent'
          }}
        >
          {news.map((item) => (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
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
                  <span className="text-zinc-500">{formatTimeAgo(item.timestamp)}</span>
                  <ExternalLink className="h-3 w-3 text-zinc-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all ml-auto" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {/* Bouton refresh - Fixe en bas */}
      <motion.button
        onClick={() => {
          loadNews(true)
          if (isMounted) {
            toast({
              title: "Actualisation",
              description: "Flux mis à jour",
              duration: 2000,
            })
          }
        }}
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

