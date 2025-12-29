"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, type Variants } from "framer-motion"
import Navbar from "@/components/layout/navbar"
import { Shield, Zap, Target, ArrowRight } from "lucide-react"

// Variants pour animations
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

// Section Hero avec layout 2 colonnes
const HeroSection = () => {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Colonne gauche - Texte */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-white">
              L'intelligence artificielle au service de votre veille stratégique.
            </h1>
            <p className="text-xl sm:text-2xl text-zinc-400 leading-relaxed">
              Nous transformons le bruit de l'information mondiale en signaux clairs et exploitables pour les décideurs.
            </p>
          </motion.div>

          {/* Colonne droite - Visuel 3D Placeholder */}
          <motion.div
            variants={scaleIn}
            className="relative h-[500px] rounded-3xl border border-white/10 bg-gradient-to-br from-black via-zinc-950 to-blue-950 overflow-hidden"
          >
            {/* Fond dégradé subtil */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 via-blue-950/30 to-indigo-950/50" />
            
            {/* Placeholder pour illustration 3D */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-indigo-400/50 rounded-lg" />
                  </div>
                </div>
                <p className="text-sm text-zinc-500 font-mono tracking-wider">
                  [Emplacement pour Illustration 3D Abstract Data Flow]
                </p>
                <p className="text-xs text-zinc-600 italic">
                  Spline ou Rive
                </p>
              </div>
            </div>

            {/* Effet de glow subtil */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 via-transparent to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

// Section Mission
const MissionSection = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xl sm:text-2xl text-zinc-300 leading-relaxed font-light">
          Le volume de données double tous les deux ans. L'humain ne peut plus suivre.{" "}
          <span className="text-white font-medium">NewsFlow n'est pas juste un agrégateur, c'est votre analyste personnel qui ne dort jamais.</span>
        </p>
      </div>
    </motion.section>
  )
}

// Bento Grid pour les valeurs
const ValuesGrid = () => {
  const values = [
    {
      title: "Transparence Totale",
      description: "Pas de boîte noire. Nos algorithmes sont explicables et vos sources sont toujours citées.",
      icon: Shield,
      gradient: "from-indigo-500 to-purple-500",
      size: "col-span-1 md:col-span-2",
    },
    {
      title: "Vitesse Temps Réel",
      description: "L'information n'a de valeur que si elle est fraîche. Nous la captons à la source.",
      icon: Zap,
      gradient: "from-cyan-500 to-blue-500",
      size: "col-span-1",
    },
    {
      title: "Focus Laser",
      description: "Filtrage drastique. Nous éliminons 99% du bruit pour ne garder que l'essentiel.",
      icon: Target,
      gradient: "from-purple-500 to-pink-500",
      size: "col-span-1",
    },
  ]

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                variants={fadeInUp}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-white/20 transition-all duration-300 ${value.size}`}
              >
                {/* Gradient background au hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${value.gradient} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{value.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}

// Section CTA Finale
const CTASection = () => {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div variants={fadeInUp} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl" />
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-12 backdrop-blur-sm">
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white"
            >
              Prêt à voir plus clair ?
            </motion.h2>
            <motion.div variants={fadeInUp}>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 hover:shadow-lg hover:shadow-purple-500/50 transition-all rounded-full px-8 py-6 text-lg"
              >
                <Link href="/login">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

// Page principale
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="relative">
        {/* Background gradient subtle */}
        <div className="fixed inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-blue-950/20 pointer-events-none" />
        
        <HeroSection />
        <MissionSection />
        <ValuesGrid />
        <CTASection />
      </main>
    </div>
  )
}
