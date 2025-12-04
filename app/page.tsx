"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Sparkles, Zap, Shield, Target } from "lucide-react"
import { motion, useScroll, useTransform, type Variants } from "framer-motion"
import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import Navbar from "@/components/layout/navbar"
import Marquee from "@/components/ui/marquee"

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

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

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
        <section className="relative min-h-screen flex items-center justify-center px-4 py-32">
          {/* Globe 3D en arrière-plan - Surveillance mondiale temps réel */}
          <div className="absolute inset-0 flex items-center justify-center opacity-50 -z-10">
            <div className="w-full h-full max-w-5xl">
              <Scene3DWrapper cameraPosition={[0, 0, 6]}>
                <NewsGlobe />
              </Scene3DWrapper>
            </div>
          </div>

          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-2 text-sm text-zinc-400"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              Intelligence Artificielle Propriétaire
            </motion.div>

            {/* Titre principal - Animation mot par mot */}
            <AnimatedTitle
              text="L'information que vous cherchiez. Livrée avant même de la demander."
              className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-white"
            />

            {/* Sous-titre */}
            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 1 }}
              className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed"
            >
              NewsFlow analyse des milliers de sources institutionnelles et synthétise l'essentiel. Chaque matin, dans
              votre boîte mail.
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
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
            </motion.div>

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

        {/* PRICING SIMPLE */}
        <section className="relative py-32 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeInUp}
              className="text-center mb-20 space-y-4"
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
              className="grid md:grid-cols-3 gap-4"
            >
              {/* Free */}
              <motion.div variants={itemVariants}>
                <MinimalCard className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Free</h3>
                      <p className="text-3xl font-bold text-white">0€</p>
                    </div>
                    <ul className="space-y-2 text-sm text-zinc-500">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-zinc-600" />1 projet
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-zinc-600" />7 Flows/semaine
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-zinc-600" />
                        Email quotidien
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white rounded-lg">
                      Essayer
                    </Button>
                  </div>
                </MinimalCard>
              </motion.div>

              {/* Pro */}
              <motion.div variants={itemVariants}>
                <MinimalCard className="p-6 border-white/20">
                  <div className="space-y-4">
                    <div>
                      <div className="inline-block px-2 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 mb-2">
                        Recommandé
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">Pro</h3>
                      <p className="text-3xl font-bold text-white">29€</p>
                    </div>
                    <ul className="space-y-2 text-sm text-zinc-400">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-indigo-500" />
                        10 projets
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-indigo-500" />
                        Flows illimités
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-indigo-500" />
                        Contrôle total
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-indigo-500" />
                        Support 24/7
                      </li>
                    </ul>
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-indigo-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                      <Button className="relative w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">
                        Commencer l'essai
                      </Button>
                    </div>
                  </div>
                </MinimalCard>
              </motion.div>

              {/* Trader */}
              <motion.div variants={itemVariants}>
                <MinimalCard className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Trader</h3>
                      <p className="text-3xl font-bold text-white">99€</p>
                    </div>
                    <ul className="space-y-2 text-sm text-zinc-500">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-zinc-600" />
                        Projets illimités
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-zinc-600" />
                        API Access
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-zinc-600" />
                        Account Manager
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white rounded-lg">
                      Contacter
                    </Button>
                  </div>
                </MinimalCard>
              </motion.div>
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
                    <Link href="#" className="hover:text-white transition-colors">
                      À propos
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Ressources</h4>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      API
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Légal</h4>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Confidentialité
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      CGU
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/5 pt-8 text-center text-sm text-zinc-600">
              <div className="flex items-center justify-center gap-4">
                <span>© 2025 NewsFlow. Tous droits réservés.</span>
                <span className="text-zinc-800">•</span>
                <Link 
                  href="/redeem" 
                  className="text-zinc-700 hover:text-zinc-400 transition-colors text-xs"
                >
                  J'ai un code d'accès
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
