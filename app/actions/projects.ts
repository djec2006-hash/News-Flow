"use server"

import { createClient } from "@/lib/supabase/server"
import { checkProjectLimit } from "@/lib/usage-limits"
import { revalidatePath } from "next/cache"

export interface ProjectData {
  title: string
  domain: string
  description?: string | null
  instructions?: string
  complexity_level: string
  length_level?: string
  is_active: boolean
}

export interface ProjectResult {
  success: boolean
  message: string
  error?: string
  project?: any
}

// Valeurs valides pour les champs enum
const VALID_COMPLEXITY_LEVELS = ["very_simple", "standard", "advanced", "expert"] as const
const VALID_LENGTH_LEVELS = ["very_short", "short", "standard", "very_detailed"] as const

/**
 * Crée un nouveau projet avec vérification des limites
 * Fonction fail-safe qui ne peut pas crasher silencieusement
 */
export async function createProject(projectData: ProjectData): Promise<ProjectResult> {
  try {
    console.log("[Projects] 🚀 Starting project creation...")
    console.log("[Projects] 📦 Received data:", JSON.stringify(projectData, null, 2))

    const supabase = await createClient()

    // 1. Vérifier l'authentification
    console.log("[Projects] 🔐 Checking authentication...")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("[Projects] ❌ Auth error:", authError)
      return {
        success: false,
        message: `Erreur d'authentification: ${authError.message}`,
        error: "UNAUTHENTICATED",
      }
    }

    if (!user || !user.id) {
      console.error("[Projects] ❌ User not found or missing user.id")
      return {
        success: false,
        message: "Utilisateur non connecté. Veuillez vous reconnecter.",
        error: "UNAUTHENTICATED",
      }
    }

    console.log(`[Projects] ✅ Authenticated user: ${user.id}`)

    // 2. VALIDATION STRICTE DES CHAMPS OBLIGATOIRES
    if (!projectData.title || !projectData.title.trim()) {
      console.error("[Projects] ❌ Missing or empty title")
      return {
        success: false,
        message: "Le titre du projet est requis",
        error: "VALIDATION_ERROR",
      }
    }

    if (!projectData.domain || !projectData.domain.trim()) {
      console.error("[Projects] ❌ Missing or empty domain")
      return {
        success: false,
        message: "Le domaine du projet est requis",
        error: "VALIDATION_ERROR",
      }
    }

    // 3. VALIDATION STRICTE DES VALEURS ENUM
    if (!projectData.complexity_level || !VALID_COMPLEXITY_LEVELS.includes(projectData.complexity_level as any)) {
      console.error(`[Projects] ❌ Invalid complexity_level: "${projectData.complexity_level}"`)
      console.error(`[Projects] Expected one of: ${VALID_COMPLEXITY_LEVELS.join(", ")}`)
      return {
        success: false,
        message: `Niveau de complexité invalide: "${projectData.complexity_level}". Valeurs acceptées: ${VALID_COMPLEXITY_LEVELS.join(", ")}`,
        error: "VALIDATION_ERROR",
      }
    }

    // Validation de length_level (avec valeur par défaut si manquant)
    const lengthLevel = projectData.length_level || "standard"
    if (!VALID_LENGTH_LEVELS.includes(lengthLevel as any)) {
      console.error(`[Projects] ❌ Invalid length_level: "${lengthLevel}"`)
      console.error(`[Projects] Expected one of: ${VALID_LENGTH_LEVELS.join(", ")}`)
      return {
        success: false,
        message: `Niveau de longueur invalide: "${lengthLevel}". Valeurs acceptées: ${VALID_LENGTH_LEVELS.join(", ")}`,
        error: "VALIDATION_ERROR",
      }
    }

    console.log(`[Projects] ✅ Validation passed - complexity: "${projectData.complexity_level}", length: "${lengthLevel}"`)

    // 4. Récupérer le plan utilisateur
    console.log("[Projects] 📊 Fetching user plan...")
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan_type")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("[Projects] ⚠️ Error fetching profile (using default 'free'):", profileError)
    }

    const planType = profile?.plan_type ?? "free"
    console.log(`[Projects] 📊 User plan: ${planType}`)

    // 5. 🔒 VÉRIFICATION DE LA LIMITE DE PROJETS
    console.log(`[Projects] 🔒 Checking project limit for user ${user.id} (${planType})`)
    const projectLimitCheck = await checkProjectLimit(user.id, planType)

    if (!projectLimitCheck.allowed) {
      console.log(`[Projects] ❌ Project limit reached: ${projectLimitCheck.count}/${projectLimitCheck.limit}`)
      return {
        success: false,
        message: `Limite atteinte : ${projectLimitCheck.count}/${projectLimitCheck.limit} projets actifs. Désactivez un projet existant ou passez au plan supérieur.`,
        error: "LIMIT_REACHED",
      }
    }

    console.log(`[Projects] ✅ Limit OK: ${projectLimitCheck.count}/${projectLimitCheck.limit}`)

    // 6. Calculer la position du nouveau projet
    console.log("[Projects] 📍 Calculating project position...")
    const { data: existingProjects, error: positionError } = await supabase
      .from("custom_topics")
      .select("position")
      .eq("user_id", user.id)
      .order("position", { ascending: false })
      .limit(1)

    if (positionError) {
      console.error("[Projects] ⚠️ Error fetching existing projects (using default position 0):", positionError)
    }

    const maxPosition = existingProjects && existingProjects.length > 0 ? existingProjects[0].position : -1
    const newPosition = maxPosition + 1
    console.log(`[Projects] 📍 New project position: ${newPosition}`)

    // 7. Préparer les données d'insertion
    const insertData = {
      user_id: user.id,
      title: projectData.title.trim(),
      domain: projectData.domain.trim(),
      description: projectData.description?.trim() || null,
      instructions: projectData.instructions?.trim() || "",
      complexity_level: projectData.complexity_level,
      length_level: lengthLevel,
      is_active: projectData.is_active ?? true,
      position: newPosition,
    }

    console.log("[Projects] 💾 Data to insert:", JSON.stringify(insertData, null, 2))

    // 8. Créer le projet (NE JAMAIS LANCER D'ERREUR, TOUJOURS RETOURNER UN RÉSULTAT)
    console.log("[Projects] 💾 Inserting project into database...")
    const { data, error } = await supabase
      .from("custom_topics")
      .insert([insertData])
      .select()
      .single()

    if (error) {
      // Ne pas lancer d'erreur, retourner un résultat d'erreur structuré
      console.error("[Projects] ❌ Database error:", error)
      console.error("[Projects] ❌ Error code:", error.code)
      console.error("[Projects] ❌ Error message:", error.message)
      console.error("[Projects] ❌ Error details:", error.details)

      // Messages d'erreur plus précis selon le type d'erreur
      let errorMessage = "Une erreur est survenue lors de la création du projet"
      if (error.code === "23505") {
        // Violation de contrainte unique
        errorMessage = "Un projet avec ce nom existe déjà"
      } else if (error.code === "23503") {
        // Violation de clé étrangère
        errorMessage = "Erreur de référence : données invalides"
      } else if (error.code === "23514") {
        // Violation de contrainte CHECK (ex: enum invalide)
        errorMessage = `Valeur invalide pour un des champs. Détails: ${error.message}`
      } else if (error.message) {
        errorMessage = `Erreur base de données: ${error.message}`
      }

      return {
        success: false,
        message: errorMessage,
        error: "DATABASE_ERROR",
      }
    }

    if (!data) {
      console.error("[Projects] ❌ Insert succeeded but no data returned")
      return {
        success: false,
        message: "Le projet a été créé mais aucune donnée n'a été retournée",
        error: "DATABASE_ERROR",
      }
    }

    console.log(`[Projects] ✅ Project created successfully: ${data.id}`)
    console.log("[Projects] ✅ Created project data:", JSON.stringify(data, null, 2))

    // 9. Revalider le cache de la page projets
    revalidatePath("/dashboard/projects")

    return {
      success: true,
      message: "Projet créé avec succès",
      project: data,
    }
  } catch (error: any) {
    // Double sécurité : capturer toute erreur inattendue
    console.error("[Projects] ❌ Unexpected error in createProject:", error)
    console.error("[Projects] ❌ Error stack:", error?.stack)
    console.error("[Projects] ❌ Error name:", error?.name)
    console.error("[Projects] ❌ Error message:", error?.message)

    return {
      success: false,
      message: error?.message || "Une erreur inattendue est survenue lors de la création du projet",
      error: "UNEXPECTED_ERROR",
    }
  }
}

/**
 * Met à jour un projet existant
 * Fonction fail-safe qui ne peut pas crasher silencieusement
 */
export async function updateProject(projectId: string, projectData: Partial<ProjectData>): Promise<ProjectResult> {
  try {
    console.log(`[Projects] 🔄 Starting project update for ID: ${projectId}`)
    console.log("[Projects] 📦 Received data:", JSON.stringify(projectData, null, 2))

    if (!projectId || !projectId.trim()) {
      console.error("[Projects] ❌ Missing projectId")
      return {
        success: false,
        message: "L'identifiant du projet est requis",
        error: "VALIDATION_ERROR",
      }
    }

    const supabase = await createClient()

    // 1. Vérifier l'authentification
    console.log("[Projects] 🔐 Checking authentication...")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError) {
      console.error("[Projects] ❌ Auth error:", authError)
      return {
        success: false,
        message: `Erreur d'authentification: ${authError.message}`,
        error: "UNAUTHENTICATED",
      }
    }

    if (!user || !user.id) {
      console.error("[Projects] ❌ User not found or missing user.id")
      return {
        success: false,
        message: "Utilisateur non connecté. Veuillez vous reconnecter.",
        error: "UNAUTHENTICATED",
      }
    }

    console.log(`[Projects] ✅ Authenticated user: ${user.id}`)

    // 2. VALIDATION DES CHAMPS SI PRÉSENTS
    if (projectData.complexity_level && !VALID_COMPLEXITY_LEVELS.includes(projectData.complexity_level as any)) {
      console.error(`[Projects] ❌ Invalid complexity_level: "${projectData.complexity_level}"`)
      return {
        success: false,
        message: `Niveau de complexité invalide: "${projectData.complexity_level}". Valeurs acceptées: ${VALID_COMPLEXITY_LEVELS.join(", ")}`,
        error: "VALIDATION_ERROR",
      }
    }

    if (projectData.length_level && !VALID_LENGTH_LEVELS.includes(projectData.length_level as any)) {
      console.error(`[Projects] ❌ Invalid length_level: "${projectData.length_level}"`)
      return {
        success: false,
        message: `Niveau de longueur invalide: "${projectData.length_level}". Valeurs acceptées: ${VALID_LENGTH_LEVELS.join(", ")}`,
        error: "VALIDATION_ERROR",
      }
    }

    // 3. Préparer les données de mise à jour
    const updateData: any = {}
    if (projectData.title !== undefined) updateData.title = projectData.title.trim()
    if (projectData.domain !== undefined) updateData.domain = projectData.domain.trim()
    if (projectData.description !== undefined) updateData.description = projectData.description?.trim() || null
    if (projectData.instructions !== undefined) updateData.instructions = projectData.instructions.trim()
    if (projectData.complexity_level !== undefined) updateData.complexity_level = projectData.complexity_level
    if (projectData.length_level !== undefined) updateData.length_level = projectData.length_level
    if (projectData.is_active !== undefined) updateData.is_active = projectData.is_active

    console.log("[Projects] 💾 Data to update:", JSON.stringify(updateData, null, 2))

    // 4. Mettre à jour le projet (vérifier qu'il appartient à l'utilisateur)
    console.log("[Projects] 💾 Updating project in database...")
    const { data, error } = await supabase
      .from("custom_topics")
      .update(updateData)
      .eq("id", projectId)
      .eq("user_id", user.id) // Sécurité : vérifier que le projet appartient à l'user
      .select()
      .single()

    if (error) {
      // Ne pas lancer d'erreur, retourner un résultat d'erreur structuré
      console.error("[Projects] ❌ Database error:", error)
      console.error("[Projects] ❌ Error code:", error.code)
      console.error("[Projects] ❌ Error message:", error.message)

      // Messages d'erreur plus précis selon le type d'erreur
      let errorMessage = "Une erreur est survenue lors de la mise à jour du projet"
      if (error.code === "PGRST116") {
        // Aucune ligne trouvée
        errorMessage = "Projet non trouvé ou vous n'avez pas les permissions pour le modifier"
      } else if (error.code === "23505") {
        errorMessage = "Un projet avec ce nom existe déjà"
      } else if (error.code === "23514") {
        errorMessage = `Valeur invalide pour un des champs. Détails: ${error.message}`
      } else if (error.message) {
        errorMessage = `Erreur base de données: ${error.message}`
      }

      return {
        success: false,
        message: errorMessage,
        error: "DATABASE_ERROR",
      }
    }

    if (!data) {
      console.error("[Projects] ❌ Update succeeded but no data returned")
      return {
        success: false,
        message: "Le projet n'a pas été trouvé ou vous n'avez pas les permissions pour le modifier",
        error: "NOT_FOUND",
      }
    }

    console.log(`[Projects] ✅ Project updated successfully: ${data.id}`)
    console.log("[Projects] ✅ Updated project data:", JSON.stringify(data, null, 2))

    // 5. Revalider le cache
    revalidatePath("/dashboard/projects")

    return {
      success: true,
      message: "Projet mis à jour avec succès",
      project: data,
    }
  } catch (error: any) {
    // Double sécurité : capturer toute erreur inattendue
    console.error("[Projects] ❌ Unexpected error in updateProject:", error)
    console.error("[Projects] ❌ Error stack:", error?.stack)
    console.error("[Projects] ❌ Error name:", error?.name)
    console.error("[Projects] ❌ Error message:", error?.message)

    return {
      success: false,
      message: error?.message || "Une erreur inattendue est survenue lors de la mise à jour du projet",
      error: "UNEXPECTED_ERROR",
    }
  }
}











