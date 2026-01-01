"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2, User, Settings, Bell, CreditCard, Shield, Save, LogOut, Download } from "lucide-react"
import { getPlanConfig } from "@/lib/plans"
import { Progress } from "@/components/ui/progress"

type TabId = "account" | "general" | "notifications" | "subscription" | "security"

interface Tab {
  id: TabId
  label: string
  icon: typeof User
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<TabId>("account")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // User data
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  // Account form
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")

  // General settings
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [language, setLanguage] = useState<"fr" | "en">("fr")

  // Notifications
  const [dailyDigest, setDailyDigest] = useState(true)
  const [breakingNews, setBreakingNews] = useState(true)
  const [productUpdates, setProductUpdates] = useState(false)

  // Security
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const tabs: Tab[] = [
    { id: "account", label: "Mon Compte", icon: User },
    { id: "general", label: "Général", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "subscription", label: "Abonnement", icon: CreditCard },
    { id: "security", label: "Sécurité", icon: Shield },
  ]

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()
        if (!currentUser) {
          router.push("/login")
          return
        }

        setUser(currentUser)

        // Load profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single()

        if (profileData) {
          setProfile(profileData)
          setFullName(profileData.full_name || "")
          setBio(profileData.bio || "")
        }
      } catch (err: any) {
        console.error(err)
        toast({
          title: "Erreur",
          description: "Impossible de charger vos données",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, supabase, toast])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSaveAccount = async () => {
    if (!user) return

    setSaving(true)
    try {
      await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          bio: bio,
        })
        .eq("id", user.id)

      setProfile({ ...profile, full_name: fullName, bio: bio })

      toast({
        title: "✅ Modifications enregistrées",
        description: "Vos informations ont été mises à jour avec succès",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveGeneral = async () => {
    setSaving(true)
    try {
      // Sauvegarder les préférences (à implémenter selon votre structure de base de données)
      // Pour l'instant, on simule juste la sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "✅ Préférences enregistrées",
        description: "Vos préférences ont été mises à jour",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder les préférences",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    try {
      // Sauvegarder les préférences de notifications (à implémenter selon votre structure)
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "✅ Notifications mises à jour",
        description: "Vos préférences de notifications ont été enregistrées",
      })
    } catch (err) {
      console.error(err)
      toast({
        title: "❌ Erreur",
        description: "Impossible de sauvegarder les préférences",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword || !oldPassword) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Mots de passe différents",
        description: "Les nouveaux mots de passe ne correspondent pas",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")

      toast({
        title: "✅ Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès",
      })
    } catch (err: any) {
      console.error(err)
      toast({
        title: "❌ Erreur",
        description: err.message || "Impossible de modifier le mot de passe",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogoutAll = async () => {
    try {
      // Déconnexion de tous les appareils (nécessite une implémentation backend spécifique)
      // Pour l'instant, on déconnecte simplement l'utilisateur actuel
      await supabase.auth.signOut()
      router.push("/login")
    } catch (err) {
      console.error(err)
      toast({
        title: "❌ Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  const planConfig = profile ? getPlanConfig(profile.plan_type) : getPlanConfig("free")
  const currentPlanType = profile?.plan_type || "free"

  // Calculer l'utilisation des flows (exemple)
  const flowUsage = 0 // À récupérer depuis la base de données
  const flowUsagePercent = planConfig.maxRecapsPerWeek > 0 
    ? Math.min((flowUsage / planConfig.maxRecapsPerWeek) * 100, 100)
    : 0

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-2 md:p-6">
      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sticky top-6">
            <h2 className="text-lg font-semibold mb-4 px-2 text-zinc-300">Paramètres</h2>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-violet-600/10 text-violet-400 border border-violet-500/20"
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 md:p-8">
          {/* ONGLET : MON COMPTE */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Mon Compte</h2>
                <p className="text-zinc-400 text-sm">Gérez vos informations personnelles</p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-6 pb-6 border-b border-zinc-800">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-500/20">
                    {getInitials(fullName || user?.email || "U")}
                  </div>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    Modifier l'avatar
                  </Button>
                  <p className="text-xs text-zinc-500 mt-2">PNG, JPG jusqu'à 2MB</p>
                </div>
              </div>

              {/* Champs du formulaire */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-zinc-300 mb-2 block">
                    Nom complet
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-zinc-950 border-zinc-700 text-white focus:border-violet-500 focus:ring-violet-500/20"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-zinc-300 mb-2 block">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-zinc-950/50 border-zinc-700 text-zinc-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-zinc-500 mt-1">L'email ne peut pas être modifié</p>
                </div>

                <div>
                  <Label htmlFor="bio" className="text-zinc-300 mb-2 block">
                    Bio rapide
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-zinc-950 border-zinc-700 text-white focus:border-violet-500 focus:ring-violet-500/20 min-h-[100px]"
                    placeholder="Décrivez-vous en quelques mots..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-800">
                <Button
                  onClick={handleSaveAccount}
                  disabled={saving}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ONGLET : GÉNÉRAL */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Général</h2>
                <p className="text-zinc-400 text-sm">Personnalisez votre expérience</p>
              </div>

              <div className="space-y-6">
                {/* Apparence */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Apparence</h3>
                    <p className="text-sm text-zinc-400">Choisissez le thème d'affichage</p>
                  </div>
                  <div>
                    <Label htmlFor="theme" className="text-zinc-300 mb-2 block">
                      Thème
                    </Label>
                    <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                      <SelectTrigger
                        id="theme"
                        className="bg-zinc-950 border-zinc-700 text-white focus:border-violet-500 focus:ring-violet-500/20 w-full md:w-[300px]"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="light" className="text-zinc-100 focus:bg-zinc-800">
                          Clair
                        </SelectItem>
                        <SelectItem value="dark" className="text-zinc-100 focus:bg-zinc-800">
                          Sombre
                        </SelectItem>
                        <SelectItem value="system" className="text-zinc-100 focus:bg-zinc-800">
                          Système
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="h-px bg-zinc-800" />

                {/* Langue */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Langue</h3>
                    <p className="text-sm text-zinc-400">Sélectionnez votre langue préférée</p>
                  </div>
                  <div>
                    <Label htmlFor="language" className="text-zinc-300 mb-2 block">
                      Langue
                    </Label>
                    <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                      <SelectTrigger
                        id="language"
                        className="bg-zinc-950 border-zinc-700 text-white focus:border-violet-500 focus:ring-violet-500/20 w-full md:w-[300px]"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="fr" className="text-zinc-100 focus:bg-zinc-800">
                          Français
                        </SelectItem>
                        <SelectItem value="en" className="text-zinc-100 focus:bg-zinc-800">
                          English
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="h-px bg-zinc-800" />

                {/* Couleur d'accentuation */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Couleur d'accentuation</h3>
                    <p className="text-sm text-zinc-400">Couleur principale de l'interface</p>
                  </div>
                  <div>
                    <Label htmlFor="accent" className="text-zinc-300 mb-2 block">
                      Couleur
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-violet-600 border-2 border-violet-500"></div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">Violet</p>
                        <p className="text-xs text-zinc-500">Couleur de la marque (non modifiable)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-800">
                <Button
                  onClick={handleSaveGeneral}
                  disabled={saving}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ONGLET : NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Notifications</h2>
                <p className="text-zinc-400 text-sm">Gérez vos préférences de notifications</p>
              </div>

              <div className="space-y-6">
                {/* Switch de notifications */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="flex-1">
                      <Label htmlFor="dailyDigest" className="text-zinc-200 font-medium cursor-pointer">
                        Recevoir le digest quotidien par email
                      </Label>
                      <p className="text-sm text-zinc-500 mt-1">
                        Recevez un résumé quotidien de vos actualités
                      </p>
                    </div>
                    <Switch
                      id="dailyDigest"
                      checked={dailyDigest}
                      onCheckedChange={setDailyDigest}
                      className="data-[state=checked]:bg-violet-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="flex-1">
                      <Label htmlFor="breakingNews" className="text-zinc-200 font-medium cursor-pointer">
                        Alertes Breaking News
                      </Label>
                      <p className="text-sm text-zinc-500 mt-1">
                        Soyez alerté des actualités importantes en temps réel
                      </p>
                    </div>
                    <Switch
                      id="breakingNews"
                      checked={breakingNews}
                      onCheckedChange={setBreakingNews}
                      className="data-[state=checked]:bg-violet-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="flex-1">
                      <Label htmlFor="productUpdates" className="text-zinc-200 font-medium cursor-pointer">
                        Nouveautés produits NewsFlow
                      </Label>
                      <p className="text-sm text-zinc-500 mt-1">
                        Recevez des mises à jour sur les nouvelles fonctionnalités
                      </p>
                    </div>
                    <Switch
                      id="productUpdates"
                      checked={productUpdates}
                      onCheckedChange={setProductUpdates}
                      className="data-[state=checked]:bg-violet-600"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-800">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={saving}
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ONGLET : ABONNEMENT */}
          {activeTab === "subscription" && (
            <div className="space-y-8">
              {/* EN-TÊTE */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Abonnement & Facturation</h2>
                <p className="text-zinc-400">Gérez votre plan, vos moyens de paiement et vos factures.</p>
              </div>

              {/* CARTE PLAN ACTUEL */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <CreditCard className="w-32 h-32 text-violet-500" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-start gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">Plan {planConfig.label}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                        Actif
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {planConfig.pricePerMonth.replace("/mois", "")} <span className="text-lg text-zinc-500 font-normal">/ mois</span>
                    </div>
                    <p className="text-zinc-400 text-sm">
                      {currentPlanType === "free" 
                        ? "Aucun renouvellement automatique"
                        : "Prochaine facturation le " + new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 min-w-[200px]">
                    {currentPlanType === "free" ? (
                      <Button
                        onClick={() => router.push("/pricing")}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                      >
                        Passer au plan PRO
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => router.push("/pricing")}
                          variant="outline"
                          className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        >
                          Changer de plan
                        </Button>
                        <Button
                          onClick={() => {
                            toast({
                              title: "Annulation d'abonnement",
                              description: "Cette fonctionnalité sera disponible prochainement",
                            })
                          }}
                          variant="outline"
                          className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                        >
                          Annuler l'abonnement
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Utilisation (Progress Bar) */}
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-300">Utilisation des Flows (Hebdo)</span>
                    <span className="text-white font-medium">
                      {flowUsage} / {planConfig.maxRecapsPerWeek === -1 ? "∞" : planConfig.maxRecapsPerWeek}
                    </span>
                  </div>
                  <Progress 
                    value={flowUsagePercent} 
                    className="h-2 bg-zinc-900"
                  />
                  <p className="text-xs text-zinc-500 mt-2">
                    {planConfig.maxRecapsPerWeek === -1 
                      ? "Plan illimité" 
                      : "Réinitialisation chaque lundi matin."}
                  </p>
                </div>
              </div>

              {/* SECTION MÉTHODE DE PAIEMENT (STRIPE STYLE) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Moyen de paiement</h3>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center">
                      <div className="w-6 h-4 bg-zinc-600 rounded-sm opacity-50" />
                    </div>
                    <div>
                      {currentPlanType === "free" ? (
                        <>
                          <p className="text-sm font-medium text-zinc-300">Aucun moyen de paiement</p>
                          <p className="text-xs text-zinc-500">Ajoutez une carte pour passer à Pro</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-zinc-300">•••• 4242 (Expire 12/28)</p>
                          <p className="text-xs text-zinc-500">Carte bancaire enregistrée</p>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Portail Stripe",
                        description: "Redirection vers le portail client Stripe...",
                      })
                      // Ici, vous pouvez rediriger vers votre portail Stripe
                      // window.open('https://billing.stripe.com/p/login/...', '_blank')
                    }}
                    variant="ghost"
                    className="text-sm text-violet-400 hover:text-violet-300 hover:bg-violet-500/10"
                  >
                    {currentPlanType === "free" ? "Ajouter une carte" : "Gérer sur Stripe ↗"}
                  </Button>
                </div>
              </div>

              {/* HISTORIQUE FACTURES */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Historique des factures</h3>
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-900/50 text-zinc-400 font-medium border-b border-zinc-800">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Montant</th>
                        <th className="px-4 py-3">Statut</th>
                        <th className="px-4 py-3 text-right">Facture</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {currentPlanType === "free" ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-zinc-500 text-sm">
                            Aucune facture pour le moment.
                          </td>
                        </tr>
                      ) : (
                        <>
                          <tr className="hover:bg-zinc-900/30 transition-colors">
                            <td className="px-4 py-3 text-zinc-300">
                              {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td className="px-4 py-3 text-zinc-300">{planConfig.pricePerMonth.replace("/mois", "")}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Payé
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={() => {
                                  toast({
                                    title: "Téléchargement",
                                    description: "Téléchargement de la facture...",
                                  })
                                }}
                                className="text-zinc-500 hover:text-white transition-colors inline-flex items-center justify-center"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                          <tr className="hover:bg-zinc-900/30 transition-colors">
                            <td className="px-4 py-3 text-zinc-300">
                              {new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                            </td>
                            <td className="px-4 py-3 text-zinc-300">{planConfig.pricePerMonth.replace("/mois", "")}</td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Payé
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button 
                                onClick={() => {
                                  toast({
                                    title: "Téléchargement",
                                    description: "Téléchargement de la facture...",
                                  })
                                }}
                                className="text-zinc-500 hover:text-white transition-colors inline-flex items-center justify-center"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ONGLET : SÉCURITÉ */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Sécurité</h2>
                <p className="text-zinc-400 text-sm">Gérez votre sécurité et votre mot de passe</p>
              </div>

              <div className="space-y-6">
                {/* Changement de mot de passe */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Changer le mot de passe</h3>
                    <p className="text-sm text-zinc-400">Mettez à jour votre mot de passe pour sécuriser votre compte</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="oldPassword" className="text-zinc-300 mb-2 block">
                        Ancien mot de passe
                      </Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="bg-zinc-950 border-zinc-700 text-white focus:border-violet-500 focus:ring-violet-500/20"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <Label htmlFor="newPassword" className="text-zinc-300 mb-2 block">
                        Nouveau mot de passe
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-zinc-950 border-zinc-700 text-white focus:border-violet-500 focus:ring-violet-500/20"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword" className="text-zinc-300 mb-2 block">
                        Confirmer le nouveau mot de passe
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-zinc-950 border-zinc-700 text-white focus:border-violet-500 focus:ring-violet-500/20"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={handleChangePassword}
                        disabled={saving}
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Modification...
                          </>
                        ) : (
                          "Modifier le mot de passe"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-zinc-800" />

                {/* Déconnexion de tous les appareils */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Sessions actives</h3>
                    <p className="text-sm text-zinc-400">
                      Déconnectez-vous de tous les appareils et navigateurs
                    </p>
                  </div>

                  <Button
                    onClick={handleLogoutAll}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 hover:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter de tous les appareils
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
