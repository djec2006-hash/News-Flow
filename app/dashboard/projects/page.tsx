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
import { Plus, Edit, ChevronUp, ChevronDown, AlertCircle } from "lucide-react"
import { getPlanConfig } from "@/lib/plans"
import { useToast } from "@/components/ui/use-toast" // Import useToast hook

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
  length_level?: string // Added length_level to CustomTopic type
}

type Profile = {
  id: string
  plan_type: string
}

const DOMAIN_OPTIONS = [
  { value: "finance", label: "Finance & marchés" },
  { value: "economics", label: "Économie & macro" },
  { value: "geopolitics", label: "Géopolitique & conflits" },
  { value: "politics_society", label: "Politique & société" },
  { value: "tech_innovation", label: "Technologie & innovation" },
  { value: "environment_climate", label: "Environnement & climat" },
  { value: "health_science", label: "Santé & sciences" },
  { value: "culture_media_sport", label: "Culture, médias & sport" },
  { value: "other", label: "Autre" },
]

const COMPLEXITY_OPTIONS = [
  { value: "very_simple", label: "Ultra simple" },
  { value: "standard", label: "Standard" },
  { value: "advanced", label: "Avancé" },
  { value: "expert", label: "Expert pro" },
]

const LENGTH_OPTIONS = [
  { value: "very_short", label: "Très court – quelques lignes maximum" },
  { value: "short", label: "Court – 1 à 2 courts paragraphes" },
  { value: "standard", label: "Standard – développement normal" },
  { value: "very_detailed", label: "Très détaillé – analyse longue et poussée" },
]

function getComplexityBadgeColor(complexity: string) {
  switch (complexity) {
    case "very_simple":
    case "beginner":
      // Débutant : Vert (Emerald)
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    case "standard":
      // Standard : Bleu (Blue)
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "advanced":
      // Avancé : Orange (Orange/Amber)
      return "bg-orange-500/10 text-orange-400 border-orange-500/20"
    case "expert":
      // Expert : Rouge (Red/Rose)
      return "bg-red-500/10 text-red-400 border-red-500/20"
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
  }
}

function getLengthBadgeColor(length: string) {
  switch (length) {
    case "very_short":
      // Très court : Cyan (gris/cyan)
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
    case "short":
      // Court : Bleu Ciel (Sky)
      return "bg-sky-500/10 text-sky-400 border-sky-500/20"
    case "standard":
      // Standard : Bleu (Indigo)
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
    case "very_detailed":
      // Très détaillé : Rose/Violet (Fuchsia) - Important, doit ressortir
      return "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20"
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
  }
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
    length_level: "standard", // Added length_level to form state
    is_active: true,
  })

  const { toast } = useToast() // Declare useToast hook
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      console.log("[v0] Fetching user and projects data...")
      setError(null)

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error("[v0] Error fetching user:", userError)
        throw userError
      }

      if (!user) {
        console.error("[v0] No user found")
        setError("Utilisateur non connecté")
        setLoading(false)
        return
      }

      console.log("[v0] User found:", user.id)

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, plan_type")
        .eq("id", user.id)
        .single()

      if (profileError) {
        console.error("[v0] Error fetching profile:", profileError)
        throw profileError
      }

      console.log("[v0] Profile loaded:", profileData)
      setProfile(profileData)

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("custom_topics")
        .select("*")
        .eq("user_id", user.id)
        .order("position", { ascending: true })
        .order("created_at", { ascending: true })

      if (projectsError) {
        console.error("[v0] Error fetching projects:", projectsError)
        throw projectsError
      }

      console.log("[v0] Projects loaded:", projectsData?.length || 0)
      setProjects(projectsData || [])
    } catch (error) {
      console.error("[v0] Error in fetchData:", error)
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

    console.log("[v0] Opening new project dialog")
    setEditingProject(null)
    setFormData({
      domain: "",
      title: "",
      description: "",
      instructions: "",
      complexity_level: "standard",
      length_level: "standard", // Added length_level to default form data
      is_active: true,
    })
    setFormErrors({})
    setDialogOpen(true)
  }

  const openEditDialog = (project: CustomTopic) => {
    console.log("[v0] Opening edit dialog for project:", project.id)
    setEditingProject(project)
    setFormData({
      domain: project.domain,
      title: project.title,
      description: project.description || "",
      instructions: project.instructions,
      complexity_level: project.complexity_level || "standard",
      length_level: (project as any).length_level || "standard", // Added length_level with fallback to 'standard'
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
    console.log("[v0] handleSaveProject called")
    console.log("[v0] Form data:", formData)

    if (!validateForm()) {
      console.log("[v0] Form validation failed")
      toast({
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    if (saving) {
      console.log("[v0] Already saving, ignoring duplicate submission")
      return
    }

    setSaving(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error("[v0] Error getting user:", userError)
        throw userError
      }

      if (!user) {
        console.error("[v0] No user found when saving")
        throw new Error("Utilisateur non connecté")
      }

      console.log("[v0] User ID:", user.id)

      if (!editingProject && !canAddProject) {
        console.log("[v0] Project limit reached")
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
        console.log("[v0] Generated default instructions:", instructions)
      }

      const projectData = {
        user_id: user.id,
        title: formData.title.trim(),
        domain: formData.domain,
        description: formData.description.trim() || null,
        instructions,
        priority: "normal",
        complexity_level: formData.complexity_level,
        length_level: formData.length_level, // Added length_level to project data
        is_active: formData.is_active,
      }

      console.log("[v0] Project data to save:", projectData)

      if (editingProject) {
        console.log("[v0] Updating existing project via Server Action:", editingProject.id)
        
        // 🔒 Utilisation de la Server Action sécurisée
        const result = await updateProject(editingProject.id, {
          title: projectData.title,
          domain: projectData.domain,
          description: projectData.description,
          instructions: projectData.instructions,
          complexity_level: projectData.complexity_level,
          length_level: projectData.length_level,
          is_active: projectData.is_active,
        })

        if (!result.success) {
          throw new Error(result.message)
        }

        console.log("[v0] Project updated successfully via Server Action:", result.project)
        toast({
          title: "✅ Projet modifié",
          description: "Le projet a été mis à jour avec succès",
        })
      } else {
        console.log("[v0] Creating new project via Server Action")
        
        // 🔒 Utilisation de la Server Action sécurisée
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
          // Gestion des erreurs spécifiques
          if (result.error === "LIMIT_REACHED") {
            toast({
              title: "❌ Limite atteinte",
              description: result.message,
              variant: "destructive",
            })
            setDialogOpen(false)
            return // Arrêter ici, pas d'exception
          }
          
          throw new Error(result.message)
        }

        console.log("[v0] Project created successfully via Server Action:", result.project)
        toast({
          title: "✅ Projet créé",
          description: "Le nouveau projet a été ajouté avec succès",
        })
      }

      setDialogOpen(false)
      console.log("[v0] Refreshing projects list...")
      await fetchData()
      console.log("[v0] Projects list refreshed")
    } catch (error) {
      console.error("[v0] Error saving project:", error)
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
    console.log("[v0] Toggling project active:", projectId, isActive)
    try {
      const { error } = await supabase.from("custom_topics").update({ is_active: isActive }).eq("id", projectId)

      if (error) {
        console.error("[v0] Error toggling project:", error)
        throw error
      }

      console.log("[v0] Project toggled successfully")
      setProjects(projects.map((p) => (p.id === projectId ? { ...p, is_active: isActive } : p)))
      toast({
        title: isActive ? "Projet activé" : "Projet désactivé",
        description: `Le projet a été ${isActive ? "activé" : "désactivé"}`,
      })
    } catch (error) {
      console.error("[v0] Error in toggleProjectActive:", error)
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

    console.log("[v0] Moving project:", index, direction)

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

      if (error1 || error2) {
        console.error("[v0] Error moving project:", error1 || error2)
        throw error1 || error2
      }

      console.log("[v0] Project moved successfully")
      await fetchData()
    } catch (error) {
      console.error("[v0] Error in moveProject:", error)
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
    if (oldFinanceDomains.includes(domain)) {
      return "Finance & marchés"
    }

    if (domain === "societe") {
      return "Politique & société"
    }

    if (domain === "geopolitique") {
      return "Géopolitique & conflits"
    }

    if (domain === "autre") {
      return "Autre"
    }

    return DOMAIN_OPTIONS.find((d) => d.value === domain)?.label || "Autre"
  }

  const getComplexityLabel = (complexity: string) => {
    return COMPLEXITY_OPTIONS.find((c) => c.value === complexity)?.label || complexity
  }

  const getLengthLabel = (length: string) => {
    return LENGTH_OPTIONS.find((l) => l.value === length)?.label || "Standard – développement normal"
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <AlertCircle className="h-5 w-5" />
              <p className="font-semibold">Erreur de chargement</p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={() => {
                setError(null)
                setLoading(true)
                fetchData()
              }}
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-background p-8">
      {/* Project Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
            <DialogDescription>Configure un projet ultra personnalisé pour ton journal d'actualité.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="domain">
                Domaine <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.domain}
                onValueChange={(value) => {
                  setFormData({ ...formData, domain: value })
                  if (formErrors.domain) {
                    setFormErrors({ ...formErrors, domain: undefined })
                  }
                }}
              >
                <SelectTrigger id="domain" className={formErrors.domain ? "border-destructive" : ""}>
                  <SelectValue placeholder="Sélectionne un domaine" />
                </SelectTrigger>
                <SelectContent>
                  {DOMAIN_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.domain && <p className="text-xs text-destructive">{formErrors.domain}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Nom du projet <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ex : Altcoins – Render (RNDR) | Forex – EURUSD | Conflit Ukraine–Russie"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value })
                  if (formErrors.title) {
                    setFormErrors({ ...formErrors, title: undefined })
                  }
                }}
                className={formErrors.title ? "border-destructive" : ""}
              />
              {formErrors.title && <p className="text-xs text-destructive">{formErrors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Contexte ou précisions supplémentaires sur ce projet..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Niveau de difficulté *</Label>
              <Select
                value={formData.complexity_level}
                onValueChange={(value) => setFormData({ ...formData, complexity_level: value })}
              >
                <SelectTrigger id="complexity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPLEXITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="length">Niveau de longueur *</Label>
              <Select
                value={formData.length_level}
                onValueChange={(value) => setFormData({ ...formData, length_level: value })}
              >
                <SelectTrigger id="length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LENGTH_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Définit la longueur du traitement de ce sujet dans le Flow.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Ex : Explique de manière pédagogique, focus sur les impacts sur les marchés, pas de blabla inutile."
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Si vide, une instruction par défaut sera générée</p>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Projet actif</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Annuler
            </Button>
            <Button onClick={handleSaveProject} disabled={saving || !formData.domain || !formData.title}>
              {saving ? "Enregistrement..." : editingProject ? "Modifier le projet" : "Créer le projet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Gestion de projets</h1>
          <p className="text-zinc-400 mt-2">
            Configure tes projets personnalisés pour structurer ton Flow. Plan {planConfig.label} : {projects.length}/
            {maxProjects} projets.
            {planConfig.price && <span className="ml-2 text-sm">({planConfig.price})</span>}
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <Button onClick={openNewProjectDialog} disabled={!canAddProject}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau projet
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Aucun projet pour le moment</p>
              <Button onClick={openNewProjectDialog} disabled={!canAddProject}>
                <Plus className="mr-2 h-4 w-4" />
                Créer ton premier projet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((project, index) => (
              <Card
                key={project.id}
                className={`
                  relative
                  bg-black/20
                  border border-white/10
                  hover:border-white/30
                  hover:bg-black/30
                  transition-all
                  ${project.is_active ? "" : "opacity-60"}
                `}
              >
                {/* Badge Actif en haut à droite - petite touche de couleur */}
                {project.is_active && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/30 text-xs">
                      Actif
                    </Badge>
                  </div>
                )}
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-8">
                      <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                      <CardDescription className="text-zinc-400">{getDomainLabel(project.domain)}</CardDescription>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className={getComplexityBadgeColor(project.complexity_level)}>
                          Difficulté : {getComplexityLabel(project.complexity_level)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getLengthBadgeColor((project as any).length_level || "standard")}
                        >
                          Longueur : {getLengthLabel((project as any).length_level || "standard").split(" – ")[0]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {(project.description || project.instructions) && (
                  <CardContent className="space-y-2">
                    {project.description && (
                      <div>
                        <p className="text-sm font-medium mb-1 text-white">Description</p>
                        <p className="text-sm text-zinc-400">{project.description}</p>
                      </div>
                    )}
                    {project.instructions && (
                      <div>
                        <p className="text-sm font-medium mb-1 text-white">Instructions</p>
                        <p className="text-sm text-zinc-400">{project.instructions}</p>
                      </div>
                    )}
                  </CardContent>
                )}
                <CardContent className="pt-4 flex items-center justify-between border-t border-white/5">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveProject(index, "up")}
                      disabled={index === 0}
                      title="Monter"
                      className="h-8 w-8"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveProject(index, "down")}
                      disabled={index === projects.length - 1}
                      title="Descendre"
                      className="h-8 w-8"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)} className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <Switch
                    checked={project.is_active}
                    onCheckedChange={(checked) => toggleProjectActive(project.id, checked)}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
