"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Activity, Sparkles, Settings2, X, Loader2, Check, AlertCircle, Save } from "lucide-react"
import { updateLiveFeedSettings, getLiveFeedSettings } from "@/app/actions/update-live-feed-settings"

// Options de rythme de diffusion
const REFRESH_RATE_OPTIONS = [
  { value: 120, label: "Mode Zen", description: "Toutes les 2 min", color: "emerald" },
  { value: 60, label: "Normal", description: "Toutes les 60 sec", color: "blue" },
  { value: 30, label: "Intensif", description: "Toutes les 30 sec", color: "orange" },
  { value: 10, label: "Temps réel", description: "Toutes les 10 sec", color: "red", warning: "Déconseillé" },
]

type LiveFeedSettings = {
  mode: "auto" | "manual"
  refresh_rate: number
  auto_refresh: boolean
  allowed_domains: string[]
  required_keywords: string[]
}

export default function LiveFeedConfigPage() {
  const [settings, setSettings] = useState<LiveFeedSettings>({
    mode: "auto",
    refresh_rate: 900,
    auto_refresh: true,
    allowed_domains: [],
    required_keywords: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [domainInput, setDomainInput] = useState("")
  const [keywordInput, setKeywordInput] = useState("")
  const { toast } = useToast()
  const supabase = createClient()

  // Charger les settings existants
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await getLiveFeedSettings()

      if (data) {
        setSettings({
          mode: data.mode === "custom" ? "manual" : "auto",
          refresh_rate: data.refresh_rate || 900,
          auto_refresh: data.auto_refresh !== undefined ? data.auto_refresh : true,
          allowed_domains: data.custom_domains || [],
          required_keywords: data.custom_instructions
            ? data.custom_instructions.split(",").map((k: string) => k.trim()).filter(Boolean)
            : [],
        })
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      setLoading(false)
    }
  }

  // Sauvegarde explicite avec bouton
  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      const settingsToSave = {
        mode: settings.mode === "manual" ? "custom" : "auto",
        refresh_rate: settings.refresh_rate,
        auto_refresh: settings.auto_refresh,
        custom_domains: settings.mode === "manual" ? settings.allowed_domains : [],
        custom_instructions:
          settings.mode === "manual" && settings.required_keywords.length > 0
            ? settings.required_keywords.join(", ")
            : undefined,
      }

      const result = await updateLiveFeedSettings(settingsToSave)

      if (result.success) {
        setHasUnsavedChanges(false)
        toast({
          title: "✅ Sauvegardé",
          description: result.message,
          duration: 3000,
        })
      } else {
        toast({
          title: "❌ Erreur",
          description: result.message,
          variant: "destructive",
        })
      }
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

  // Mettre à jour les settings localement (sans sauvegarde automatique)
  const updateSettings = useCallback(
    (updates: Partial<LiveFeedSettings>) => {
      setSettings((prevSettings) => {
        const newSettings = { ...prevSettings, ...updates }
        setHasUnsavedChanges(true)
        return newSettings
      })
    },
    []
  )

  // Ajouter un domaine
  const addDomain = () => {
    const domain = domainInput.trim().toLowerCase()
    if (domain && !settings.allowed_domains.includes(domain)) {
      updateSettings({
        allowed_domains: [...settings.allowed_domains, domain],
      })
      setDomainInput("")
    }
  }

  // Supprimer un domaine
  const removeDomain = (domain: string) => {
    updateSettings({
      allowed_domains: settings.allowed_domains.filter((d) => d !== domain),
    })
  }

  // Ajouter un mot-clé
  const addKeyword = () => {
    const keyword = keywordInput.trim()
    if (keyword && !settings.required_keywords.includes(keyword)) {
      updateSettings({
        required_keywords: [...settings.required_keywords, keyword],
      })
      setKeywordInput("")
    }
  }

  // Supprimer un mot-clé
  const removeKeyword = (keyword: string) => {
    updateSettings({
      required_keywords: settings.required_keywords.filter((k) => k !== keyword),
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Activity className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Configuration Live Feed</h1>
            <p className="text-zinc-400">Personnalisez votre flux d'actualités en temps réel</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-sm text-amber-400">
              <AlertCircle className="h-4 w-4" />
              <span>Modifications non sauvegardées</span>
            </div>
          )}
          <Button
            onClick={handleSaveSettings}
            disabled={saving || !hasUnsavedChanges}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder les préférences
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* SECTION A : MODE DE PILOTAGE */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-xl">Mode de pilotage</CardTitle>
            <CardDescription className="text-zinc-400">
              Choisissez comment NewsFlow sélectionne les actualités pour vous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Mode Auto */}
              <motion.div
                onClick={() => updateSettings({ mode: "auto" })}
                className={`relative cursor-pointer overflow-hidden rounded-xl border p-6 transition-all duration-300 ${
                  settings.mode === "auto"
                    ? "border-indigo-500/50 bg-indigo-500/5 shadow-lg shadow-indigo-500/10"
                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                }`}
              >
                {settings.mode === "auto" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
                )}
                <div className="relative z-10">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                      settings.mode === "auto" ? "bg-indigo-500/20" : "bg-zinc-800"
                    }`}
                  >
                    <Sparkles className={`h-6 w-6 ${settings.mode === "auto" ? "text-indigo-400" : "text-zinc-500"}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Mode Auto (IA)</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Laissez NewsFlow sélectionner les meilleures actus pour vous basées sur vos projets.
                  </p>
                  {settings.mode === "auto" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500"
                    >
                      <Check className="h-4 w-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Mode Manuel */}
              <motion.div
                onClick={() => updateSettings({ mode: "manual" })}
                className={`relative cursor-pointer overflow-hidden rounded-xl border p-6 transition-all duration-300 ${
                  settings.mode === "manual"
                    ? "border-purple-500/50 bg-purple-500/5 shadow-lg shadow-purple-500/10"
                    : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                }`}
              >
                {settings.mode === "manual" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent" />
                )}
                <div className="relative z-10">
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                      settings.mode === "manual" ? "bg-purple-500/20" : "bg-zinc-800"
                    }`}
                  >
                    <Settings2 className={`h-6 w-6 ${settings.mode === "manual" ? "text-purple-400" : "text-zinc-500"}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Mode Manuel (Expert)</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Définissez strictement vos sources et mots-clés.
                  </p>
                  {settings.mode === "manual" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500"
                    >
                      <Check className="h-4 w-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION B : PARAMÈTRES MANUELS */}
        <AnimatePresence mode="wait">
          {settings.mode === "manual" && (
            <motion.div
              key="manual-params"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Paramètres manuels</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Configurez vos sources et filtres personnalisés
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Domaines autorisés */}
                  <div className="space-y-3">
                    <Label htmlFor="domains" className="text-white">
                      Domaines autorisés
                    </Label>
                    <p className="text-sm text-zinc-400">
                      Ajoutez les domaines de sources que vous souhaitez suivre (ex: bloomberg.com, lefigaro.fr)
                    </p>
                    <div className="flex gap-2">
                      <Input
                        id="domains"
                        value={domainInput}
                        onChange={(e) => setDomainInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addDomain()
                          }
                        }}
                        placeholder="bloomberg.com"
                        className="bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-indigo-500"
                      />
                      <button
                        onClick={addDomain}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                    {settings.allowed_domains.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {settings.allowed_domains.map((domain) => (
                          <Badge
                            key={domain}
                            variant="outline"
                            className="bg-zinc-800 border-zinc-700 text-zinc-300 px-3 py-1 flex items-center gap-2"
                          >
                            {domain}
                            <button
                              onClick={() => removeDomain(domain)}
                              className="hover:text-white transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mots-clés obligatoires */}
                  <div className="space-y-3">
                    <Label htmlFor="keywords" className="text-white">
                      Mots-clés obligatoires
                    </Label>
                    <p className="text-sm text-zinc-400">
                      Les actualités doivent contenir au moins un de ces mots-clés pour apparaître dans votre flux
                    </p>
                    <div className="flex gap-2">
                      <Input
                        id="keywords"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addKeyword()
                          }
                        }}
                        placeholder="crypto, finance, tech..."
                        className="bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-indigo-500"
                      />
                      <button
                        onClick={addKeyword}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                    {settings.required_keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {settings.required_keywords.map((keyword) => (
                          <Badge
                            key={keyword}
                            variant="outline"
                            className="bg-zinc-800 border-zinc-700 text-zinc-300 px-3 py-1 flex items-center gap-2"
                          >
                            {keyword}
                            <button
                              onClick={() => removeKeyword(keyword)}
                              className="hover:text-white transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION C : CONTRÔLE DU FLUX */}
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-xl">Rythme de diffusion</CardTitle>
            <CardDescription className="text-zinc-400">
              Contrôlez la fréquence de rafraîchissement pour éviter d'être inondé d'informations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Toggle Auto-refresh */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                <div className="flex-1">
                  <Label htmlFor="auto-refresh" className="text-white font-medium">
                    Rafraîchissement automatique
                  </Label>
                  <p className="text-sm text-zinc-400 mt-1">
                    Active ou désactive le rafraîchissement automatique du flux
                  </p>
                </div>
                <Switch
                  id="auto-refresh"
                  checked={settings.auto_refresh}
                  onCheckedChange={(checked) => updateSettings({ auto_refresh: checked })}
                />
              </div>

              <Select
                value={settings.refresh_rate.toString()}
                onValueChange={(value) => updateSettings({ refresh_rate: parseInt(value) })}
              >
                <SelectTrigger className="bg-zinc-950/50 border-zinc-800 text-white h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  {REFRESH_RATE_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                      className="text-white hover:bg-zinc-800 focus:bg-zinc-800"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-zinc-400">{option.description}</div>
                        </div>
                        {option.warning && (
                          <Badge variant="outline" className="ml-4 border-orange-500/50 text-orange-400">
                            {option.warning}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Description du mode sélectionné */}
              <div className="mt-4 p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                {REFRESH_RATE_OPTIONS.find((opt) => opt.value === settings.refresh_rate) && (
                  <div className="flex items-start gap-3">
                    {settings.refresh_rate === 10 && (
                      <AlertCircle className="h-5 w-5 text-orange-400 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm text-zinc-300">
                        <span className="font-semibold">
                          {REFRESH_RATE_OPTIONS.find((opt) => opt.value === settings.refresh_rate)?.label}
                        </span>
                        {" - "}
                        {REFRESH_RATE_OPTIONS.find((opt) => opt.value === settings.refresh_rate)?.description}
                      </p>
                      {settings.refresh_rate === 10 && (
                        <p className="text-xs text-orange-400 mt-2">
                          ⚠️ Le mode temps réel peut être très intense et consommer beaucoup de ressources. Recommandé
                          uniquement pour un usage professionnel.
                        </p>
                      )}
                      {settings.refresh_rate !== 10 && (
                        <p className="text-xs text-zinc-400 mt-2">
                          Ce rythme permet de rester informé sans être submergé par les notifications.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bouton de sauvegarde en bas de page */}
        <div className="sticky bottom-0 bg-zinc-950/95 backdrop-blur-sm border-t border-zinc-800 p-6 -mx-8 -mb-8">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {hasUnsavedChanges && (
              <div className="flex items-center gap-2 text-sm text-amber-400">
                <AlertCircle className="h-4 w-4" />
                <span>Vous avez des modifications non sauvegardées</span>
              </div>
            )}
            <Button
              onClick={handleSaveSettings}
              disabled={saving || !hasUnsavedChanges}
              size="lg"
              className="ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder les préférences
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
