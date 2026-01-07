"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, Clock, Plus, X, Save, Check, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { updateEmailSettings, getEmailSettings } from "@/app/actions/update-email-settings"

const DAYS_OF_WEEK = [
  { id: 1, short: "L", full: "Lundi", code: "L" },
  { id: 2, short: "M", full: "Mardi", code: "Ma" },
  { id: 3, short: "M", full: "Mercredi", code: "Me" },
  { id: 4, short: "J", full: "Jeudi", code: "J" },
  { id: 5, short: "V", full: "Vendredi", code: "V" },
  { id: 6, short: "S", full: "Samedi", code: "S" },
  { id: 0, short: "D", full: "Dimanche", code: "D" },
]

// Mapping entre les IDs numériques et les codes strings (pour la base de données)
const DAY_ID_TO_CODE: Record<number, string> = {
  0: "D",
  1: "L",
  2: "Ma",
  3: "Me",
  4: "J",
  5: "V",
  6: "S",
}

const DAY_CODE_TO_ID: Record<string, number> = {
  D: 0,
  L: 1,
  Ma: 2,
  Me: 3,
  J: 4,
  V: 5,
  S: 6,
}

// Génération complète des heures (00:00 à 23:30 avec demi-heures)
const HOUR_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? "00" : "30"
  return `${hour.toString().padStart(2, "0")}:${minute}`
})

export default function EmailConfigPage() {
  const { toast } = useToast()
  
  // États du formulaire
  const [enabled, setEnabled] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]) // Jours ouvrés par défaut (pour l'UI)
  const [selectedHour, setSelectedHour] = useState("08:00")
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [emailFrequency, setEmailFrequency] = useState<"INSTANT" | "DAILY" | "WEEKLY">("DAILY")
  const [alertKeywords, setAlertKeywords] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Charger la config existante depuis email_settings via Server Action
  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    setLoading(true)
    try {
      const settings = await getEmailSettings()
      
      if (settings) {
        setEnabled(settings.is_enabled)
        // Convertir les codes de jours en IDs numériques pour l'UI
        const dayIds = settings.delivery_days
          .map((dayCode) => DAY_CODE_TO_ID[dayCode])
          .filter((id) => id !== undefined) as number[]
        setSelectedDays(dayIds.length > 0 ? dayIds : [1, 2, 3, 4, 5])
        setSelectedHour(settings.delivery_time || "08:00")
        setEmails(settings.recipients || [])
        setEmailFrequency(settings.email_frequency || "DAILY")
        setAlertKeywords(settings.alert_keywords || "")
        console.log("[EmailConfig] ✅ Settings loaded:", settings)
      } else {
        // Valeurs par défaut si pas de settings
        console.log("[EmailConfig] No existing settings, using defaults")
        setEnabled(false)
        setSelectedDays([1, 2, 3, 4, 5])
        setSelectedHour("08:00")
        setEmails([])
        setEmailFrequency("DAILY")
        setAlertKeywords("")
      }
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("[EmailConfig] Error loading config:", error)
      toast({
        title: "⚠️ Avertissement",
        description: "Impossible de charger vos préférences existantes.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => {
      const newDays = prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
      setHasUnsavedChanges(true)
      return newDays
    })
  }

  const addEmail = () => {
    const trimmed = newEmail.trim().toLowerCase()
    
    // Validation basique d'email
    if (!trimmed.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "❌ Email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      })
      return
    }

    if (emails.includes(trimmed)) {
      toast({
        title: "⚠️ Email déjà ajouté",
        description: "Cette adresse est déjà dans la liste.",
        variant: "destructive",
      })
      return
    }

    if (emails.length >= 3) {
      toast({
        title: "⚠️ Limite atteinte",
        description: "Vous pouvez configurer maximum 3 adresses email.",
        variant: "destructive",
      })
      return
    }

    setEmails([...emails, trimmed])
    setNewEmail("")
    setHasUnsavedChanges(true)
    
    toast({
      title: "✅ Email ajouté",
      description: `${trimmed} a été ajouté à la liste.`,
    })
  }

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email))
    setHasUnsavedChanges(true)
    toast({
      title: "🗑️ Email supprimé",
      description: `${email} a été retiré de la liste.`,
    })
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      // Convertir les IDs numériques en codes strings pour la base de données
      const deliveryDays = selectedDays
        .map((dayId) => DAY_ID_TO_CODE[dayId])
        .filter((day) => day !== undefined)

      const result = await updateEmailSettings({
        is_enabled: enabled,
        delivery_days: deliveryDays,
        delivery_time: selectedHour,
        recipients: emails,
        email_frequency: emailFrequency,
        alert_keywords: alertKeywords.trim() || undefined,
      })

      if (result.success) {
        setHasUnsavedChanges(false)
        toast({
          title: "✅ Succès",
          description: result.message,
        })
      } else {
        toast({
          title: "❌ Erreur",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[EmailConfig] Error saving config:", error)
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder la configuration.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Pilotez votre réception
          </h1>
          <p className="text-lg text-zinc-400">
            Choisissez quand et où vous recevez vos Flows.
          </p>
        </motion.div>

        {/* Carte principale - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-8 md:p-12"
        >
          {/* Glow effect subtil */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-2xl -z-10" />

          <div className="space-y-10">
            {/* A. INTERRUPTEUR GÉNÉRAL */}
            <div className="flex items-center justify-between p-6 rounded-2xl border border-white/10 bg-zinc-900/60">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <Mail className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Recevoir mon Flow par email</h3>
                  <p className="text-sm text-zinc-500">Activez pour configurer l'envoi automatique</p>
                </div>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) => {
                  setEnabled(checked)
                  setHasUnsavedChanges(true)
                }}
                className="data-[state=checked]:bg-indigo-600"
              />
            </div>

            {/* Formulaire (désactivé si toggle off) */}
            <div className={`space-y-8 transition-opacity duration-300 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
              
              {/* B. PLANNING - JOURS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Jours de réception</h3>
                  <span className="text-xs text-zinc-500">({selectedDays.length} sélectionné{selectedDays.length > 1 ? 's' : ''})</span>
                </div>
                
                <div className="flex gap-3 flex-wrap">
                  {DAYS_OF_WEEK.map((day) => (
                    <motion.button
                      key={day.id}
                      onClick={() => toggleDay(day.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        group relative w-14 h-14 rounded-full font-bold text-sm transition-all duration-300
                        ${selectedDays.includes(day.id)
                          ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                          : 'bg-zinc-800/50 text-zinc-400 border border-white/10 hover:border-indigo-500/50'
                        }
                      `}
                      title={day.full}
                    >
                      {day.short}
                      {selectedDays.includes(day.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <Check className="h-3 w-3 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* B. PLANNING - HEURE */}
              <div className="space-y-4">
                <Label htmlFor="hour" className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-400" />
                  Heure d'envoi
                </Label>
                
                <Select value={selectedHour} onValueChange={(value) => {
                  setSelectedHour(value)
                  setHasUnsavedChanges(true)
                }}>
                  <SelectTrigger 
                    className="w-full md:w-64 h-12 bg-zinc-900 border-zinc-700 text-white hover:border-indigo-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-indigo-400" />
                      <SelectValue placeholder="Choisir une heure" />
                    </div>
                  </SelectTrigger>
                  <SelectContent 
                    className="bg-zinc-900/95 backdrop-blur-xl border-white/10 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                  >
                    {HOUR_OPTIONS.map((hour) => (
                      <SelectItem
                        key={hour}
                        value={hour}
                        className="text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base">{hour}</span>
                          {hour === "08:00" && <span className="text-xs text-zinc-500">(recommandé)</span>}
                          {hour === "20:00" && <span className="text-xs text-zinc-500">(soirée)</span>}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <p className="text-xs text-zinc-500">
                  💡 Conseil : Choisissez l'heure à laquelle vous consultez habituellement vos emails
                </p>
              </div>

              {/* C. DESTINATAIRES */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Adresses destinataires</h3>
                  <span className="text-xs text-zinc-500">{emails.length}/3</span>
                </div>

                {/* Liste des emails */}
                {emails.length > 0 && (
                  <div className="space-y-2">
                    {emails.map((email, index) => (
                      <motion.div
                        key={email}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-white/10 group hover:border-indigo-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-indigo-500/10">
                            <Mail className="h-4 w-4 text-indigo-400" />
                          </div>
                          <span className="text-white font-medium">{email}</span>
                        </div>
                        <button
                          onClick={() => removeEmail(email)}
                          className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Champ d'ajout */}
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder={emails.length >= 3 ? "Limite de 3 adresses atteinte" : "Ajouter une adresse email"}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && emails.length < 3 && addEmail()}
                    disabled={emails.length >= 3}
                    className="flex-1 bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-indigo-500"
                  />
                  <Button
                    onClick={addEmail}
                    disabled={emails.length >= 3 || !newEmail.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {emails.length >= 3 && (
                  <p className="text-sm text-amber-400 flex items-center gap-2">
                    ⚠️ Limite de 3 adresses atteinte
                  </p>
                )}

                {emails.length === 0 && (
                  <p className="text-sm text-zinc-500 italic">
                    Aucune adresse configurée. Ajoutez au moins une adresse pour recevoir vos Flows.
                  </p>
                )}
              </div>

              {/* D. FRÉQUENCE D'ENVOI */}
              <div className="space-y-4">
                <Label htmlFor="frequency" className="text-xl font-bold text-white flex items-center gap-2">
                  <Mail className="h-5 w-5 text-indigo-400" />
                  Fréquence d'envoi
                </Label>
                
                <Select 
                  value={emailFrequency} 
                  onValueChange={(value: "INSTANT" | "DAILY" | "WEEKLY") => {
                    setEmailFrequency(value)
                    setHasUnsavedChanges(true)
                  }}
                >
                  <SelectTrigger 
                    className="w-full md:w-64 h-12 bg-zinc-900 border-zinc-700 text-white hover:border-indigo-500/50 transition-colors"
                  >
                    <SelectValue placeholder="Choisir une fréquence" />
                  </SelectTrigger>
                  <SelectContent 
                    className="bg-zinc-900/95 backdrop-blur-xl border-white/10"
                  >
                    <SelectItem
                      value="INSTANT"
                      className="text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white cursor-pointer"
                    >
                      <div>
                        <div className="font-medium">Instantané</div>
                        <div className="text-xs text-zinc-400">Dès qu'un Flow est généré</div>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="DAILY"
                      className="text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white cursor-pointer"
                    >
                      <div>
                        <div className="font-medium">Quotidien</div>
                        <div className="text-xs text-zinc-400">Une fois par jour aux heures configurées</div>
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="WEEKLY"
                      className="text-white hover:bg-indigo-600 hover:text-white focus:bg-indigo-600 focus:text-white cursor-pointer"
                    >
                      <div>
                        <div className="font-medium">Hebdomadaire</div>
                        <div className="text-xs text-zinc-400">Une fois par semaine</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* E. MOTS-CLÉS POUR ALERTES */}
              <div className="space-y-4">
                <Label htmlFor="alert-keywords" className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-indigo-400" />
                  Mots-clés pour alertes
                </Label>
                <p className="text-sm text-zinc-400">
                  Recevez des alertes instantanées lorsque des actualités contiennent ces mots-clés (séparés par des virgules)
                </p>
                <Input
                  id="alert-keywords"
                  type="text"
                  placeholder="crypto, finance, tech, géopolitique..."
                  value={alertKeywords}
                  onChange={(e) => {
                    setAlertKeywords(e.target.value)
                    setHasUnsavedChanges(true)
                  }}
                  className="bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-indigo-500"
                />
                <p className="text-xs text-zinc-500">
                  💡 Exemple : "crypto, finance, tech" - Vous recevrez une alerte dès qu'une actualité contient l'un de ces mots-clés
                </p>
              </div>
            </div>

            {/* 4. FOOTER D'ACTION */}
            <div className="pt-8 border-t border-white/10">
              <div className="flex items-center justify-between">
                {hasUnsavedChanges && (
                  <div className="flex items-center gap-2 text-sm text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>Modifications non sauvegardées</span>
                  </div>
                )}
                <Button
                  onClick={saveConfig}
                  disabled={saving || (enabled && emails.length === 0) || !hasUnsavedChanges}
                  className="ml-auto px-8 py-6 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Enregistrer les préférences
                    </>
                  )}
                </Button>
              </div>

              {enabled && emails.length === 0 && (
                <p className="mt-4 text-sm text-amber-400">
                  ⚠️ Ajoutez au moins une adresse email avant de sauvegarder
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Info complémentaire */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5"
        >
          <h4 className="text-sm font-semibold text-indigo-300 mb-2">📌 Informations importantes</h4>
          <ul className="text-sm text-zinc-400 space-y-1">
            <li>• Les Flows seront envoyés automatiquement aux jours et heures sélectionnés</li>
            <li>• Vous pouvez ajouter jusqu'à 3 adresses email différentes</li>
            <li>• Les emails incluront une version PDF et HTML de votre Flow</li>
            <li>• Pensez à vérifier vos spams lors du premier envoi</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
