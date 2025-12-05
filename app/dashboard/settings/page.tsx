"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2, User, Globe, Mail, Crown, CreditCard, Calendar, Sparkles, Edit2, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { getPlanConfig } from "@/lib/plans"
import { useToast } from "@/hooks/use-toast"
import { updateInterests } from "@/app/actions/update-interests"

const INTEREST_CATEGORIES = [
  { id: "crypto", label: "Crypto & Web3", icon: "₿", color: "border-orange-500/50 bg-orange-500/10 text-orange-400" },
  { id: "bourse", label: "Bourse & Finance", icon: "📈", color: "border-green-500/50 bg-green-500/10 text-green-400" },
  { id: "geopolitique", label: "Géopolitique", icon: "🌍", color: "border-blue-500/50 bg-blue-500/10 text-blue-400" },
  { id: "tech", label: "Tech & IA", icon: "🤖", color: "border-purple-500/50 bg-purple-500/10 text-purple-400" },
  { id: "general", label: "Actualité Générale", icon: "📰", color: "border-indigo-500/50 bg-indigo-500/10 text-indigo-400" },
  { id: "business", label: "Business & Startup", icon: "💼", color: "border-slate-500/50 bg-slate-500/10 text-slate-400" },
  { id: "politique", label: "Politique", icon: "🏛️", color: "border-red-500/50 bg-red-500/10 text-red-400" },
  { id: "sport", label: "Sport", icon: "⚽", color: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400" },
  { id: "culture", label: "Culture & Médias", icon: "🎭", color: "border-pink-500/50 bg-pink-500/10 text-pink-400" },
]

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingIdentity, setEditingIdentity] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Profile fields
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [age, setAge] = useState("")
  const [memberSince, setMemberSince] = useState("")

  // Content preferences
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [tempSelectedInterests, setTempSelectedInterests] = useState<string[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }

        setUser(user)

        // Load profile
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (profileData) {
          setProfile(profileData)
          setFullName(profileData.full_name || "")
          setAge(profileData.age?.toString() || "")
          setMemberSince(profileData.created_at || user.created_at)
        }

        // Load preferences
        const { data: prefs } = await supabase.from("content_preferences").select("*").eq("user_id", user.id).single()

        if (prefs && prefs.general_domains) {
          // Map les anciens domaines vers les nouvelles catégories
          const mapped: string[] = []
          if (prefs.general_domains.some((d: string) => d.toLowerCase().includes("crypto") || d.toLowerCase().includes("technologie"))) {
            mapped.push("crypto")
          }
          if (prefs.general_domains.some((d: string) => d.toLowerCase().includes("marché") || d.toLowerCase().includes("économie"))) {
            mapped.push("bourse")
          }
          if (prefs.general_domains.some((d: string) => d.toLowerCase().includes("géopolitique") || d.toLowerCase().includes("diplomatie"))) {
            mapped.push("geopolitique")
          }
          if (prefs.general_domains.some((d: string) => d.toLowerCase().includes("tech"))) {
            mapped.push("tech")
          }
          if (prefs.general_domains.some((d: string) => d.toLowerCase().includes("politique") || d.toLowerCase().includes("société"))) {
            mapped.push("general")
          }
          if (prefs.general_domains.some((d: string) => d.toLowerCase().includes("business") || d.toLowerCase().includes("entreprise"))) {
            mapped.push("business")
          }
          setSelectedInterests(mapped.length > 0 ? mapped : ["general"])
        }
      } catch (err: any) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, supabase])

  const handleSaveIdentity = async () => {
    if (!fullName || !age) return

    setSaving(true)
    try {
      await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          age: Number.parseInt(age),
        })
        .eq("id", user.id)

      setProfile({ ...profile, full_name: fullName, age: Number.parseInt(age) })
      setEditingIdentity(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleOpenDialog = () => {
    setTempSelectedInterests([...selectedInterests])
    setDialogOpen(true)
  }

  const handleSavePreferences = async () => {
    setSaving(true)
    try {
      // Convertir les catégories en domaines pour la compatibilité
      const domains: string[] = []
      if (tempSelectedInterests.includes("crypto")) domains.push("Technologie & innovation", "Marchés & économie globale")
      if (tempSelectedInterests.includes("bourse")) domains.push("Marchés & économie globale", "Entreprises & business")
      if (tempSelectedInterests.includes("geopolitique")) domains.push("Géopolitique & diplomatie", "Défense & sécurité")
      if (tempSelectedInterests.includes("tech")) domains.push("Technologie & innovation")
      if (tempSelectedInterests.includes("general")) domains.push("Politique intérieure", "Société & social")
      if (tempSelectedInterests.includes("business")) domains.push("Entreprises & business")
      if (tempSelectedInterests.includes("politique")) domains.push("Politique intérieure")
      if (tempSelectedInterests.includes("sport")) domains.push("Culture, médias & sport")
      if (tempSelectedInterests.includes("culture")) domains.push("Culture, médias & sport")

      const uniqueDomains = [...new Set(domains)] // Déduplique
      
      console.log("[Settings] 🎯 Saving interests:", uniqueDomains)

      // Utiliser la Server Action pour sauvegarder
      const result = await updateInterests(uniqueDomains)

      if (result.success) {
        setSelectedInterests([...tempSelectedInterests])
        setDialogOpen(false)
        
        toast({
          title: "✅ Centres d'intérêt mis à jour",
          description: "Vos préférences ont été enregistrées avec succès",
        })
        
        console.log("[Settings] ✅ Interests saved successfully")
      } else {
        console.error("[Settings] ❌ Error:", result.error)
        toast({
          title: "❌ Erreur",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("[Settings] Unexpected error:", err)
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder vos préférences",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleInterest = (id: string) => {
    setTempSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    })
  }

  const planConfig = profile ? getPlanConfig(profile.plan_type) : null

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Mon Profil</h1>
        <p className="text-zinc-400">Gérez vos informations et préférences</p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid gap-6 lg:grid-cols-3 max-w-7xl">
        {/* Carte 1 : Identité (2/3 largeur) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl p-8 h-full">
            {/* Background gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-xl font-bold">Identité</h2>
                </div>
                {!editingIdentity && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingIdentity(true)}
                    className="text-zinc-400 hover:text-white hover:bg-white/5"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-500/20">
                    {getInitials(fullName)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-zinc-900" />
                </div>

                {/* Informations */}
                <div className="flex-1">
                  {editingIdentity ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm text-zinc-400 mb-2 block">Nom complet</Label>
                        <Input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="bg-zinc-950/50 border-white/10 text-white text-lg"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-zinc-400 mb-2 block">Âge</Label>
                        <Input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="bg-zinc-950/50 border-white/10 text-white"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveIdentity}
                          disabled={saving}
                          className="bg-white text-black hover:bg-zinc-200"
                        >
                          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                          Enregistrer
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setEditingIdentity(false)}
                          className="text-zinc-400 hover:text-white"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-3xl font-bold mb-2">{fullName}</h3>
                      <div className="flex items-center gap-4 text-zinc-400 mb-4">
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {user?.email}
                        </span>
                        {age && <span>• {age} ans</span>}
                      </div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-white/5">
                        <Calendar className="h-4 w-4 text-indigo-400" />
                        <span className="text-sm text-zinc-300">
                          Membre depuis {formatDate(memberSince)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Carte 2 : Abonnement (1/3 largeur - Style Carte de Crédit) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative overflow-hidden rounded-3xl h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-900 p-8 text-white shadow-2xl shadow-indigo-500/30">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-8">
                <Crown className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">Abonnement</span>
              </div>

              <div className="flex-1">
                <div className="text-5xl font-bold mb-6">
                  {profile?.plan_type?.toUpperCase() || "FREE"}
                </div>
                
                {planConfig && (
                  <div className="space-y-3 text-sm opacity-90">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>{planConfig.maxRecapsPerWeek} Flows / semaine</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>{planConfig.price}</span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="secondary"
                className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 mt-6"
              >
                Gérer mon abonnement
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Carte 3 : Préférences de Contenu (Compacte) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-bold">Centres d'intérêt</h2>
              </div>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenDialog}
                    className="text-zinc-400 hover:text-white hover:bg-white/5"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Vos centres d'intérêt</DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      Sélectionnez les thématiques qui vous intéressent pour personnaliser vos Flows
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-3 py-6 md:grid-cols-2">
                    {INTEREST_CATEGORIES.map((category) => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleInterest(category.id)}
                        className={`relative flex items-center gap-4 rounded-xl p-4 text-left transition-all border-2 ${
                          tempSelectedInterests.includes(category.id)
                            ? `${category.color} border-current shadow-lg`
                            : "bg-zinc-800/30 border-zinc-800 hover:border-zinc-700"
                        }`}
                      >
                        <div className="text-3xl">{category.icon}</div>
                        <div className="flex-1">
                          <div className={`font-semibold ${
                            tempSelectedInterests.includes(category.id) ? "text-white" : "text-zinc-300"
                          }`}>
                            {category.label}
                          </div>
                        </div>
                        {tempSelectedInterests.includes(category.id) && (
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      className="border-white/10 text-zinc-300 hover:bg-white/5"
                    >
                      Annuler
                    </Button>
                    <Button
                      onClick={handleSavePreferences}
                      disabled={saving}
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Enregistrer
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Badges compacts */}
            <div className="flex flex-wrap gap-2">
              {selectedInterests.length > 0 ? (
                selectedInterests.map((interestId) => {
                  const category = INTEREST_CATEGORIES.find((c) => c.id === interestId)
                  if (!category) return null
                  return (
                    <Badge
                      key={category.id}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm bg-zinc-800 text-white border border-white/10 hover:bg-zinc-700"
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.label}
                    </Badge>
                  )
                })
              ) : (
                <p className="text-sm text-zinc-500 italic">Aucun centre d'intérêt défini</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
