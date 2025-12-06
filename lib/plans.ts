export type PlanType = "free" | "basic" | "pro"

export type PlanConfig = {
  id: PlanType
  label: string
  pricePerMonth: string
  priceAmount: number
  stripePriceId?: string // ID du prix Stripe (ex: price_xxx)
  maxProjects: number
  maxRecapsPerWeek: number
  description: string
  features: string[]
  hasEmailDelivery: boolean
  hasAdvancedAI: boolean
  hasPrioritySupport: boolean
}

const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  free: {
    id: "free",
    label: "Free",
    pricePerMonth: "0 €/mois",
    priceAmount: 0,
    maxProjects: 2,
    maxRecapsPerWeek: 2,
    description: "Pour découvrir NewsFlow",
    features: [
      "2 Flows par semaine",
      "2 projets actifs maximum",
      "Accès Dashboard web",
      "Lecture en ligne uniquement",
      "❌ Pas d'envoi par email",
    ],
    hasEmailDelivery: false,
    hasAdvancedAI: false,
    hasPrioritySupport: false,
  },
  basic: {
    id: "basic",
    label: "Basic",
    pricePerMonth: "9,90 €/mois",
    priceAmount: 9.90,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC || "prod_TY67DUWQadvvuS", // TODO: Remplacer par votre ID Stripe
    maxProjects: 5,
    maxRecapsPerWeek: 5,
    description: "L'essentiel pour rester informé",
    features: [
      "5 Flows par semaine",
      "5 projets actifs maximum",
      "Accès Dashboard web",
      "✅ Envoi par email (PDF/HTML)",
      "Export PDF basique",
      "Support standard",
    ],
    hasEmailDelivery: true,
    hasAdvancedAI: false,
    hasPrioritySupport: false,
  },
  pro: {
    id: "pro",
    label: "Pro",
    pricePerMonth: "16,90 €/mois",
    priceAmount: 16.90,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || "prod_TY68x7Pr2mmW34", // TODO: Remplacer par votre ID Stripe
    maxProjects: 15,
    maxRecapsPerWeek: 15,
    description: "Pour les power users exigeants",
    features: [
      "15 Flows par semaine",
      "15 projets actifs maximum",
      "Accès Dashboard web",
      "✅ Envoi par email (PDF/HTML)",
      "🚀 Modèles IA avancés (Deep Search)",
      "Export PDF illimité",
      "🎯 Support prioritaire",
      "Génération multiple par jour",
    ],
    hasEmailDelivery: true,
    hasAdvancedAI: true,
    hasPrioritySupport: true,
  },
}

export function getPlanConfig(planType?: string | null): PlanConfig {
  // Fallback to 'free' if value is unknown or null
  const normalizedPlanType = (planType?.toLowerCase() || "free") as PlanType

  if (normalizedPlanType in PLAN_CONFIGS) {
    return PLAN_CONFIGS[normalizedPlanType]
  }

  // Default to free plan if not found
  return PLAN_CONFIGS.free
}

// Helper pour vérifier les fonctionnalités
export function canSendEmail(planType?: string | null): boolean {
  return getPlanConfig(planType).hasEmailDelivery
}

export function hasAdvancedAI(planType?: string | null): boolean {
  return getPlanConfig(planType).hasAdvancedAI
}

export function hasPrioritySupport(planType?: string | null): boolean {
  return getPlanConfig(planType).hasPrioritySupport
}

// Exporter tous les plans pour la page pricing
export function getAllPlans(): PlanConfig[] {
  return [PLAN_CONFIGS.free, PLAN_CONFIGS.basic, PLAN_CONFIGS.pro]
}
