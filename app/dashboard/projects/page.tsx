"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { createProject, updateProject } from "@/app/actions/projects"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, ChevronUp, ChevronDown, AlertCircle, Sparkles } from "lucide-react"
import { getPlanConfig } from "@/lib/plans"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

type CustomTopic = {
  id: string
  user_id: string
  title: string
  domain: string
  description: string | null
  instructions: string
  priority: string
  is_active: boolean
  created_at: string
  last_interaction_at: string | null
  complexity_level: string
  position: number
  length_level?: string
}

type Profile = {
  id: string
  plan_type: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 TÂCHE 1 : SYSTÈME DE THÈMES COULEURS PAR DOMAINE
// ═══════════════════════════════════════════════════════════════════════════════

type ThemeColors = {
  // Couleurs principales
  primary: string        // Couleur Tailwind (ex: "cyan")
  // Bordures
  border: string         // border-{color}-500/50
  borderHover: string    // hover:border-{color}-400
  borderFocus: string    // focus:border-{color}-500
  // Backgrounds
  bgCard: string         // bg-{color}-500/5
  bgBadge: string        // bg-{color}-500/10
  bgButton: string       // Gradient pour boutons
  bgButtonHover: string  // Gradient hover
  // Glows et shadows
  glow: string           // shadow-{color}-500/20
  glowStrong: string     // shadow-{color}-500/40
  // Textes
  text: string           // text-{color}-400
  textLight: string      // text-{color}-300
  // Ring
  ring: string           // ring-{color}-500/50
  // Switch
  switchOn: string       // data-[state=checked]:bg-{color}-500
}

const PROJECT_THEMES: Record<string, ThemeColors> = {
  // Finance & Marchés - CYAN/BLEU (Trading futuriste)
  finance: {
    primary: "cyan",
    border: "border-cyan-500/50",
    borderHover: "hover:border-cyan-400",
    borderFocus: "focus:border-cyan-500",
    bgCard: "bg-cyan-500/5",
    bgBadge: "bg-cyan-500/15",
    bgButton: "bg-gradient-to-r from-cyan-600 to-blue-600",
    bgButtonHover: "hover:from-cyan-500 hover:to-blue-500",
    glow: "shadow-cyan-500/20",
    glowStrong: "shadow-cyan-500/40",
    text: "text-cyan-400",
    textLight: "text-cyan-300",
    ring: "ring-cyan-500/50",
    switchOn: "data-[state=checked]:bg-cyan-500",
  },
  // Économie & Macro - EMERALD/VERT (Croissance)
  economics: {
    primary: "emerald",
    border: "border-emerald-500/50",
    borderHover: "hover:border-emerald-400",
    borderFocus: "focus:border-emerald-500",
    bgCard: "bg-emerald-500/5",
    bgBadge: "bg-emerald-500/15",
    bgButton: "bg-gradient-to-r from-emerald-600 to-green-600",
    bgButtonHover: "hover:from-emerald-500 hover:to-green-500",
    glow: "shadow-emerald-500/20",
    glowStrong: "shadow-emerald-500/40",
    text: "text-emerald-400",
    textLight: "text-emerald-300",
    ring: "ring-emerald-500/50",
    switchOn: "data-[state=checked]:bg-emerald-500",
  },
  // Géopolitique & Conflits - ROSE/ROUGE (Alerte)
  geopolitics: {
    primary: "rose",
    border: "border-rose-500/50",
    borderHover: "hover:border-rose-400",
    borderFocus: "focus:border-rose-500",
    bgCard: "bg-rose-500/5",
    bgBadge: "bg-rose-500/15",
    bgButton: "bg-gradient-to-r from-rose-600 to-red-600",
    bgButtonHover: "hover:from-rose-500 hover:to-red-500",
    glow: "shadow-rose-500/20",
    glowStrong: "shadow-rose-500/40",
    text: "text-rose-400",
    textLight: "text-rose-300",
    ring: "ring-rose-500/50",
    switchOn: "data-[state=checked]:bg-rose-500",
  },
  // Politique & Société - ORANGE/AMBER (Débat)
  politics_society: {
    primary: "orange",
    border: "border-orange-500/50",
    borderHover: "hover:border-orange-400",
    borderFocus: "focus:border-orange-500",
    bgCard: "bg-orange-500/5",
    bgBadge: "bg-orange-500/15",
    bgButton: "bg-gradient-to-r from-orange-600 to-amber-600",
    bgButtonHover: "hover:from-orange-500 hover:to-amber-500",
    glow: "shadow-orange-500/20",
    glowStrong: "shadow-orange-500/40",
    text: "text-orange-400",
    textLight: "text-orange-300",
    ring: "ring-orange-500/50",
    switchOn: "data-[state=checked]:bg-orange-500",
  },
  // Technologie & Innovation - VIOLET/PURPLE (Futuriste)
  tech_innovation: {
    primary: "violet",
    border: "border-violet-500/50",
    borderHover: "hover:border-violet-400",
    borderFocus: "focus:border-violet-500",
    bgCard: "bg-violet-500/5",
    bgBadge: "bg-violet-500/15",
    bgButton: "bg-gradient-to-r from-violet-600 to-purple-600",
    bgButtonHover: "hover:from-violet-500 hover:to-purple-500",
    glow: "shadow-violet-500/20",
    glowStrong: "shadow-violet-500/40",
    text: "text-violet-400",
    textLight: "text-violet-300",
    ring: "ring-violet-500/50",
    switchOn: "data-[state=checked]:bg-violet-500",
  },
  // Environnement & Climat - TEAL/VERT-BLEU (Nature)
  environment_climate: {
    primary: "teal",
    border: "border-teal-500/50",
    borderHover: "hover:border-teal-400",
    borderFocus: "focus:border-teal-500",
    bgCard: "bg-teal-500/5",
    bgBadge: "bg-teal-500/15",
    bgButton: "bg-gradient-to-r from-teal-600 to-cyan-600",
    bgButtonHover: "hover:from-teal-500 hover:to-cyan-500",
    glow: "shadow-teal-500/20",
    glowStrong: "shadow-teal-500/40",
    text: "text-teal-400",
    textLight: "text-teal-300",
    ring: "ring-teal-500/50",
    switchOn: "data-[state=checked]:bg-teal-500",
  },
  // Santé & Sciences - BLUE/SKY (Confiance)
  health_science: {
    primary: "sky",
    border: "border-sky-500/50",
    borderHover: "hover:border-sky-400",
    borderFocus: "focus:border-sky-500",
    bgCard: "bg-sky-500/5",
    bgBadge: "bg-sky-500/15",
    bgButton: "bg-gradient-to-r from-sky-600 to-blue-600",
    bgButtonHover: "hover:from-sky-500 hover:to-blue-500",
    glow: "shadow-sky-500/20",
    glowStrong: "shadow-sky-500/40",
    text: "text-sky-400",
    textLight: "text-sky-300",
    ring: "ring-sky-500/50",
    switchOn: "data-[state=checked]:bg-sky-500",
  },
  // Culture, Médias & Sport - FUCHSIA/PINK (Divertissement)
  culture_media_sport: {
    primary: "fuchsia",
    border: "border-fuchsia-500/50",
    borderHover: "hover:border-fuchsia-400",
    borderFocus: "focus:border-fuchsia-500",
    bgCard: "bg-fuchsia-500/5",
    bgBadge: "bg-fuchsia-500/15",
    bgButton: "bg-gradient-to-r from-fuchsia-600 to-pink-600",
    bgButtonHover: "hover:from-fuchsia-500 hover:to-pink-500",
    glow: "shadow-fuchsia-500/20",
    glowStrong: "shadow-fuchsia-500/40",
    text: "text-fuchsia-400",
    textLight: "text-fuchsia-300",
    ring: "ring-fuchsia-500/50",
    switchOn: "data-[state=checked]:bg-fuchsia-500",
  },
  // Autre - INDIGO/SLATE (Neutre mais élégant)
  other: {
    primary: "indigo",
    border: "border-indigo-500/50",
    borderHover: "hover:border-indigo-400",
    borderFocus: "focus:border-indigo-500",
    bgCard: "bg-indigo-500/5",
    bgBadge: "bg-indigo-500/15",
    bgButton: "bg-gradient-to-r from-indigo-600 to-purple-600",
    bgButtonHover: "hover:from-indigo-500 hover:to-purple-500",
    glow: "shadow-indigo-500/20",
    glowStrong: "shadow-indigo-500/40",
    text: "text-indigo-400",
    textLight: "text-indigo-300",
    ring: "ring-indigo-500/50",
    switchOn: "data-[state=checked]:bg-indigo-500",
  },
}

// Legacy domain mapping (pour les anciens domaines)
const LEGACY_DOMAIN_MAP: Record<string, string> = {
  crypto: "finance",
  forex: "finance",
  actions: "finance",
  indices: "finance",
  commodities: "finance",
  macro: "economics",
  societe: "politics_society",
  geopolitique: "geopolitics",
  autre: "other",
}

// Fonction pour obtenir le thème d'un domaine
function getProjectTheme(domain: string): ThemeColors {
  // Vérifier si c'est un ancien domaine
  const mappedDomain = LEGACY_DOMAIN_MAP[domain] || domain
  return PROJECT_THEMES[mappedDomain] || PROJECT_THEMES.other
}

// ═══════════════════════════════════════════════════════════════════════════════

const DOMAIN_OPTIONS = [
  { value: "finance", label: "Finance & marchés", icon: "📈" },
  { value: "economics", label: "Économie & macro", icon: "💹" },
  { value: "geopolitics", label: "Géopolitique & conflits", icon: "🌍" },
  { value: "politics_society", label: "Politique & société", icon: "🏛️" },
  { value: "tech_innovation", label: "Technologie & innovation", icon: "🤖" },
  { value: "environment_climate", label: "Environnement & climat", icon: "🌱" },
  { value: "health_science", label: "Santé & sciences", icon: "🧬" },
  { value: "culture_media_sport", label: "Culture, médias & sport", icon: "🎭" },
  { value: "other", label: "Autre", icon: "📌" },
]

const COMPLEXITY_OPTIONS = [
  { value: "very_simple", label: "Ultra simple", icon: "🌱" },
  { value: "standard", label: "Standard", icon: "📊" },
  { value: "advanced", label: "Avancé", icon: "🔬" },
  { value: "expert", label: "Expert pro", icon: "🎯" },
]

const LENGTH_OPTIONS = [
  { value: "very_short", label: "Très court", fullLabel: "Très court – quelques lignes maximum" },
  { value: "short", label: "Court", fullLabel: "Court – 1 à 2 courts paragraphes" },
  { value: "standard", label: "Standard", fullLabel: "Standard – développement normal" },
  { value: "very_detailed", label: "Très détaillé", fullLabel: "Très détaillé – analyse longue et poussée" },
]

function getComplexityBadgeStyle(complexity: string, theme: ThemeColors) {
  // Utilise la couleur du thème pour les badges
  return `${theme.bgBadge} ${theme.text} border ${theme.border}`
}

function getLengthBadgeStyle(theme: ThemeColors) {
  return `${theme.bgBadge} ${theme.text} border ${theme.border} opacity-80`
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<CustomTopic[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<CustomTopic | null>(null)
  const [saving, setSaving] = useState(false)
  const [formErrors, setFormErrors] = useState<{ domain?: string; title?: string }>({})

  // Form state
  const [formData, setFormData] = useState({
    domain: "",
    title: "",
    description: "",
    instructions: "",
    complexity_level: "standard",
    length_level: "standard",
    is_active: true,
  })

  const { toast } = useToast()
  const supabase = createClient()

  // Thème actif pour la modale (basé sur le domaine sélectionné)
  const activeTheme = getProjectTheme(formData.domain || "other")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setError(null)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError
      if (!user) {
        setError("Utilisateur non connecté")
        setLoading(false)
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, plan_type")
        .eq("id", user.id)
        .single()

      if (profileError) throw profileError
      setProfile(profileData)

      const { data: projectsData, error: projectsError } = await supabase
        .from("custom_topics")
        .select("*")
        .eq("user_id", user.id)
        .order("position", { ascending: true })
        .order("created_at", { ascending: true })

      if (projectsError) throw projectsError
      setProjects(projectsData || [])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de charger les données"
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const planConfig = getPlanConfig(profile?.plan_type)
  const maxProjects = planConfig.maxProjects
  const canAddProject = projects.length < maxProjects

  const openNewProjectDialog = () => {
    if (!canAddProject) {
      toast({
        title: "Limite atteinte",
        description: `Tu as atteint la limite de ${maxProjects} projets pour ton plan ${planConfig.label}.`,
        variant: "destructive",
      })
      return
    }

    setEditingProject(null)
    setFormData({
      domain: "",
      title: "",
      description: "",
      instructions: "",
      complexity_level: "standard",
      length_level: "standard",
      is_active: true,
    })
    setFormErrors({})
    setDialogOpen(true)
  }

  const openEditDialog = (project: CustomTopic) => {
    setEditingProject(project)
    setFormData({
      domain: project.domain,
      title: project.title,
      description: project.description || "",
      instructions: project.instructions,
      complexity_level: project.complexity_level || "standard",
      length_level: (project as any).length_level || "standard",
      is_active: project.is_active,
    })
    setFormErrors({})
    setDialogOpen(true)
  }

  const validateForm = () => {
    const errors: { domain?: string; title?: string } = {}
    if (!formData.domain || formData.domain.trim() === "") {
      errors.domain = "Le domaine est obligatoire"
    }
    if (!formData.title || formData.title.trim() === "") {
      errors.title = "Le nom du projet est obligatoire"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveProject = async () => {
    if (!validateForm()) {
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    if (saving) return
    setSaving(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) throw userError
      if (!user) throw new Error("Utilisateur non connecté")

      if (!editingProject && !canAddProject) {
        toast({
          title: "Limite atteinte",
          description: `Tu as atteint la limite de ${maxProjects} projets pour ton plan ${planConfig.label}`,
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      let instructions = formData.instructions.trim()
      if (!instructions) {
        const domainLabel = DOMAIN_OPTIONS.find((d) => d.value === formData.domain)?.label || formData.domain
        instructions = `Fournis un résumé clair et synthétique de l'actualité récente concernant ${formData.title} dans le domaine ${domainLabel}.`
      }

      const projectData = {
        user_id: user.id,
        title: formData.title.trim(),
        domain: formData.domain,
        description: formData.description.trim() || null,
        instructions,
        priority: "normal",
        complexity_level: formData.complexity_level,
        length_level: formData.length_level,
        is_active: formData.is_active,
      }

      if (editingProject) {
        const result = await updateProject(editingProject.id, {
          title: projectData.title,
          domain: projectData.domain,
          description: projectData.description,
          instructions: projectData.instructions,
          complexity_level: projectData.complexity_level,
          length_level: projectData.length_level,
          is_active: projectData.is_active,
        })

        if (!result.success) throw new Error(result.message)

        toast({
          title: "✅ Projet modifié",
          description: "Le projet a été mis à jour avec succès",
        })
      } else {
        const result = await createProject({
          title: projectData.title,
          domain: projectData.domain,
          description: projectData.description,
          instructions: projectData.instructions,
          complexity_level: projectData.complexity_level,
          length_level: projectData.length_level,
          is_active: projectData.is_active,
        })

        if (!result.success) {
          if (result.error === "LIMIT_REACHED") {
            toast({
              title: "❌ Limite atteinte",
              description: result.message,
              variant: "destructive",
            })
            setDialogOpen(false)
            return
          }
          throw new Error(result.message)
        }

        toast({
          title: "✅ Projet créé",
          description: "Le nouveau projet a été ajouté avec succès",
        })
      }

      setDialogOpen(false)
      await fetchData()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de sauvegarder le projet"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleProjectActive = async (projectId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.from("custom_topics").update({ is_active: isActive }).eq("id", projectId)
      if (error) throw error

      setProjects(projects.map((p) => (p.id === projectId ? { ...p, is_active: isActive } : p)))
      toast({
        title: isActive ? "Projet activé" : "Projet désactivé",
        description: `Le projet a été ${isActive ? "activé" : "désactivé"}`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de modifier le projet"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const moveProject = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= projects.length) return

    try {
      const currentProject = projects[index]
      const targetProject = projects[targetIndex]

      const { error: error1 } = await supabase
        .from("custom_topics")
        .update({ position: targetProject.position })
        .eq("id", currentProject.id)

      const { error: error2 } = await supabase
        .from("custom_topics")
        .update({ position: currentProject.position })
        .eq("id", targetProject.id)

      if (error1 || error2) throw error1 || error2
      await fetchData()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de déplacer le projet"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const getDomainLabel = (domain: string) => {
    const oldFinanceDomains = ["crypto", "forex", "actions", "indices", "commodities", "macro"]
    if (oldFinanceDomains.includes(domain)) return "Finance & marchés"
    if (domain === "societe") return "Politique & société"
    if (domain === "geopolitique") return "Géopolitique & conflits"
    if (domain === "autre") return "Autre"
    return DOMAIN_OPTIONS.find((d) => d.value === domain)?.label || "Autre"
  }

  const getDomainIcon = (domain: string) => {
    const mappedDomain = LEGACY_DOMAIN_MAP[domain] || domain
    return DOMAIN_OPTIONS.find((d) => d.value === mappedDomain)?.icon || "📌"
  }

  const getComplexityLabel = (complexity: string) => {
    return COMPLEXITY_OPTIONS.find((c) => c.value === complexity)?.label || complexity
  }

  const getLengthLabel = (length: string) => {
    return LENGTH_OPTIONS.find((l) => l.value === length)?.label || "Standard"
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
          <p className="text-zinc-400">Chargement des projets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-zinc-950">
        <Card className="max-w-md bg-zinc-900 border-red-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertCircle className="h-5 w-5" />
              <p className="font-semibold">Erreur de chargement</p>
            </div>
            <p className="text-sm text-zinc-400 mb-4">{error}</p>
            <Button
              onClick={() => {
                setError(null)
                setLoading(true)
                fetchData()
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {/* ═══════════════════════════════════════════════════════════════════════════
          MODALE D'ÉDITION - DESIGN PROFESSIONNEL & LISIBLE
          ═══════════════════════════════════════════════════════════════════════════ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent 
          className="
            sm:max-w-[600px] max-h-[90vh] overflow-y-auto
            bg-zinc-900/95 backdrop-blur-xl
            border border-white/10
            shadow-2xl
            p-0
          "
        >
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/10">
            <DialogTitle className="text-2xl font-bold text-white">
              {editingProject ? "Modifier le projet" : "Nouveau projet"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400 mt-1">
              Configurez un projet personnalisé pour structurer votre Flow d'actualité
            </DialogDescription>
          </DialogHeader>

          {/* Contenu du formulaire */}
          <div className="px-6 py-6 space-y-6">
            {/* Domaine */}
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-zinc-400 font-medium mb-2 block">
                Domaine <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.domain}
                onValueChange={(value) => {
                  setFormData({ ...formData, domain: value })
                  if (formErrors.domain) setFormErrors({ ...formErrors, domain: undefined })
                }}
              >
                <SelectTrigger 
                  id="domain" 
                  className={`
                    h-11 bg-zinc-900/50 border border-white/10 text-white
                    hover:border-white/20
                    ${formErrors.domain ? "border-red-500" : ""}
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                    transition-all duration-200
                  `}
                >
                  <SelectValue placeholder="Sélectionnez un domaine" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border border-white/10">
                  {DOMAIN_OPTIONS.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-indigo-500/20 focus:bg-indigo-500/20"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.domain && (
                <p className="text-xs text-red-400 mt-1">{formErrors.domain}</p>
              )}
            </div>

            {/* Nom du projet */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-400 font-medium mb-2 block">
                Nom du projet <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ex : Altcoins – Render (RNDR) | Forex – EURUSD | Conflit Ukraine–Russie"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value })
                  if (formErrors.title) setFormErrors({ ...formErrors, title: undefined })
                }}
                className={`
                  h-11 bg-zinc-900/50 border border-white/10 text-white placeholder:text-zinc-500
                  hover:border-white/20
                  ${formErrors.title ? "border-red-500" : ""}
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                  transition-all duration-200
                `}
              />
              {formErrors.title && (
                <p className="text-xs text-red-400 mt-1">{formErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-400 font-medium mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Contexte ou précisions supplémentaires sur ce projet..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="
                  bg-zinc-900/50 border border-white/10 text-white placeholder:text-zinc-500
                  hover:border-white/20
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                  transition-all duration-200
                  resize-none
                "
              />
            </div>

            {/* Niveau de difficulté */}
            <div className="space-y-2">
              <Label htmlFor="complexity" className="text-zinc-400 font-medium mb-2 block">
                Niveau de difficulté
              </Label>
              <Select
                value={formData.complexity_level}
                onValueChange={(value) => setFormData({ ...formData, complexity_level: value })}
              >
                <SelectTrigger 
                  id="complexity"
                  className="
                    h-11 bg-zinc-900/50 border border-white/10 text-white
                    hover:border-white/20
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                    transition-all duration-200
                  "
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border border-white/10">
                  {COMPLEXITY_OPTIONS.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-indigo-500/20 focus:bg-indigo-500/20 data-[highlighted]:bg-indigo-500/20"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Niveau de longueur */}
            <div className="space-y-2">
              <Label htmlFor="length" className="text-zinc-400 font-medium mb-2 block">
                Niveau de longueur
              </Label>
              <Select
                value={formData.length_level}
                onValueChange={(value) => setFormData({ ...formData, length_level: value })}
              >
                <SelectTrigger 
                  id="length"
                  className="
                    h-11 bg-zinc-900/50 border border-white/10 text-white
                    hover:border-white/20
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                    transition-all duration-200
                  "
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border border-white/10">
                  {LENGTH_OPTIONS.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="text-white hover:bg-indigo-500/20 focus:bg-indigo-500/20 data-[highlighted]:bg-indigo-500/20"
                    >
                      {option.fullLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-zinc-500 mt-1">
                Définit la longueur du traitement de ce sujet dans le Flow
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <Label htmlFor="instructions" className="text-zinc-400 font-medium mb-2 block">
                Instructions personnalisées
              </Label>
              <Textarea
                id="instructions"
                placeholder="Ex : Explique de manière pédagogique, focus sur les impacts sur les marchés, pas de blabla inutile."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={4}
                className="
                  bg-zinc-900/50 border border-white/10 text-white placeholder:text-zinc-500
                  hover:border-white/20
                  focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                  transition-all duration-200
                  resize-none
                "
              />
              <p className="text-xs text-zinc-500 mt-1">
                Si vide, une instruction par défaut sera générée automatiquement
              </p>
            </div>

            {/* Switch Projet actif */}
            <div className="
              flex items-center justify-between p-4 rounded-lg
              bg-zinc-900/30 border border-white/10
            ">
              <div>
                <Label htmlFor="is_active" className="text-white font-medium">
                  Projet actif
                </Label>
                <p className="text-xs text-zinc-500 mt-1">
                  Les projets actifs apparaissent dans votre Flow quotidien
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-zinc-700"
              />
            </div>
          </div>

          {/* Footer avec boutons */}
          <DialogFooter className="px-6 py-4 border-t border-white/10 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)} 
              disabled={saving}
              className="
                border border-white/10 text-zinc-300 
                hover:bg-zinc-800 hover:text-white
                disabled:opacity-50
              "
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSaveProject} 
              disabled={saving || !formData.domain || !formData.title}
              className="
                w-full sm:w-auto
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-500 hover:to-purple-500
                text-white font-semibold
                shadow-lg shadow-indigo-500/25
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : editingProject ? (
                "Modifier le projet"
              ) : (
                "Créer le projet"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════════
          CONTENU PRINCIPAL
          ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Gestion de projets
          </h1>
          <p className="text-zinc-400">
            Configure tes projets personnalisés pour structurer ton Flow. 
            <span className="ml-2 px-3 py-1 rounded-full bg-zinc-800 text-sm">
              Plan {planConfig.label} : <span className="text-white font-semibold">{projects.length}/{maxProjects}</span> projets
            </span>
          </p>
        </motion.div>

        {/* Bouton Nouveau projet */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-end mb-8"
        >
          <Button 
            onClick={openNewProjectDialog} 
            disabled={!canAddProject}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40"
          >
            <Plus className="mr-2 h-5 w-5" />
            Nouveau projet
          </Button>
        </motion.div>

        {/* Liste des projets */}
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 rounded-full bg-indigo-500/10 mb-4">
                  <Sparkles className="h-8 w-8 text-indigo-400" />
                </div>
                <p className="text-zinc-400 mb-6 text-lg">Aucun projet pour le moment</p>
                <Button 
                  onClick={openNewProjectDialog} 
                  disabled={!canAddProject}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Créer ton premier projet
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const theme = getProjectTheme(project.domain)
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* ═══════════════════════════════════════════════════════════
                      TÂCHE 2 : CARTES AVEC COULEURS THÉMATIQUES
                      ═══════════════════════════════════════════════════════════ */}
                  <Card
                    className={`
                      relative overflow-hidden
                      bg-zinc-900/60 backdrop-blur-sm
                      border-2 ${theme.border}
                      ${theme.borderHover}
                      shadow-lg ${theme.glow}
                      hover:shadow-xl hover:${theme.glowStrong}
                      transition-all duration-300
                      ${project.is_active ? "" : "opacity-50 grayscale-[30%]"}
                      group
                    `}
                  >
                    {/* Glow background subtil */}
                    <div className={`absolute inset-0 ${theme.bgCard} opacity-30`} />
                    
                    {/* Badge Actif */}
                    {project.is_active && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge className={`${theme.bgBadge} ${theme.text} border ${theme.border} font-semibold`}>
                          ✨ Actif
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="relative pb-3">
                      <div className="flex items-start gap-3">
                        {/* Icône du domaine */}
                        <div className={`
                          p-3 rounded-xl ${theme.bgBadge} border ${theme.border}
                          text-2xl flex items-center justify-center
                          group-hover:scale-110 transition-transform
                        `}>
                          {getDomainIcon(project.domain)}
                        </div>
                        
                        <div className="flex-1 min-w-0 pr-16">
                          <CardTitle className="text-lg text-white truncate mb-1">
                            {project.title}
                          </CardTitle>
                          <CardDescription className={`${theme.text} font-medium`}>
                            {getDomainLabel(project.domain)}
                          </CardDescription>
                        </div>
                      </div>
                      
                      {/* Badges de complexité et longueur */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge 
                          variant="outline" 
                          className={getComplexityBadgeStyle(project.complexity_level, theme)}
                        >
                          {getComplexityLabel(project.complexity_level)}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={getLengthBadgeStyle(theme)}
                        >
                          {getLengthLabel((project as any).length_level || "standard")}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    {/* Description et Instructions */}
                    {(project.description || project.instructions) && (
                      <CardContent className="relative space-y-3 pt-0">
                        {project.description && (
                          <div>
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Description</p>
                            <p className="text-sm text-zinc-300 line-clamp-2">{project.description}</p>
                          </div>
                        )}
                        {project.instructions && (
                          <div>
                            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Instructions</p>
                            <p className="text-sm text-zinc-400 line-clamp-2 italic">{project.instructions}</p>
                          </div>
                        )}
                      </CardContent>
                    )}
                    
                    {/* Actions */}
                    <CardContent className={`
                      relative pt-4 flex items-center justify-between 
                      border-t ${theme.border}
                    `}>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveProject(index, "up")}
                          disabled={index === 0}
                          title="Monter"
                          className={`h-8 w-8 ${theme.text} hover:${theme.bgBadge}`}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveProject(index, "down")}
                          disabled={index === projects.length - 1}
                          title="Descendre"
                          className={`h-8 w-8 ${theme.text} hover:${theme.bgBadge}`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditDialog(project)} 
                          className={`h-8 w-8 ${theme.text} hover:${theme.bgBadge}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Switch avec couleur thématique */}
                      <Switch
                        checked={project.is_active}
                        onCheckedChange={(checked) => toggleProjectActive(project.id, checked)}
                        className={theme.switchOn}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
