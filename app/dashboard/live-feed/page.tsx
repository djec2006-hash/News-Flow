"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, Settings2, Loader2, Check, Radio } from "lucide-react"

// Domaines disponibles pour le mode custom
const AVAILABLE_DOMAINS = [
  { id: "finance", label: "Finance", color: "from-green-400 to-emerald-600" },
  { id: "crypto", label: "Crypto", color: "from-orange-400 to-yellow-600" },
  { id: "geopolitics", label: "Géopolitique", color: "from-red-400 to-pink-600" },
  { id: "tech", label: "Tech", color: "from-blue-400 to-cyan-600" },
  { id: "sport", label: "Sport", color: "from-purple-400 to-indigo-600" },
  { id: "health", label: "Santé", color: "from-teal-400 to-green-600" },
  { id: "environment", label: "Environnement", color: "from-lime-400 to-emerald-600" },
  { id: "culture", label: "Culture", color: "from-pink-400 to-rose-600" },
]

export default function LiveFeedConfigPage() {
  const [mode, setMode] = useState<"auto" | "custom">("auto")
  const [customDomains, setCustomDomains] = useState<string[]>([])
  const [customInstructions, setCustomInstructions] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  // Charger les settings existants
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("live_feed_settings")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned
        console.error("Error loading settings:", error)
        return
      }

      if (data) {
        setMode(data.mode as "auto" | "custom")
        setCustomDomains(data.custom_domains || [])
        setCustomInstructions(data.custom_instructions || "")
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const settings = {
        user_id: user.id,
        mode,
        custom_domains: mode === "custom" ? customDomains : [],
        custom_instructions: mode === "custom" ? customInstructions : null,
      }

      const { error } = await supabase.from("live_feed_settings").upsert(settings, {
        onConflict: "user_id",
      })

      if (error) throw error

      toast({
        title: "✅ Sauvegardé !",
        description: "Votre configuration du Live Feed a été mise à jour.",
      })
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder les paramètres.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleDomain = (domainId: string) => {
    setCustomDomains((prev) =>
      prev.includes(domainId) ? prev.filter((id) => id !== domainId) : [...prev, domainId],
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
            <Radio className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Configuration du Flux</h1>
            <p className="text-zinc-400">Personnalisez la génération de votre Live Feed</p>
          </div>
        </div>
      </motion.div>

      {/* Mode Selection Cards */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* OPTION A: AUTO PILOT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={() => setMode("auto")}
          className={`relative cursor-pointer overflow-hidden rounded-3xl border p-8 transition-all duration-300 ${
            mode === "auto"
              ? "border-indigo-500 bg-indigo-500/5 shadow-lg shadow-indigo-500/20"
              : "border-white/5 bg-zinc-900/40 hover:border-white/10"
          }`}
        >
          {/* Glow Effect */}
          {mode === "auto" && (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
          )}

          <div className="relative z-10">
            {/* Icon avec animation pulse */}
            <motion.div
              animate={mode === "auto" ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${
                mode === "auto" ? "bg-indigo-500/20" : "bg-zinc-800"
              }`}
            >
              <Sparkles className={`h-8 w-8 ${mode === "auto" ? "text-indigo-400" : "text-zinc-500"}`} />
            </motion.div>

            {/* Titre */}
            <h3 className="text-2xl font-bold text-white mb-2">Intelligence Artificielle</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              L'IA analyse vos projets actuels et votre profil pour dénicher les news pertinentes automatiquement.
            </p>

            {/* Checkbox visual indicator */}
            {mode === "auto" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500"
              >
                <Check className="h-5 w-5 text-white" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* OPTION B: CUSTOM */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={() => setMode("custom")}
          className={`relative cursor-pointer overflow-hidden rounded-3xl border p-8 transition-all duration-300 ${
            mode === "custom"
              ? "border-purple-500 bg-purple-500/5 shadow-lg shadow-purple-500/20"
              : "border-white/5 bg-zinc-900/40 hover:border-white/10"
          }`}
        >
          {/* Glow Effect */}
          {mode === "custom" && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent" />
          )}

          <div className="relative z-10">
            {/* Icon */}
            <div
              className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${
                mode === "custom" ? "bg-purple-500/20" : "bg-zinc-800"
              }`}
            >
              <Settings2 className={`h-8 w-8 ${mode === "custom" ? "text-purple-400" : "text-zinc-500"}`} />
            </div>

            {/* Titre */}
            <h3 className="text-2xl font-bold text-white mb-2">Configuration Manuelle</h3>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Définissez vos propres règles de veille avec des domaines spécifiques et des instructions sur-mesure.
            </p>

            {/* Checkbox visual indicator */}
            {mode === "custom" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-6 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-purple-500"
              >
                <Check className="h-5 w-5 text-white" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Custom Mode Content */}
      <AnimatePresence mode="wait">
        {mode === "custom" && (
          <motion.div
            key="custom-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl p-8 mb-8">
              {/* Domaines */}
              <div className="mb-8">
                <h4 className="text-xl font-bold text-white mb-4">Domaines d'intérêt</h4>
                <p className="text-sm text-zinc-400 mb-6">Sélectionnez les domaines que vous souhaitez suivre</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVAILABLE_DOMAINS.map((domain) => {
                    const isSelected = customDomains.includes(domain.id)
                    return (
                      <motion.button
                        key={domain.id}
                        onClick={() => toggleDomain(domain.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative overflow-hidden rounded-xl p-4 text-sm font-medium transition-all ${
                          isSelected
                            ? "border-2 border-white/20 bg-gradient-to-br shadow-lg"
                            : "border border-white/5 bg-zinc-800/50 text-zinc-400 hover:border-white/10"
                        }`}
                        style={
                          isSelected
                            ? {
                                backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                                "--tw-gradient-from": domain.color.split(" ")[1],
                                "--tw-gradient-to": domain.color.split(" ")[3],
                              }
                            : undefined
                        }
                      >
                        <span className={isSelected ? "text-white" : ""}>{domain.label}</span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white/20"
                          >
                            <Check className="h-3 w-3 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="text-xl font-bold text-white mb-4">Instructions spécifiques</h4>
                <p className="text-sm text-zinc-400 mb-4">
                  Affinez la recherche avec vos propres critères (optionnel)
                </p>

                <Textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Ex: Je veux uniquement des news sur les fusions-acquisitions en Asie, ou sur les startups européennes qui lèvent plus de 10M€..."
                  rows={4}
                  className="w-full rounded-xl bg-zinc-950/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-purple-500/50 focus:ring-purple-500/50 resize-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-end">
        <motion.div whileTap={{ scale: 0.98 }} className="relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-50 animate-pulse" />
          <Button
            onClick={handleSave}
            disabled={saving}
            size="lg"
            className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl px-8 py-6 shadow-lg shadow-indigo-500/20"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Check className="mr-2 h-5 w-5" />
                Sauvegarder les préférences
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}



