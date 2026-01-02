"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Sparkles, Zap, Shield, Target, Loader2 } from "lucide-react"
import { motion, useScroll, useTransform, type Variants } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Navbar from "@/components/layout/navbar"
import Marquee from "@/components/ui/marquee"
import { useRouter } from "next/navigation"
import { getPlanConfig } from "@/lib/plans"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

const Scene3DWrapper = dynamic(() => import("@/components/3d/Scene3DWrapper"), { ssr: false })
const NewsGlobe = dynamic(() => import("@/components/3d/NewsGlobe"), { ssr: false })
const ColorBends = dynamic(() => import("@/components/ui/color-bends"), { ssr: false })
const Particles = dynamic(() => import("@/components/ui/particles"), { ssr: false })

// Animation mot par mot avec gradient sur mots clés
const AnimatedTitle = ({ text, className }: { text: string; className?: string }) => {
  const words = text.split(" ")
  
  // Mots clés à mettre en gradient (sans ponctuation)
  const gradientWords = ["information", "Livrée", "demander"]

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  }

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 80,
      },
    },
    hidden: {
      opacity: 0,
      y: 30,
    },
  }

  return (
    <motion.h1 className={className} variants={container} initial="hidden" animate="visible">
      {words.map((word, index) => {
        // Enlever la ponctuation pour vérifier si c'est un mot clé
        const cleanWord = word.replace(/[.,!?;:]$/g, "").toLowerCase()
        const isGradient = gradientWords.includes(cleanWord)
        
        return (
          <motion.span 
            key={index} 
            variants={child} 
            className={`inline-block mr-3 ${
              isGradient 
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text animate-gradient" 
                : "text-white"
            }`}
          >
            {word}
          </motion.span>
        )
      })}
    </motion.h1>
  )
}

// Carte minimaliste avec effet hover subtil
const MinimalCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ borderColor: "rgba(255, 255, 255, 0.15)" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Glow interne subtil */}
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(255, 255, 255, 0.03), transparent 70%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

// Variants pour animations
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const plans = [
  {
    name: "Free",
    tagline: "Pour découvrir",
    price: "0",
    period: "Gratuit",
    description: "Testez NewsFlow gratuitement",
    features: [
      "2 Flows par semaine",
      "2 projets actifs maximum",
      "Accès Dashboard web",
      "Lecture en ligne uniquement",
      "❌ Pas d'envoi par email",
    ],
    cta: "Commencer gratuitement",
    href: "/signup",
    highlighted: false,
    planId: "free",
    badgeText: null,
    cardStyle: "border-white/5 bg-zinc-900/30",
  },
  {
    name: "Basic",
    tagline: "L'essentiel",
    price: "9,90",
    period: "par mois",
    description: "Parfait pour rester informé",
    features: [
      "5 Flows par semaine",
      "5 projets actifs maximum",
      "Accès Dashboard web",
      "✅ Envoi par email (PDF/HTML)",
      "Export PDF basique",
      "Support standard",
    ],
    cta: "Passer à Basic",
    href: "/signup?plan=basic",
    highlighted: true,
    planId: "basic",
    badgeText: "Populaire",
    cardStyle: "border-cyan-500/30 bg-cyan-500/5",
  },
  {
    name: "Pro",
    tagline: "Power User",
    price: "16,90",
    period: "par mois",
    description: "Pour les utilisateurs exigeants",
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
    cta: "Passer à Pro",
    href: "/signup?plan=pro",
    highlighted: false,
    planId: "pro",
    badgeText: "Best Value",
    cardStyle: "border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-purple-500/10",
  },
]

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [showText, setShowText] = useState(false)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Séquence d'introduction : texte apparaît après 2 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Gérer le checkout Stripe
  const handleCheckout = async (priceId: string, planId?: string) => {
    try {
      if (planId) {
        setLoadingPlan(planId)
      }

      // Vérifier l'authentification
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // Rediriger vers login avec un paramètre pour revenir après
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour souscrire à un abonnement.",
        })
        router.push(`/login?redirect=/`)
        if (planId) {
          setLoadingPlan(null)
        }
        return
      }

      if (!priceId || priceId.startsWith("price_PLACEHOLDER")) {
        toast({
          title: "Configuration manquante",
          description: "Le prix Stripe n'est pas configuré pour ce plan. Contactez le support.",
          variant: "destructive",
        })
        if (planId) {
          setLoadingPlan(null)
        }
        return
      }

      // Appeler l'API pour créer la session Stripe
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.url) {
        // Rediriger vers Stripe Checkout
        window.location.href = data.url
      } else {
        console.error("Erreur:", data.error)
        toast({
          title: "Erreur",
          description: "Erreur lors de la redirection Stripe",
          variant: "destructive",
        })
        if (planId) {
          setLoadingPlan(null)
        }
      }
    } catch (error) {
      console.error("Erreur fetch:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer la session de paiement",
        variant: "destructive",
      })
      if (planId) {
        setLoadingPlan(null)
      }
    }
  }

  return (
    <div ref={containerRef} className="relative min-h-screen bg-zinc-950 text-white overflow-hidden">
      <Navbar />

      {/* Fond 3D ColorBends - Deep Nebula */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-50">
        <ColorBends
          colors={["#000000", "#1e1b4b", "#4c1d95", "#be185d"]}
          transparent={true}
          speed={0.15}
          scale={1.3}
          frequency={0.9}
          warpStrength={1.5}
          mouseInfluence={0.3}
          parallax={0.25}
          noise={0.04}
          autoRotate={1}
        />
      </div>

      {/* Grain 4K overlay (netteté) */}
      <div 
        className="fixed inset-0 pointer-events-none -z-5 opacity-5 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignettage léger (focalise le regard) */}
      <div className="fixed inset-0 pointer-events-none -z-5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* Particules lumineuses (lucioles) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Particles />
      </div>

      {/* Contenu principal */}
      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 lg:py-24 xl:py-32">
          {/* Globe 3D en arrière-plan - Surveillance mondiale temps réel */}
          <div className="absolute inset-0 flex items-center justify-center opacity-50 -z-10">
            <div className="relative w-full h-full max-w-5xl">
              {/* Conteneur Globe avec animation immédiate */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: "easeOut", delay: 0 }}
                className="w-full h-full"
              >
                <Scene3DWrapper cameraPosition={[0, 0, 6.5]}>
                  <NewsGlobe />
                </Scene3DWrapper>
              </motion.div>
            </div>
          </div>

          {/* Conteneur texte - Apparition en cascade après 2 secondes */}
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 text-sm text-zinc-400 transform transition-all duration-700 ease-out delay-0 ${
                showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              Intelligence Artificielle Propriétaire
            </div>

            {/* Titre principal - Animation mot par mot */}
            <div
              className={`transform transition-all duration-700 ease-out delay-0 ${
                showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <AnimatedTitle
                text="L'information que vous cherchiez. Livrée avant même de la demander."
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight leading-tight text-white"
              />
            </div>

            {/* Sous-titre */}
            <p
              className={`text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed transform transition-all duration-700 ease-out delay-200 ${
                showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              NewsFlow analyse des milliers de sources institutionnelles et synthétise l'essentiel. Chaque matin, dans
              votre boîte mail.
            </p>

            {/* CTA */}
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 transform transition-all duration-700 ease-out delay-500 ${
                showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="relative group">
                {/* Glow douce derrière le bouton */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <Button
                  asChild
                  size="lg"
                  className="relative bg-white text-black hover:bg-zinc-100 font-medium rounded-full px-8 py-6 text-base"
                >
                  <Link href="/signup">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full px-8 py-6"
              >
                <Link href="/how-it-works">Voir comment ça marche</Link>
              </Button>
            </div>

            {/* Social proof discret */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="text-sm text-zinc-600"
            >
              Utilisé par 500+ professionnels de la finance et de la tech
            </motion.p>
          </div>
        </section>

        {/* MARQUEE - Preuve sociale */}
        <section className="relative border-t border-white/5">
          <div className="py-8">
            <p className="text-center text-xs uppercase tracking-widest text-zinc-600 mb-8">
              Analyses basées sur les flux institutionnels
            </p>
            <Marquee />
          </div>
        </section>

        {/* FONCTIONNALITÉS - Bento Grid Sobre */}
        <section className="relative py-32 px-4 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeInUp}
              className="text-center mb-20 space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Conçu pour les décideurs
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Une architecture pensée pour vous faire gagner du temps, pas pour vous impressionner.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-4"
            >
              {/* Carte 1 */}
              <motion.div variants={itemVariants} className="md:col-span-2">
                <MinimalCard className="p-8 h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-white">Intelligence Artificielle Propriétaire</h3>
                      <p className="text-zinc-500 leading-relaxed">
                        Notre moteur neuronal analyse des millions de signaux, filtre le bruit et synthétise l'essentiel
                        en quelques paragraphes actionnables.
                      </p>
                      <ul className="space-y-2 text-sm text-zinc-600">
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-zinc-500" />
                          Traitement du signal en temps réel
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-zinc-500" />
                          Scoring sémantique et détection d'anomalies
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-zinc-500" />
                          Narration adaptée à votre niveau
                        </li>
                      </ul>
                    </div>
                  </div>
                </MinimalCard>
              </motion.div>

              {/* Carte 2 */}
              <motion.div variants={itemVariants}>
                <MinimalCard className="p-8 h-full">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-zinc-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Génération instantanée</h3>
                    <p className="text-zinc-500 leading-relaxed">
                      Votre briefing est prêt en moins de 30 secondes. À la demande ou chaque matin à l'heure de votre
                      choix.
                    </p>
                  </div>
                </MinimalCard>
              </motion.div>

              {/* Carte 3 */}
              <motion.div variants={itemVariants}>
                <MinimalCard className="p-8 h-full">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Target className="h-5 w-5 text-zinc-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Ultra-personnalisé</h3>
                    <p className="text-zinc-500 leading-relaxed">
                      Créez des projets distincts (Crypto, Macro, Tech...) avec leurs propres règles de longueur et de
                      complexité.
                    </p>
                  </div>
                </MinimalCard>
              </motion.div>

              {/* Carte 4 */}
              <motion.div variants={itemVariants} className="md:col-span-2">
                <MinimalCard className="p-8 h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-white">Sources institutionnelles vérifiées</h3>
                      <p className="text-zinc-500 leading-relaxed">
                        Banques centrales, fonds d'investissement majeurs, rapports officiels. Chaque information est
                        vérifiée à la source avant publication.
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5">FED · BCE</span>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5">Bloomberg</span>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5">Reuters</span>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5">OCDE</span>
                      </div>
                    </div>
                  </div>
                </MinimalCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* PRICING - Style de la page Tarif */}
        <section className="relative py-16 md:py-20 px-4 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeInUp}
              className="text-center mb-12 md:mb-16 space-y-4"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Commencez gratuitement</h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Testez NewsFlow pendant 14 jours. Aucune carte requise.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8 items-center"
            >
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  variants={itemVariants}
                  className={`relative group ${plan.highlighted ? "md:scale-105" : ""}`}
                >
                  {/* Carte */}
                  <div
                    className={`relative h-full rounded-3xl p-5 md:p-6 2xl:p-8 backdrop-blur-xl border ${plan.cardStyle} transition-all duration-500 hover:border-white/20`}
                  >
                    {/* Badge dynamique */}
                    {plan.badgeText && (
                      <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-medium ${
                        plan.planId === 'basic' 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}>
                        {plan.badgeText}
                      </div>
                    )}

                    {/* Glow effect pour carte Pro */}
                    {plan.planId === 'pro' && (
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500 rounded-3xl blur-xl opacity-15 group-hover:opacity-25 transition-opacity duration-500" />
                    )}
                    
                    {/* Glow effect pour carte Basic */}
                    {plan.planId === 'basic' && (
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
                    )}

                    {/* Contenu */}
                    <div className="relative z-10 space-y-4 md:space-y-5">
                      {/* Header */}
                      <div className="space-y-2">
                        <h3 className="text-xl md:text-2xl font-bold text-white">{plan.name}</h3>
                        <p className="text-sm text-zinc-500 uppercase tracking-wider">{plan.tagline}</p>
                      </div>

                      {/* Prix */}
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl md:text-5xl font-bold text-white">{plan.price}€</span>
                          <span className="text-sm md:text-base text-zinc-400">{plan.period}</span>
                        </div>
                        <p className="text-sm text-zinc-500">{plan.description}</p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2 py-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-zinc-300">
                            <Check className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      {plan.planId === "free" ? (
                        <Button
                          asChild
                          className="w-full py-4 md:py-5 text-base font-semibold rounded-xl transition-all duration-300 bg-white/5 text-white hover:bg-white/10 border border-white/10"
                        >
                          <Link href={plan.href}>{plan.cta}</Link>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            const planConfig = getPlanConfig(plan.planId)
                            if (planConfig.stripePriceId) {
                              handleCheckout(planConfig.stripePriceId, plan.planId)
                            } else {
                              toast({
                                title: "Erreur",
                                description: "Le prix Stripe n'est pas configuré pour ce plan.",
                                variant: "destructive",
                              })
                            }
                          }}
                          disabled={loadingPlan !== null}
                          className={`w-full py-4 md:py-5 text-base font-semibold rounded-xl transition-all duration-300 ${
                            plan.planId === 'basic'
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50"
                              : plan.planId === 'pro'
                              ? "bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500 text-white hover:shadow-lg hover:shadow-amber-500/50 disabled:opacity-50"
                              : ""
                          }`}
                        >
                          {loadingPlan === plan.planId ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Redirection vers Stripe...
                            </>
                          ) : (
                            plan.cta
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="relative py-32 px-4 border-t border-white/5">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeInUp}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Arrêtez de chercher.
                <br />
                Commencez à savoir.
              </h2>
              <p className="text-lg text-zinc-300 max-w-xl mx-auto">
                Rejoignez les professionnels qui ont remplacé leur veille chronophage par NewsFlow.
              </p>
              <div className="relative inline-block group">
                <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <Button
                  asChild
                  size="lg"
                  className="relative bg-white text-black hover:bg-zinc-100 font-medium rounded-full px-10 py-6 text-lg"
                >
                  <Link href="/signup">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer minimaliste */}
        <footer className="relative border-t border-white/5 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Produit</h4>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li>
                    <Link href="/features" className="hover:text-white transition-colors">
                      Fonctionnalités
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="hover:text-white transition-colors">
                      Tarifs
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-it-works" className="hover:text-white transition-colors">
                      Comment ça marche
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Entreprise</h4>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li>
                    <Link href="/about" className="hover:text-white transition-colors">
                      À propos
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Ressources</h4>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li>
                    <Link href="/docs" className="hover:text-white transition-colors">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/api" className="hover:text-white transition-colors">
                      API
                    </Link>
                  </li>
                  <li>
                    <Link href="/roadmap" className="hover:text-white transition-colors">
                      Roadmap
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Légal</h4>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li>
                    <Link href="/legal/privacy" className="hover:text-white transition-colors">
                      Confidentialité
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/terms" className="hover:text-white transition-colors">
                      CGU
                    </Link>
                  </li>
                  <li>
                    <Link href="/legal/cookies" className="hover:text-white transition-colors">
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/5 pt-8 text-center text-sm text-zinc-600">
              <span>© 2026 NewsFlow. Tous droits réservés.</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
