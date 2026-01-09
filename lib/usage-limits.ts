"use server"

import { createClient } from "@/lib/supabase/server"
import { getPlanConfig } from "@/lib/plans"

export interface LimitCheckResult {
  allowed: boolean
  count: number
  limit: number
  message?: string
}

/**
 * Vérifie si l'utilisateur peut générer un nouveau Flow selon son plan
 * Compte les Flows créés durant la semaine en cours (depuis lundi 00:00)
 */
export async function checkFlowLimit(userId: string, planType: string): Promise<LimitCheckResult> {
  try {
    const supabase = await createClient()
    const planConfig = getPlanConfig(planType)
    const limit = planConfig.maxRecapsPerWeek

    // Calculer le début de la semaine (lundi 00:00)
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Dimanche, 1 = Lundi, ...
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Si dimanche, remonter 6 jours, sinon remonter à lundi
    
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - daysToMonday)
    startOfWeek.setHours(0, 0, 0, 0)

    console.log(`[UsageLimits] Checking Flow limit for user ${userId} (${planType})`)
    console.log(`[UsageLimits] Week starts at: ${startOfWeek.toISOString()}`)

    // Compter les Flows créés depuis le début de la semaine
    const { count, error } = await supabase
      .from("recaps")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfWeek.toISOString())

    if (error) {
      console.error("[UsageLimits] Error counting flows:", error)
      throw error
    }

    const flowCount = count || 0
    const allowed = flowCount < limit

    console.log(`[UsageLimits] Flow check: ${flowCount}/${limit} - Allowed: ${allowed}`)

    return {
      allowed,
      count: flowCount,
      limit,
      message: allowed 
        ? `Vous avez utilisé ${flowCount}/${limit} Flows cette semaine.`
        : `Quota atteint : ${flowCount}/${limit} Flows cette semaine. Passez au plan supérieur pour continuer.`,
    }
  } catch (error) {
    console.error("[UsageLimits] Error in checkFlowLimit:", error)
    // En cas d'erreur, on bloque par sécurité
    return {
      allowed: false,
      count: 0,
      limit: 0,
      message: "Impossible de vérifier le quota. Veuillez réessayer.",
    }
  }
}

/**
 * Vérifie si l'utilisateur peut créer un nouveau projet selon son plan
 * Compte les projets actifs (is_active = true)
 */
export async function checkProjectLimit(userId: string, planType: string): Promise<LimitCheckResult> {
  try {
    const supabase = await createClient()
    const planConfig = getPlanConfig(planType)
    const limit = planConfig.maxProjects

    console.log(`[UsageLimits] Checking Project limit for user ${userId} (${planType})`)

    // Compter les projets actifs
    const { count, error } = await supabase
      .from("custom_topics")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true)

    if (error) {
      console.error("[UsageLimits] Error counting projects:", error)
      throw error
    }

    const projectCount = count || 0
    const allowed = projectCount < limit

    console.log(`[UsageLimits] Project check: ${projectCount}/${limit} - Allowed: ${allowed}`)

    return {
      allowed,
      count: projectCount,
      limit,
      message: allowed
        ? `Vous avez ${projectCount}/${limit} projets actifs.`
        : `Limite atteinte : ${projectCount}/${limit} projets actifs. Désactivez un projet ou passez au plan supérieur.`,
    }
  } catch (error) {
    console.error("[UsageLimits] Error in checkProjectLimit:", error)
    // En cas d'erreur, on bloque par sécurité
    return {
      allowed: false,
      count: 0,
      limit: 0,
      message: "Impossible de vérifier le quota. Veuillez réessayer.",
    }
  }
}

/**
 * Vérifie tous les quotas pour un utilisateur (utile pour dashboard)
 */
export async function checkAllLimits(userId: string, planType: string) {
  const [flowCheck, projectCheck] = await Promise.all([
    checkFlowLimit(userId, planType),
    checkProjectLimit(userId, planType),
  ])

  return {
    flows: flowCheck,
    projects: projectCheck,
  }
}















