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

/**
 * Crée un nouveau projet avec vérification des limites
 */
export async function createProject(projectData: ProjectData): Promise<ProjectResult> {
  try {
    const supabase = await createClient()

    // 1. Vérifier l'authentification
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        message: "Non authentifié",
        error: "UNAUTHENTICATED",
      }
    }

    // 2. Récupérer le plan utilisateur
    const { data: profile } = await supabase.from("profiles").select("plan_type").eq("id", user.id).single()

    const planType = profile?.plan_type ?? "free"

    // 3. 🔒 VÉRIFICATION DE LA LIMITE DE PROJETS
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

    // 4. Calculer la position du nouveau projet
    const { data: existingProjects } = await supabase
      .from("custom_topics")
      .select("position")
      .eq("user_id", user.id)
      .order("position", { ascending: false })
      .limit(1)

    const maxPosition = existingProjects && existingProjects.length > 0 ? existingProjects[0].position : -1
    const newPosition = maxPosition + 1

    // 5. Créer le projet
    const { data, error } = await supabase
      .from("custom_topics")
      .insert([
        {
          user_id: user.id,
          title: projectData.title.trim(),
          domain: projectData.domain,
          description: projectData.description?.trim() || null,
          instructions: projectData.instructions || "",
          complexity_level: projectData.complexity_level,
          length_level: projectData.length_level || "standard",
          is_active: projectData.is_active,
          priority: "normal",
          position: newPosition,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[Projects] Error creating project:", error)
      throw error
    }

    console.log(`[Projects] ✅ Project created successfully: ${data.id}`)

    // Revalider le cache de la page projets
    revalidatePath("/dashboard/projects")

    return {
      success: true,
      message: "Projet créé avec succès",
      project: data,
    }
  } catch (error) {
    console.error("[Projects] Unexpected error:", error)
    return {
      success: false,
      message: "Une erreur est survenue lors de la création du projet",
      error: "SERVER_ERROR",
    }
  }
}

/**
 * Met à jour un projet existant
 */
export async function updateProject(projectId: string, projectData: Partial<ProjectData>): Promise<ProjectResult> {
  try {
    const supabase = await createClient()

    // 1. Vérifier l'authentification
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        message: "Non authentifié",
        error: "UNAUTHENTICATED",
      }
    }

    // 2. Mettre à jour le projet (vérifier qu'il appartient à l'utilisateur)
    const { data, error } = await supabase
      .from("custom_topics")
      .update({
        ...projectData,
        title: projectData.title?.trim(),
        description: projectData.description?.trim() || null,
      })
      .eq("id", projectId)
      .eq("user_id", user.id) // Sécurité : vérifier que le projet appartient à l'user
      .select()
      .single()

    if (error) {
      console.error("[Projects] Error updating project:", error)
      throw error
    }

    if (!data) {
      return {
        success: false,
        message: "Projet non trouvé",
        error: "NOT_FOUND",
      }
    }

    console.log(`[Projects] ✅ Project updated successfully: ${data.id}`)

    // Revalider le cache
    revalidatePath("/dashboard/projects")

    return {
      success: true,
      message: "Projet mis à jour avec succès",
      project: data,
    }
  } catch (error) {
    console.error("[Projects] Unexpected error:", error)
    return {
      success: false,
      message: "Une erreur est survenue lors de la mise à jour du projet",
      error: "SERVER_ERROR",
    }
  }
}








