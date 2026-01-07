"use client"

import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface FlowGenerationLoaderProps {
  phase: "enhancing" | "generating" | "finalizing" | "idle"
}

export function FlowGenerationLoader({ phase }: FlowGenerationLoaderProps) {
  const getPhaseConfig = () => {
    switch (phase) {
      case "enhancing":
        return {
          title: "Optimisation de votre demande",
          subtitle: "L'IA enrichit votre instruction pour maximiser la pertinence...",
          icon: "🧠",
          progress: 20,
        }
      case "generating":
        return {
          title: "Analyse des marchés en cours",
          subtitle: "Recherche multi-sources et génération des sections...",
          icon: "⚡",
          progress: 60,
        }
      case "finalizing":
        return {
          title: "Finalisation",
          subtitle: "Assemblage du Flow et sauvegarde...",
          icon: "✨",
          progress: 90,
        }
      default:
        return {
          title: "Préparation",
          subtitle: "Initialisation...",
          icon: "🚀",
          progress: 0,
        }
    }
  }

  const config = getPhaseConfig()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl p-8"
    >
      {/* Effet de brillance animé */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent animate-pulse" />

      <div className="relative z-10 space-y-6">
        {/* Header avec icône */}
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="flex-shrink-0"
          >
            <Loader2 className="h-8 w-8 text-indigo-400" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
              <span>{config.icon}</span>
              {config.title}
            </h3>
            <p className="text-sm text-zinc-400">{config.subtitle}</p>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${config.progress}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Progression</span>
            <span className="font-mono">{config.progress}%</span>
          </div>
        </div>

        {/* Skeleton du contenu Bloomberg-style */}
        <div className="space-y-4 pt-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                {/* Titre de section skeleton */}
                <div className="h-6 bg-zinc-800/50 rounded w-2/3 animate-pulse" />
                {/* Lignes de texte skeleton */}
                <div className="space-y-2 pl-4">
                  <div className="h-4 bg-zinc-800/30 rounded w-full animate-pulse" />
                  <div className="h-4 bg-zinc-800/30 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-zinc-800/30 rounded w-4/6 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer avec temps estimé */}
        <div className="pt-4 border-t border-white/5">
          <p className="text-xs text-zinc-500 text-center">
            ⏱️ Temps estimé : 10-15 secondes • {" "}
            <span className="text-indigo-400">Ne fermez pas cette page</span>
          </p>
        </div>
      </div>
    </motion.div>
  )
}

