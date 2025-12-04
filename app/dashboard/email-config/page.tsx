"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Mail, Clock, Plus, X, Save, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

const DAYS_OF_WEEK = [
  { id: 1, short: "L", full: "Lundi" },
  { id: 2, short: "M", full: "Mardi" },
  { id: 3, short: "M", full: "Mercredi" },
  { id: 4, short: "J", full: "Jeudi" },
  { id: 5, short: "V", full: "Vendredi" },
  { id: 6, short: "S", full: "Samedi" },
  { id: 0, short: "D", full: "Dimanche" },
]

// Génération complète des heures (00:00 à 23:30 avec demi-heures)
const HOUR_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2)
  const minute = i % 2 === 0 ? "00" : "30"
  return `${hour.toString().padStart(2, "0")}:${minute}`
})

export default function EmailConfigPage() {
  const { toast } = useToast()
  const supabase = createClient()
  
  // États du formulaire
  const [enabled, setEnabled] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]) // Jours ouvrés par défaut
  const [selectedHour, setSelectedHour] = useState("08:00")
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Charger la config existante
  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("email_config")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (data) {
        setEnabled(data.enabled || false)
        setSelectedDays(data.days || [1, 2, 3, 4, 5])
        setSelectedHour(data.hour || "08:00")
        setEmails(data.emails || [])
      }
    } catch (error) {
      console.error("Error loading config:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    )
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
    
    toast({
      title: "✅ Email ajouté",
      description: `${trimmed} a été ajouté à la liste.`,
    })
  }

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email))
    toast({
      title: "🗑️ Email supprimé",
      description: `${email} a été retiré de la liste.`,
    })
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      const config = {
        user_id: user.id,
        enabled,
        days: selectedDays,
        hour: selectedHour,
        emails,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from("email_config")
        .upsert(config, { onConflict: "user_id" })

      if (error) throw error

      toast({
        title: "✅ Préférences enregistrées",
        description: "Votre configuration d'emails a été mise à jour avec succès.",
      })
    } catch (error) {
      console.error("Error saving config:", error)
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
                onCheckedChange={setEnabled}
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
                
                <Select value={selectedHour} onValueChange={setSelectedHour}>
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
            </div>

            {/* 4. FOOTER D'ACTION */}
            <div className="pt-8 border-t border-white/10">
              <Button
                onClick={saveConfig}
                disabled={saving || (enabled && emails.length === 0)}
                className="w-full md:w-auto px-8 py-6 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-indigo-500/50 transition-all"
              >
                <Save className="mr-2 h-5 w-5" />
                {saving ? "Enregistrement..." : "Enregistrer les préférences"}
              </Button>

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

