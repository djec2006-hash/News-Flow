"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  Bitcoin, 
  TrendingUp, 
  Home, 
  Cpu, 
  Globe2, 
  LineChart, 
  Trophy, 
  Gem, 
  Leaf,
  Check
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateInterests } from "@/app/actions/update-interests"

const EXPERTISE_LEVELS = [
  {
    id: "simple",
    title: "Débutant",
    description: "Je découvre l'actualité",
    icon: "🌱",
  },
  {
    id: "standard",
    title: "Intermédiaire",
    description: "Je suis régulièrement l'actu",
    icon: "🌿",
  },
  {
    id: "expert",
    title: "Expert",
    description: "Je veux des analyses poussées",
    icon: "🌳",
  },
]

const OBJECTIVES = [
  {
    id: "crypto",
    title: "Crypto & Web3",
    subtitle: "Bitcoin, Ethereum, DeFi",
    IconComponent: Bitcoin,
    domains: ["Technologie & innovation", "Marchés & économie globale"],
  },
  {
    id: "bourse",
    title: "Bourse & Actions",
    subtitle: "CAC40, S&P500, Tech",
    IconComponent: TrendingUp,
    domains: ["Marchés & économie globale", "Entreprises & business"],
  },
  {
    id: "immobilier",
    title: "Immobilier",
    subtitle: "Marché, Taux, Investissement",
    IconComponent: Home,
    domains: ["Marchés & économie globale", "Entreprises & business"],
  },
  {
    id: "tech",
    title: "Tech & IA",
    subtitle: "Innovations, Startups, GAFAM",
    IconComponent: Cpu,
    domains: ["Technologie & innovation", "Entreprises & business"],
  },
  {
    id: "geopolitique",
    title: "Géopolitique",
    subtitle: "Conflits, Relations internationales",
    IconComponent: Globe2,
    domains: ["Géopolitique & diplomatie", "Défense & sécurité"],
  },
  {
    id: "economie",
    title: "Économie",
    subtitle: "Inflation, Emploi, PIB",
    IconComponent: LineChart,
    domains: ["Marchés & économie globale", "Société & social"],
  },
  {
    id: "sport",
    title: "Sport Business",
    subtitle: "Mercato, Sponsors, JO",
    IconComponent: Trophy,
    domains: ["Culture, médias & sport", "Entreprises & business"],
  },
  {
    id: "luxe",
    title: "Luxe & Mode",
    subtitle: "Tendances, Résultats LVMH/Kering",
    IconComponent: Gem,
    domains: ["Entreprises & business", "Culture, médias & sport"],
  },
  {
    id: "ecologie",
    title: "Écologie & Énergie",
    subtitle: "Climat, Pétrole, Renouvelable",
    IconComponent: Leaf,
    domains: ["Énergie & climat", "Société & social"],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)

  // Form data
  const [fullName, setFullName] = useState("")
  const [age, setAge] = useState("")
  const [complexityLevel, setComplexityLevel] = useState("")
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const supabaseEnabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!supabaseEnabled) {
          console.warn("[Onboarding] Supabase non configuré")
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
        }
      } catch (err) {
        console.error("[Onboarding] Erreur d'authentification:", err)
      }
    }
    checkAuth()
  }, [router, supabase, supabaseEnabled])

  const nextStep = () => {
    setDirection(1)
    setStep(step + 1)
  }

  const handleKeyPress = (e: React.KeyboardEvent, isValid: boolean) => {
    if (e.key === "Enter" && isValid) {
      nextStep()
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setStep(5) // Étape de finalisation

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Non authentifié")

      // Récupérer tous les domaines des objectifs sélectionnés
      const selectedObjs = OBJECTIVES.filter((obj) => selectedObjectives.includes(obj.id))
      const generalDomains = Array.from(
        new Set(selectedObjs.flatMap((obj) => obj.domains))
      )

      console.log("[Onboarding] 🚀 Saving profile and preferences...")

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            full_name: fullName,
            age: Number.parseInt(age),
            complexity_level: complexityLevel,
            language: "FR",
            plan_type: "free",
            max_recaps_per_week: 7,
          },
          { onConflict: "id" },
        )

      if (profileError) {
        console.error("[Onboarding] ❌ Profile error:", profileError)
        throw profileError
      }

      console.log("[Onboarding] ✅ Profile saved")

      // Update content preferences via Server Action
      const interestsResult = await updateInterests(generalDomains)
      
      if (!interestsResult.success) {
        console.error("[Onboarding] ❌ Interests error:", interestsResult.error)
        // Fallback: essayer avec le client Supabase directement
        await supabase
          .from("content_preferences")
          .upsert(
            {
              user_id: user.id,
              general_domains: generalDomains,
              financial_markets: [],
              regions: [],
              receive_daily_email: false,
              email_time_local: null,
              allow_on_demand_recaps: true,
              max_on_demand_per_week: 2,
            },
            { onConflict: "user_id" },
          )
      }

      console.log("[Onboarding] ✅ Preferences saved:", generalDomains)

      // Afficher le toast de succès
      toast({
        title: "✅ Préférences sauvegardées",
        description: "Votre profil a été créé avec succès !",
      })

      // Attendre 2 secondes pour l'animation
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (err) {
      console.error("[Onboarding] Erreur:", err)
      toast({
        title: "❌ Erreur",
        description: "Une erreur est survenue lors de la création du profil.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const progress = (step / 5) * 100

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden overflow-x-hidden">
      {/* Barre de progression */}
      <div className="fixed top-0 left-0 w-full h-1 bg-zinc-900 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Effets de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Étape 1 : Identité */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full max-w-2xl"
            >
              <div className="mb-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-block mb-6"
                >
                  <Sparkles className="w-16 h-16 text-indigo-400" />
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Comment devons-nous
                  <br />
                  vous appeler ?
                </h1>
                <p className="text-xl text-zinc-400">Faisons connaissance</p>
              </div>

              <div className="space-y-8">
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, fullName.trim().length > 0)}
                    placeholder="Elon Musk"
                    className="w-full bg-transparent text-4xl md:text-5xl font-medium text-white placeholder-zinc-700 border-0 border-b-2 border-zinc-800 focus:border-b-2 focus:border-transparent focus:outline-none pb-4 transition-all duration-300"
                    style={{
                      borderImage: fullName
                        ? "linear-gradient(90deg, rgb(99, 102, 241), rgb(236, 72, 153)) 1"
                        : "",
                    }}
                    autoFocus
                  />
                </div>

                <motion.button
                  onClick={nextStep}
                  disabled={!fullName.trim()}
                  className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black text-lg font-semibold rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 disabled:hover:scale-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Suivant
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Étape 2 : Âge */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full max-w-2xl"
            >
              <div className="mb-12">
                <p className="text-zinc-500 text-lg mb-2">Salut {fullName.split(" ")[0]}</p>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Quel âge
                  <br />
                  avez-vous ?
                </h1>
                <p className="text-xl text-zinc-400">Pour personnaliser votre expérience</p>
              </div>

              <div className="space-y-8">
                <div className="relative">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, age.trim().length > 0 && Number(age) > 0)}
                    placeholder="35"
                    className="w-full bg-transparent text-4xl md:text-5xl font-medium text-white placeholder-zinc-700 border-0 border-b-2 border-zinc-800 focus:border-b-2 focus:border-transparent focus:outline-none pb-4 transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    style={{
                      borderImage: age ? "linear-gradient(90deg, rgb(99, 102, 241), rgb(236, 72, 153)) 1" : "",
                    }}
                    autoFocus
                  />
                  <span className="absolute right-0 bottom-4 text-3xl text-zinc-600">ans</span>
                </div>

                <motion.button
                  onClick={nextStep}
                  disabled={!age || Number(age) <= 0}
                  className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black text-lg font-semibold rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 disabled:hover:scale-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Suivant
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Étape 3 : Expertise */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full max-w-3xl"
            >
              <div className="mb-12 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                  Quel est votre niveau
                  <br />
                  de connaissances ?
                </h1>
                <p className="text-xl text-zinc-400">Nous adapterons le contenu en conséquence</p>
              </div>

              <div className="grid gap-4 md:grid-cols-3 mb-8">
                {EXPERTISE_LEVELS.map((level, index) => (
                  <motion.button
                    key={level.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      setComplexityLevel(level.id)
                      setTimeout(nextStep, 300)
                    }}
                    className={`group relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      complexityLevel === level.id
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
                    }`}
                  >
                    <div className="text-5xl mb-4">{level.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{level.title}</h3>
                    <p className="text-zinc-400">{level.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Étape 4 : Objectifs (Multi-select) */}
          {step === 4 && (
            <motion.div
              key="step4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full max-w-5xl"
            >
              <div className="mb-8 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  Que cherchez-vous
                  <br />
                  principalement ?
                </h1>
                <p className="text-lg text-zinc-400">
                  Sélectionnez jusqu'à 3 domaines d'intérêt ({selectedObjectives.length}/3)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
                {OBJECTIVES.map((objective, index) => {
                  const Icon = objective.IconComponent
                  const isSelected = selectedObjectives.includes(objective.id)
                  
                  // Mapping des couleurs par domaine
                  const colorMap: Record<string, {
                    border: string
                    bg: string
                    icon: string
                  }> = {
                    crypto: {
                      border: "border-orange-500",
                      bg: "bg-orange-500/10",
                      icon: "text-orange-500",
                    },
                    bourse: {
                      border: "border-blue-500",
                      bg: "bg-blue-500/10",
                      icon: "text-blue-500",
                    },
                    immobilier: {
                      border: "border-indigo-500",
                      bg: "bg-indigo-500/10",
                      icon: "text-indigo-500",
                    },
                    tech: {
                      border: "border-cyan-500",
                      bg: "bg-cyan-500/10",
                      icon: "text-cyan-500",
                    },
                    geopolitique: {
                      border: "border-slate-500",
                      bg: "bg-slate-500/10",
                      icon: "text-slate-400",
                    },
                    economie: {
                      border: "border-emerald-500",
                      bg: "bg-emerald-500/10",
                      icon: "text-emerald-500",
                    },
                    sport: {
                      border: "border-red-500",
                      bg: "bg-red-500/10",
                      icon: "text-red-500",
                    },
                    luxe: {
                      border: "border-amber-500",
                      bg: "bg-amber-500/10",
                      icon: "text-amber-500",
                    },
                    ecologie: {
                      border: "border-green-500",
                      bg: "bg-green-500/10",
                      icon: "text-green-500",
                    },
                  }

                  const colors = colorMap[objective.id] || {
                    border: "border-indigo-500",
                    bg: "bg-indigo-500/10",
                    icon: "text-indigo-500",
                  }

                  const handleObjectiveClick = () => {
                    if (isSelected) {
                      // Désélectionner
                      setSelectedObjectives(selectedObjectives.filter((id) => id !== objective.id))
                    } else {
                      // Sélectionner seulement si on a moins de 3
                      if (selectedObjectives.length < 3) {
                        setSelectedObjectives([...selectedObjectives, objective.id])
                      }
                    }
                  }

                  return (
                    <motion.button
                      key={objective.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      onClick={handleObjectiveClick}
                      disabled={!isSelected && selectedObjectives.length >= 3}
                      className={`group relative p-4 md:p-5 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? `${colors.border} ${colors.bg} hover:scale-105`
                          : selectedObjectives.length >= 3
                          ? "border-zinc-800 bg-zinc-900/50 opacity-50 cursor-not-allowed"
                          : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:scale-105"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 md:w-10 md:h-10 mb-3 mx-auto transition-colors duration-200 ${
                          isSelected ? colors.icon : "text-zinc-500"
                        }`}
                      />
                      <h3 className="text-base md:text-lg font-bold text-white mb-1">{objective.title}</h3>
                      <p className="text-xs md:text-sm text-zinc-500">{objective.subtitle}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 text-black" />
                        </motion.div>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center"
              >
                <motion.button
                  onClick={handleSubmit}
                  disabled={selectedObjectives.length === 0 || isSubmitting}
                  className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black text-lg font-semibold rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 disabled:hover:scale-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Suivant
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Étape 5 : Finalisation */}
          {step === 5 && (
            <motion.div
              key="step5"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full max-w-2xl text-center"
            >
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                }}
                className="inline-block mb-8"
              >
                <Loader2 className="w-20 h-20 text-indigo-400" />
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">C'est tout bon !</h1>
              <p className="text-2xl text-zinc-400 mb-8">Création de votre espace personnalisé...</p>

              <motion.div
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-indigo-500 rounded-full"
                    animate={{
                      y: [0, -10, 0],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
