"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { PDFButton } from "@/components/ui/pdf-button"
import { EmailButton } from "@/components/ui/email-button"
import { Sparkles, Calendar, TrendingUp, FileText, Loader2, Zap, Brain, Radar, Signal } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { getPlanConfig } from "@/lib/plans"
import { motion, type Variants } from "framer-motion"
import dynamic from "next/dynamic"
import SourcesList from "@/components/flow/SourcesList"
import { MarkdownRenderer } from "@/components/flow/MarkdownRenderer"
import { LiveFeed } from "@/components/dashboard/LiveFeed"

const Scene3DWrapper = dynamic(() => import("@/components/3d/Scene3DWrapper"), { ssr: false })
const StatShape = dynamic(() => import("@/components/3d/dashboard/StatShape"), { ssr: false })
const NetworkVisual = dynamic(() => import("@/components/3d/dashboard/NetworkVisual"), { ssr: false })
const NewsGlobe = dynamic(() => import("@/components/3d/NewsGlobe"), { ssr: false })
const Particles = dynamic(() => import("@/components/ui/particles"), { ssr: false })

// Variants pour animations
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const supabaseEnabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  // Gérer le retour après paiement Stripe
  useEffect(() => {
    if (typeof window === "undefined") return

    const params = new URLSearchParams(window.location.search)
    const success = params.get("success")
    const canceled = params.get("canceled")

    if (success === "true") {
      toast({
        title: "🎉 Paiement réussi !",
        description: "Votre abonnement a été activé avec succès. Rechargez la page si nécessaire.",
        duration: 8000,
      })
      
      // Nettoyer l'URL
      window.history.replaceState({}, "", "/dashboard")
      
      // Recharger les données du profil
      setTimeout(() => {
        router.refresh()
      }, 1000)
    }

    if (canceled === "true") {
      toast({
        title: "Paiement annulé",
        description: "Vous pouvez réessayer à tout moment depuis la page Tarifs.",
        variant: "default",
      })
      
      // Nettoyer l'URL
      window.history.replaceState({}, "", "/dashboard")
    }
  }, [router, toast])

  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generationPhase, setGenerationPhase] = useState<"idle" | "enhancing" | "generating" | "finalizing">("idle")
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [preferences, setPreferences] = useState<any>(null)
  const [latestFlow, setLatestFlow] = useState<any>(null)
  const [flowCount, setFlowCount] = useState(0)
  const [weeklyFlowCount, setWeeklyFlowCount] = useState(0)
  const [dailyInstruction, setDailyInstruction] = useState("")
  const [deepSearchMode, setDeepSearchMode] = useState(false)
  const [lastFlowUsedDeepSearch, setLastFlowUsedDeepSearch] = useState(false)

  useEffect(() => {
    async function loadData() {
      if (!supabaseEnabled) {
        console.warn("[newsflow] Supabase non configuré - mode démo (preview v0)")

        setUser({ id: "demo" })
        setProfile({
          full_name: "Elliot",
          complexity_level: "standard",
          plan_type: "free",
        })

        setPreferences({
          general_domains: ["Finance", "Géopolitique"],
          regions: ["Europe", "États-Unis"],
          financial_markets: ["Forex", "Crypto"],
          receive_daily_email: false,
        })

        setLatestFlow({
          id: "demo",
          created_at: new Date().toISOString(),
          summary: "Exemple de Flow en mode aperçu",
          body:
            "Ceci est un exemple de Flow généré en mode aperçu.\n\n" +
            "Forex : le dollar reste globalement stable face à l'euro.\n" +
            "- EUR/USD autour de 1,08\n" +
            "- Volatilité modérée sur la séance\n\n" +
            "Crypto : Bitcoin consolide au-dessus d'un support clé.\n" +
            "- BTC ≈ 90 000 $\n" +
            "- Volumes en léger recul\n\n" +
            "Ce Flow de démonstration te montre à quoi ressemblera ton vrai contenu une fois connecté à Supabase.",
          type: "on_demand",
          email_sent: false,
        })

        setFlowCount(3)
        setWeeklyFlowCount(1)
        setLoading(false)
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }
      setUser(user)

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      if (!profile || !profile.full_name) {
        router.push("/onboarding")
        return
      }
      setProfile(profile)

      const { data: preferences } = await supabase
        .from("content_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single()
      setPreferences(preferences)

      const { data: latestFlow } = await supabase
        .from("recaps")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
      setLatestFlow(latestFlow)

      const { count } = await supabase.from("recaps").select("*", { count: "exact", head: true }).eq("user_id", user.id)
      setFlowCount(count || 0)

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { count: weeklyCount } = await supabase
        .from("recaps")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", sevenDaysAgo.toISOString())
      setWeeklyFlowCount(weeklyCount || 0)

      setLoading(false)
    }

    loadData()
  }, [router, supabase, supabaseEnabled])

  async function handleGenerateFlow() {
    try {
      setGenerating(true)
      setLastFlowUsedDeepSearch(deepSearchMode)
      
      // Phase 1: Enrichissement de la demande (si instruction fournie)
      if (dailyInstruction && dailyInstruction.trim().length > 0) {
        setGenerationPhase("enhancing")
        await new Promise(resolve => setTimeout(resolve, 800))
      }
      
      // Phase 2: Génération du Flow
      setGenerationPhase("generating")

      const response = await fetch("/api/generate-flow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id || "demo",
          daily_instruction: dailyInstruction || null,
          deep_search: deepSearchMode,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // Gestion spécifique des erreurs de limite
        if (errorData.error === "LIMIT_REACHED") {
          toast({
            title: "⚠️ Quota atteint",
            description: errorData.message || "Vous avez atteint votre limite hebdomadaire.",
            variant: "destructive",
            duration: 5000,
          })
          return
        }
        
        // Autres erreurs
        throw new Error(errorData.error || errorData.message || "Erreur lors de la génération")
      }

      // Phase 3: Finalisation
      setGenerationPhase("finalizing")
      const data = await response.json()

      console.log("[Dashboard] Flow generated successfully:", data)

      toast({
        title: "✨ Flow généré",
        description: data.elapsedTime 
          ? `Votre Flow est prêt ! (généré en ${data.elapsedTime})`
          : "Votre Flow a été généré avec succès !",
        duration: 4000,
      })

      setDailyInstruction("")
      router.refresh()

      if (!supabaseEnabled || !user) return

      // Recharger les données
      const { data: latestFlow } = await supabase
        .from("recaps")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()
      setLatestFlow(latestFlow)

      const { count } = await supabase.from("recaps").select("*", { count: "exact", head: true }).eq("user_id", user.id)
      setFlowCount(count || 0)

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { count: weeklyCount } = await supabase
        .from("recaps")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", sevenDaysAgo.toISOString())
      setWeeklyFlowCount(weeklyCount || 0)
    } catch (error: any) {
      console.error("[Dashboard] Flow generation error:", error)
      
      toast({
        title: "❌ Erreur de génération",
        description: error.message || "Impossible de générer le Flow. Veuillez réessayer.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setGenerating(false)
      setGenerationPhase("idle")
    }
  }

  // Messages d'état pour chaque phase de génération
  const getGenerationMessage = () => {
    switch (generationPhase) {
      case "enhancing":
        return { icon: "🧠", text: "Optimisation de votre demande par l'IA..." }
      case "generating":
        return { icon: "⚡", text: "Analyse des marchés en cours (10-15s)..." }
      case "finalizing":
        return { icon: "✨", text: "Finalisation de votre Flow..." }
      default:
        return { icon: "🚀", text: "Générer maintenant" }
    }
  }

  const planConfig = getPlanConfig(profile?.plan_type)
  const canGenerateFlow = true

  const renderLatestFlowBody = () => {
    if (!latestFlow) return null

    try {
      const parsed = latestFlow.source_json ? JSON.parse(latestFlow.source_json) : null

      if (!parsed?.sections || !Array.isArray(parsed.sections)) {
        return (
          <div className="w-full max-w-none px-6 text-zinc-100 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-normal">
            {latestFlow.body}
          </div>
        )
      }

      const sentimentStyles: Record<string, { badge: string; icon: string }> = {
        bullish: {
          badge: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-1 text-xs font-medium",
          icon: "↑",
        },
        bearish: {
          badge: "inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-1 text-xs font-medium",
          icon: "↓",
        },
        neutral: {
          badge: "inline-flex items-center gap-1 rounded-full bg-zinc-500/10 text-zinc-300 border border-zinc-500/20 px-2 py-1 text-xs font-medium",
          icon: "→",
        },
      }

      return (
        <div className="w-full max-w-none px-6 space-y-8">
          {/* 🖼️ Image principale - Style Presse Premium */}
          {parsed.main_image_url && (
            <div className="relative w-full mb-12 -mt-2">
              {/* Glow effect - Copie floue en arrière-plan */}
              <div className="absolute inset-0 -z-10">
                <img
                  src={parsed.main_image_url}
                  alt="Background glow"
                  className="w-full h-80 object-cover rounded-xl blur-3xl opacity-20"
                />
              </div>
              
              {/* Image principale */}
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                <img
                  src={parsed.main_image_url}
                  alt={parsed.summary || "Illustration du Flow"}
                  className="w-full h-80 object-cover"
                />
                {/* Gradient overlay subtil pour meilleure lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
              </div>
            </div>
          )}

          {parsed.sections.map((section: any, idx: number) => {
            const sentiment = section.sentiment || "neutral"
            const style = sentimentStyles[sentiment] || sentimentStyles.neutral
            const contentStr = (section.content || "").trim()
            const isEmptyContent = !contentStr || /erreur|indisponible/i.test(contentStr)
            return (
              <section key={idx} className="space-y-4">
                <div className="flex items-center gap-3 mt-8 mb-2">
                  <h3 className="text-3xl font-bold text-white underline decoration-indigo-500 decoration-2 underline-offset-8">
                    {section.title}
                  </h3>
                </div>
                {isEmptyContent ? (
                  <div className="rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-6 text-sm text-zinc-400 flex items-center gap-3">
                    <Signal className="h-4 w-4 text-zinc-500" />
                    <span>Rien à signaler pour le moment sur ce sujet.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <MarkdownRenderer content={contentStr} />
                  </div>
                )}
                {Array.isArray(section.sources) && section.sources.length > 0 && (
                  <div className="pt-3 border-t border-white/5 text-xs text-zinc-600">
                    <span className="mr-1 text-zinc-500">Sources :</span>
                    <span className="text-zinc-500">
                      {section.sources.map((src: string, i: number) => (
                        <span key={src + i}>
                          {src}
                          {i < section.sources.length - 1 ? " • " : ""}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
              </section>
            )
          })}
          
          {/* Sources utilisées */}
          <SourcesList sources={parsed.sources} />
        </div>
      )
    } catch (e) {
      console.error("[v0] Failed to parse source_json in dashboard:", e)
      return (
        <div className="w-full max-w-none px-6 text-zinc-100 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-normal">
          {latestFlow.body}
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white">
      {/* Particules flottantes en arrière-plan global */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Particles />
      </div>

      {/* Spotlight indigo en haut */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-indigo-500/5 to-transparent blur-3xl" />
      </div>

      {/* Grain texture */}
      <div
        className="fixed inset-0 pointer-events-none -z-5 opacity-5 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Contenu principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Colonne principale (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeIn}>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Bonjour {profile?.full_name || "Elliot"}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Bienvenue dans votre dashboard NewsFlow.
          </p>
        </motion.div>

        {/* Stats Cards avec 3D - Layout asymétrique */}
        <motion.div
          id="tour-stats"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6"
        >
          {/* Colonne Gauche (1/3) - Deux cartes empilées */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Card 1: Flows reçus */}
            <motion.div variants={cardVariants} className="flex-1">
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-6 hover:border-white/10 transition-all group h-full">
                {/* ✨ Mini 3D scene - Étincelles */}
                <div className="absolute top-4 right-4 w-20 h-20 opacity-60 group-hover:opacity-80 transition-opacity">
                  <Scene3DWrapper cameraPosition={[0, 0, 3]}>
                    <StatShape type="sparkles" />
                  </Scene3DWrapper>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-500/20">
                      <FileText className="h-4 w-4 text-cyan-400" />
                    </div>
                    <span className="text-sm font-medium text-zinc-400">Flows reçus</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{flowCount}</div>
                  <p className="text-xs text-zinc-500">Total depuis votre inscription</p>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Sources actives */}
            <motion.div variants={cardVariants} className="flex-1">
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-6 hover:border-white/10 transition-all group h-full">
                {/* 📡 Mini 3D scene - Network Visual */}
                <div className="absolute top-4 right-4 w-20 h-20 opacity-60 group-hover:opacity-80 transition-opacity">
                  <Scene3DWrapper cameraPosition={[0, 0, 3]}>
                    <NetworkVisual />
                  </Scene3DWrapper>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-400/10 border border-purple-500/20">
                      <Signal className="h-4 w-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-zinc-400">Sources actives</span>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">142</div>
                  <p className="text-xs text-zinc-500">Total des flux surveillés</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Colonne Droite (2/3) - Plan actuel large */}
          <motion.div variants={cardVariants} className="lg:col-span-2 h-full">
            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-6 hover:border-white/10 transition-all group h-full">
              {/* 🌍 Mini Globe 3D */}
              <div className="absolute right-0 top-0 h-full w-1/2 opacity-80 pointer-events-none">
                <Scene3DWrapper cameraPosition={[0, 0, 6.5]}>
                  <NewsGlobe />
                </Scene3DWrapper>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-fuchsia-400/10 border border-fuchsia-500/20">
                    <TrendingUp className="h-4 w-4 text-fuchsia-400" />
                  </div>
                  <span className="text-sm font-medium text-zinc-400">Plan actuel</span>
                </div>
                <div className={`text-4xl font-bold mb-3 ${
                  profile?.plan_type === "free" 
                    ? "text-zinc-300" 
                    : profile?.plan_type === "basic"
                    ? "bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-amber-400 via-orange-400 to-purple-400 bg-clip-text text-transparent"
                }`}>
                  {planConfig.label}
                </div>
                
                {/* Infos du plan */}
                <div className="mb-3 space-y-1">
                  {/* Ligne "Envoi par email activé" retirée */}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>{weeklyFlowCount}/{planConfig.maxRecapsPerWeek} Flows cette semaine</span>
                    <span>{Math.round((weeklyFlowCount / planConfig.maxRecapsPerWeek) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(weeklyFlowCount / planConfig.maxRecapsPerWeek) * 100} 
                    className="h-1.5 bg-zinc-800"
                  />

                  {/* Section info supplémentaire */}
                  <div className="mt-4 pt-4 border-t border-white/5 text-xs text-zinc-500 flex items-start gap-2">
                    <span className="text-indigo-400">ℹ️</span>
                    <span>
                      Les quotas se réinitialisent chaque semaine. Pense à lancer tes Flows clés avant dimanche soir pour profiter au maximum de ton plan.
                    </span>
                  </div>
                  
                  {/* Incitation à upgrade si Free */}
                  {profile?.plan_type === "free" && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <Link href="/pricing">
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300"
                        >
                          Passer au plan supérieur
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  {/* Incitation à upgrade si Basic */}
                  {profile?.plan_type === "basic" && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <Link href="/pricing">
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300"
                        >
                          Passer au plan supérieur
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Command Bar - Generate Flow */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.95 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-auto"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                <Zap className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Générer un Flow</h2>
                <p className="text-sm text-zinc-400">Créez un Flow personnalisé à la demande</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="instruction" className="text-sm font-medium text-zinc-300 mb-2 block">
                  Instructions spécifiques (optionnel)
                </Label>
                <Textarea
                  id="instruction"
                  placeholder="Ex: actus crypto, focus marchés asiatiques, analyse Tesla..."
                  value={dailyInstruction}
                  onChange={(e) => setDailyInstruction(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl bg-zinc-950/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:ring-indigo-500/50 resize-none"
                  disabled={generating}
                />
                {dailyInstruction && !generating && (
                  <p className="text-xs text-indigo-400 mt-2 flex items-center gap-1">
                    <span>🧠</span>
                    <span>Votre demande sera enrichie automatiquement par l'IA</span>
                  </p>
                )}
              </div>

              {/* Toggle Deep Search */}
              <TooltipProvider>
                <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      deepSearchMode 
                        ? "bg-cyan-500/20 border border-cyan-500/30" 
                        : "bg-indigo-500/10 border border-indigo-500/20"
                    }`}>
                      {deepSearchMode ? (
                        <Brain className="h-5 w-5 text-cyan-400" />
                      ) : (
                        <Zap className="h-5 w-5 text-indigo-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="deep-search" className="text-sm font-medium text-white cursor-pointer">
                          {deepSearchMode ? "Mode Deep Search" : "Mode Standard"}
                        </Label>
                        {deepSearchMode && (
                          <span className="inline-flex items-center rounded-full bg-cyan-500/20 border border-cyan-500/30 px-2 py-0.5 text-xs font-medium text-cyan-400">
                            Analyse approfondie
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {deepSearchMode 
                          ? "Analyse sémantique complète du contenu (Plus lent)" 
                          : "Recherche rapide sur les sources principales"}
                      </p>
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setDeepSearchMode(!deepSearchMode)}
                        disabled={generating}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                          deepSearchMode 
                            ? "bg-cyan-500 focus:ring-cyan-500" 
                            : "bg-zinc-700 focus:ring-indigo-500"
                        } ${generating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            deepSearchMode ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-zinc-900 border border-cyan-500/30 text-cyan-300">
                      <p className="text-xs">
                        {deepSearchMode 
                          ? "Analyse sémantique complète du contenu (Plus lent)" 
                          : "Cliquez pour activer Deep Search"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <motion.div whileTap={{ scale: generating ? 1 : 0.98 }} className="relative inline-block">
                <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl blur opacity-30 ${generating ? 'animate-pulse' : 'group-hover:opacity-50'}`} />
                <Button
                  id="tour-generate-flow"
                  onClick={handleGenerateFlow}
                  disabled={generating || !canGenerateFlow}
                  size="lg"
                  className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl px-8 py-6 shadow-lg shadow-indigo-500/20 min-w-[280px]"
                >
                  {generating ? (
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>{getGenerationMessage().text}</span>
                    </motion.div>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Générer maintenant
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Barre de progression visuelle pendant la génération */}
              {generating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 rounded-xl bg-zinc-800/50 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      {generationPhase === "enhancing" && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="text-xl"
                        >
                          🧠
                        </motion.div>
                      )}
                      {generationPhase === "generating" && (
                        <motion.div
                          animate={deepSearchMode ? { rotate: 360 } : { scale: [1, 1.2, 1] }}
                          transition={deepSearchMode ? { duration: 2, repeat: Infinity, ease: "linear" } : { duration: 1, repeat: Infinity }}
                          className="text-xl"
                        >
                          {deepSearchMode ? "🔍" : "⚡"}
                        </motion.div>
                      )}
                      {generationPhase === "finalizing" && (
                        <motion.div
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          className="text-xl"
                        >
                          ✨
                        </motion.div>
                      )}
                    </div>
                    <span className="text-sm text-zinc-300">{getGenerationMessage().text}</span>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                      initial={{ width: "0%" }}
                      animate={{ 
                        width: generationPhase === "enhancing" 
                          ? "25%" 
                          : generationPhase === "generating" 
                            ? "75%" 
                            : "95%" 
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  {/* Étapes */}
                  <div className="flex justify-between mt-2 text-xs text-zinc-500">
                    <span className={generationPhase === "enhancing" ? "text-indigo-400" : ""}>
                      Enrichissement IA
                    </span>
                    <span className={generationPhase === "generating" ? "text-purple-400" : ""}>
                      Génération
                    </span>
                    <span className={generationPhase === "finalizing" ? "text-pink-400" : ""}>
                      Finalisation
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
          </div>

          {/* Colonne latérale (1/3) - LiveFeed */}
          <div className="lg:col-span-1 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col h-full"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md p-6 flex flex-col h-full min-h-0">
                <LiveFeed />
              </div>
            </motion.div>
          </div>

          {/* Latest Flow - Pleine largeur en dessous */}
          {latestFlow && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="lg:col-span-3"
            >
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-md">
                {/* Header */}
                <div className="border-b border-white/5 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-white">Dernier Flow généré</h2>
                        {lastFlowUsedDeepSearch && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 text-xs font-medium text-cyan-400">
                            <Brain className="h-3 w-3" />
                            Analysé par Deep Search
                          </span>
                        )}
                      </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(latestFlow.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                          <span className="inline-flex items-center rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400">
                            {latestFlow.type === "on_demand" ? "À la demande" : "Automatique"}
                          </span>
                        </div>
                      </div>
                      <div id="tour-export" className="flex items-center gap-2">
                        <EmailButton
                          flowId={latestFlow.id}
                          variant="outline"
                          size="sm"
                          className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                        />
                        <PDFButton
                          flowData={{
                            id: latestFlow.id,
                            summary: latestFlow.summary,
                            created_at: latestFlow.created_at,
                            body: latestFlow.body,
                            source_json: latestFlow.source_json,
                            key_events: latestFlow.key_events,
                            topics_covered: latestFlow.topics_covered,
                          }}
                          variant="outline"
                          className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                        />
                        <Link href="/dashboard/history">
                          <Button variant="outline" size="sm" className="border-white/10 text-zinc-300 hover:bg-white/5">
                            Voir l'historique
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                {/* Body */}
                <div className="p-8">{renderLatestFlowBody()}</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
