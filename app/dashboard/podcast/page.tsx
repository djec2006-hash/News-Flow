"use client"

import { motion } from "framer-motion"
import { Lock, Play, Pause, SkipForward, Volume2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Données fictives pour l'interface floutée
const fakeEpisodes = [
  { title: "Analyse S&P 500 - Matinée", duration: "12 min", date: "Aujourd'hui" },
  { title: "Crypto Daily - Bitcoin & Ethereum", duration: "8 min", date: "Hier" },
  { title: "Forex Weekly - EUR/USD Focus", duration: "15 min", date: "Il y a 2 jours" },
  { title: "Marchés Asiatiques - Synthèse", duration: "10 min", date: "Il y a 3 jours" },
  { title: "Régulation Crypto Europe", duration: "18 min", date: "Il y a 4 jours" },
]

// Composant Waveform animée (fausse)
function FakeWaveform() {
  const bars = Array.from({ length: 60 }, (_, i) => ({
    height: Math.random() * 60 + 20,
    delay: i * 0.05,
  }))

  return (
    <div className="flex items-end justify-center gap-1 h-32">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500"
          initial={{ height: 20 }}
          animate={{
            height: [bar.height, bar.height * 0.6, bar.height],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: bar.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export default function PodcastPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-zinc-950 overflow-hidden">
      {/* ========== ARRIÈRE-PLAN : FAUSSE INTERFACE FLOUTÉE ========== */}
      <div className="absolute inset-0 blur-lg opacity-30 pointer-events-none">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Live Podcast</h2>
              <p className="text-zinc-400">Vos Flows transformés en audio</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-sm">
                En direct
              </div>
            </div>
          </div>

          {/* Waveform principale */}
          <div className="bg-zinc-900/50 rounded-2xl p-8 border border-white/10">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Analyse S&P 500 - Matinée</h3>
              <p className="text-zinc-400 text-sm">12 min • Généré il y a 2 heures</p>
            </div>
            <FakeWaveform />
            
            {/* Contrôles de lecture */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <SkipForward className="h-5 w-5 text-white rotate-180" />
              </button>
              <button className="p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 transition-all">
                <Play className="h-6 w-6 text-white ml-0.5" />
              </button>
              <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <SkipForward className="h-5 w-5 text-white" />
              </button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <Volume2 className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">x1.5</span>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mt-6">
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-1/3 rounded-full" />
              </div>
              <div className="flex justify-between mt-2 text-xs text-zinc-500">
                <span>4:23</span>
                <span>12:00</span>
              </div>
            </div>
          </div>

          {/* Liste des épisodes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Derniers épisodes</h3>
            <div className="space-y-3">
              {fakeEpisodes.map((episode, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/50 border border-white/10 hover:bg-zinc-900/70 transition-colors"
                >
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                    <Play className="h-6 w-6 text-indigo-400 ml-0.5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{episode.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {episode.duration}
                      </span>
                      <span>•</span>
                      <span>{episode.date}</span>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Play className="h-4 w-4 text-zinc-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/10">
              <p className="text-2xl font-bold text-white mb-1">24</p>
              <p className="text-xs text-zinc-400">Épisodes générés</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/10">
              <p className="text-2xl font-bold text-white mb-1">3.2h</p>
              <p className="text-xs text-zinc-400">Contenu audio</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/10">
              <p className="text-2xl font-bold text-white mb-1">12</p>
              <p className="text-xs text-zinc-400">Flows convertis</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== AVANT-PLAN : OVERLAY DE VERROUILLAGE ========== */}
      <div className="relative z-50 flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md mx-auto text-center space-y-6"
        >
          {/* Icône Cadenas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative flex items-center justify-center"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl rounded-full" />
            
            {/* Cercle avec cadenas */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-2 border-indigo-500/30 flex items-center justify-center backdrop-blur-sm">
              <Lock className="h-12 w-12 text-indigo-400" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Live Podcast <span className="text-zinc-500">(Bientôt)</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              L'IA apprend à parler. Génération audio en cours de calibrage...
            </p>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 px-4 py-1.5 text-sm font-medium">
              Disponible Q1 2026
            </Badge>
          </motion.div>

          {/* Message supplémentaire */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="pt-4"
          >
            <p className="text-sm text-zinc-500 italic">
              "Transformez vos Flows en podcasts audio ultra-réalistes"
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Overlay sombre supplémentaire pour renforcer l'effet de verrouillage */}
      <div className="absolute inset-0 bg-zinc-950/40 pointer-events-none z-40" />
    </div>
  )
}
