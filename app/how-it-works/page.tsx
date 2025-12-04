"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/layout/navbar"
import { motion, useScroll, useTransform, type Variants } from "framer-motion"
import { Newspaper, Sparkles, Mail, Settings, Sliders, Target, Zap, FileText } from "lucide-react"
import { useRef } from "react"

// Variants pour animations
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
}

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
}

// Composant pour la carte spotlight
const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 ${className}`}>
    <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
    <div className="relative z-10">{children}</div>
  </div>
)

export default function HowItWorksPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Animation de la ligne directrice
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-zinc-950 text-white overflow-hidden">
      <Navbar />

      {/* Ligne directrice en arrière-plan */}
      <svg
        className="fixed left-1/2 top-0 -translate-x-1/2 h-full w-full pointer-events-none z-0 opacity-20"
        style={{ maxWidth: "1200px" }}
      >
        <motion.path
          d="M 600 100 Q 700 300 600 500 Q 500 700 600 900 Q 700 1100 600 1300 Q 500 1500 600 1700 Q 700 1900 600 2100"
          stroke="url(#gradient)"
          strokeWidth="2"
          fill="none"
          style={{
            pathLength,
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Contenu principal */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative container mx-auto px-4 pt-40 pb-20 md:pt-52 md:pb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="mx-auto max-w-4xl text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-400 mb-6">Le Parcours Complet</p>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
              Du chaos à la clarté :<br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                votre parcours NewsFlow
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto">
              Comprendre en 4 étapes comment notre IA transforme le bruit du web en information exploitable.
            </p>
          </motion.div>
        </section>

        {/* ÉTAPE 1 : Définition du Profil */}
        <section className="relative py-20 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Texte à gauche */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-300">
                  <Settings className="h-4 w-4" />
                  Étape 1
                </div>
                <h2 className="text-4xl md:text-5xl font-bold">Calibrez votre alter-ego IA</h2>
                <p className="text-lg text-zinc-300 leading-relaxed">
                  NewsFlow ne se contente pas de demander « quels sujets vous intéressent ». Nous créons un profil
                  complet : niveau d'expertise (débutant, intermédiaire, expert), langue préférée, ton de rédaction et
                  même votre activité professionnelle.
                </p>
                <p className="text-zinc-400">
                  Cette calibration est la fondation de la personnalisation. Elle garantit que chaque Flow est rédigé
                  avec le bon niveau de détail et le vocabulaire adapté à votre contexte.
                </p>
              </motion.div>

              {/* Visuel à droite */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
                transition={{ delay: 0.2 }}
              >
                <SpotlightCard className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300">Niveau d'expertise</span>
                      <span className="text-sm font-semibold text-white">Expert</span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "85%" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.1 }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <span className="text-sm text-zinc-300">Complexité</span>
                      <span className="text-sm font-semibold text-white">Avancé</span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "70%" }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        viewport={{ once: true, amount: 0.1 }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <span className="text-sm text-zinc-300">Personnalisation</span>
                      <span className="text-sm font-semibold text-white">Maximum</span>
                    </div>
                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "95%" }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                        viewport={{ once: true, amount: 0.1 }}
                      />
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                      <p className="text-sm text-zinc-400 text-center">
                        Votre profil unique détermine comment l'IA rédige pour vous
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ÉTAPE 2 : Configuration des Projets */}
        <section className="relative py-20 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Visuel à gauche */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerVariants}
                className="lg:order-1 order-2"
              >
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { title: "Bitcoin & Crypto", color: "from-purple-500/20 to-pink-500/20", icon: Sparkles },
                    { title: "Géopolitique", color: "from-blue-500/20 to-cyan-500/20", icon: Target },
                    { title: "Tech Giants", color: "from-indigo-500/20 to-violet-500/20", icon: Zap },
                  ].map((project, index) => {
                    const Icon = project.icon
                    return (
                      <motion.div key={project.title} variants={itemVariants} custom={index}>
                        <SpotlightCard className={`bg-gradient-to-br ${project.color}`}>
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">{project.title}</h3>
                              <p className="text-sm text-zinc-400">Projet actif</p>
                            </div>
                            <motion.div
                              className="ml-auto h-2 w-2 rounded-full bg-emerald-400"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                        </SpotlightCard>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              {/* Texte à droite */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
                className="space-y-6 lg:order-2 order-1"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-2 text-sm font-medium text-purple-300">
                  <Sliders className="h-4 w-4" />
                  Étape 2
                </div>
                <h2 className="text-4xl md:text-5xl font-bold">Structurez votre veille stratégique</h2>
                <p className="text-lg text-zinc-300 leading-relaxed">
                  Créez des projets distincts pour compartimenter vos centres d'intérêt. Chaque projet (Crypto, Macro
                  Économie, Géopolitique...) possède ses propres règles : sources privilégiées, niveau de détail,
                  fréquence de mise à jour.
                </p>
                <p className="text-zinc-400">
                  Cette approche modulaire vous permet de recevoir un Flow crypto ultra-technique le matin, et un
                  briefing géopolitique simplifié le soir, sans compromis.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ÉTAPE 3 : Le Moteur IA */}
        <section className="relative py-20 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Texte à gauche */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 border border-pink-500/20 px-4 py-2 text-sm font-medium text-pink-300">
                  <Zap className="h-4 w-4" />
                  Étape 3
                </div>
                <h2 className="text-4xl md:text-5xl font-bold">Ingestion, Analyse, Synthèse</h2>
                <p className="text-lg text-zinc-300 leading-relaxed">
                  C'est ici que la magie opère. Notre moteur IA scanne des milliers de sources (flux institutionnels,
                  médias, rapports officiels), filtre le bruit, détecte les signaux importants et structure
                  l'information en insights exploitables.
                </p>
                <p className="text-zinc-400">
                  Le processus est invisible pour vous, mais il combine recherche web avancée, scoring sémantique,
                  vérification multi-sources et génération de contenu par notre modèle neuronal propriétaire.
                </p>
              </motion.div>

              {/* Visuel à droite : Flux de données */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
                transition={{ delay: 0.2 }}
                className="relative h-96"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Sources (points dispersés) */}
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-2 w-2 rounded-full bg-zinc-400"
                      style={{
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 30 + 10}%`,
                      }}
                      animate={{
                        y: [0, 150],
                        opacity: [0.8, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    />
                  ))}

                  {/* Noyau central (IA) */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    animate={{
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        "0 0 20px rgba(99, 102, 241, 0.5)",
                        "0 0 40px rgba(168, 85, 247, 0.8)",
                        "0 0 20px rgba(99, 102, 241, 0.5)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                  </motion.div>

                  {/* Flux sortants (organisés) */}
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={`out-${i}`}
                      className="absolute h-1 bg-gradient-to-r from-purple-500 to-transparent rounded-full"
                      style={{
                        left: "50%",
                        top: `${60 + i * 10}%`,
                        width: "40%",
                      }}
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{
                        duration: 1,
                        delay: 2 + i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      viewport={{ once: false }}
                    />
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 text-center">
                  <p className="text-sm text-zinc-400">Des milliers de sources → Un seul Flow structuré</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ÉTAPE 4 : La Livraison */}
        <section className="relative py-20 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Visuel à gauche */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
                transition={{ delay: 0.2 }}
                className="lg:order-1 order-2 relative"
              >
                <div className="relative">
                  {/* Enveloppe qui s'ouvre */}
                  <motion.div
                    initial={{ rotateX: 0 }}
                    whileInView={{ rotateX: -20 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.1 }}
                    className="relative"
                  >
                    <SpotlightCard className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                          <Mail className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Votre Flow Quotidien</h4>
                          <p className="text-sm text-zinc-400">Tous les matins à 8h00</p>
                        </div>
                      </div>

                      {/* Aperçu du contenu */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        viewport={{ once: true, amount: 0.1 }}
                        className="space-y-3 mt-6 pt-6 border-t border-white/10"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-indigo-400" />
                          <span className="text-sm text-zinc-300">Bitcoin consolide au-dessus de 90k$</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-purple-400" />
                          <span className="text-sm text-zinc-300">Tensions USA-Chine : nouveaux tarifs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-pink-400" />
                          <span className="text-sm text-zinc-300">Apple annonce Vision Pro 2</span>
                        </div>
                      </motion.div>
                    </SpotlightCard>
                  </motion.div>
                </div>
              </motion.div>

              {/* Texte à droite */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
                className="space-y-6 lg:order-2 order-1"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300">
                  <Mail className="h-4 w-4" />
                  Étape 4
                </div>
                <h2 className="text-4xl md:text-5xl font-bold">Votre briefing, quand vous voulez</h2>
                <p className="text-lg text-zinc-300 leading-relaxed">
                  Recevez votre Flow directement par email chaque matin à l'heure de votre choix, ou consultez-le dans
                  le dashboard avec une interface de lecture Bloomberg-style : fond noir, typographie optimisée,
                  hiérarchie claire.
                </p>
                <p className="text-zinc-400">
                  Vous gardez le contrôle total : longueur du contenu (flash ou analyse approfondie), niveau de
                  complexité par projet, et accès à l'historique complet de vos Flows.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="relative py-32 border-t border-white/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
              variants={sectionVariants}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-600/40 via-purple-600/30 to-slate-900 p-12 md:p-16 text-center max-w-4xl mx-auto"
            >
              <div className="absolute inset-0 opacity-40">
                <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
              </div>
              <div className="relative z-10 space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">Prêt à configurer votre premier Flow ?</h2>
                <p className="text-lg text-white/90 max-w-2xl mx-auto">
                  Rejoignez les décideurs qui ont remplacé leur veille manuelle par un système intelligent. 14 jours
                  d'essai offerts, sans carte de crédit.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="min-w-[220px] bg-white text-zinc-900 hover:bg-zinc-100 font-semibold rounded-full py-6"
                  >
                    <Link href="/signup">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Commencer gratuitement
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="min-w-[220px] border-white/40 text-white hover:bg-white/10 rounded-full py-6"
                  >
                    <Link href="/features">Explorer les fonctionnalités</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Newspaper className="h-6 w-6 text-indigo-400" />
                  <span className="text-lg font-semibold text-white">NewsFlow</span>
                </div>
                <p className="text-sm text-zinc-400">L'actualité personnalisée, propulsée par l'IA</p>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-white">Produit</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>
                    <Link href="/features" className="hover:text-white transition-colors">
                      Fonctionnalités
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-it-works" className="hover:text-white transition-colors">
                      Comment ça marche
                    </Link>
                  </li>
                  <li>
                    <Link href="/#who" className="hover:text-white transition-colors">
                      Pour qui ?
                    </Link>
                  </li>
                  <li>
                    <Link href="/#pricing" className="hover:text-white transition-colors">
                      Tarifs
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="mb-4 font-semibold text-white">Entreprise</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
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
                <h4 className="mb-4 font-semibold text-white">Légal</h4>
                <ul className="space-y-2 text-sm text-zinc-400">
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
            <div className="mt-12 border-t border-white/5 pt-8 text-center text-sm text-zinc-500">
              © 2025 NewsFlow. Tous droits réservés.
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
