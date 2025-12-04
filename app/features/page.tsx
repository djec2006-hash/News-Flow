"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Shield, Zap, Layers, Globe2, Filter, Clock, BookOpen, Brain } from "lucide-react"
import Navbar from "@/components/layout/navbar"
import dynamic from "next/dynamic"

// Import des composants 3D avec chargement dynamique (SSR désactivé pour Three.js)
const Scene3DWrapper = dynamic(() => import("@/components/3d/Scene3DWrapper"), { ssr: false })
const NeuralBrain = dynamic(() => import("@/components/3d/features/NeuralBrain"), { ssr: false })
const ModularCube = dynamic(() => import("@/components/3d/features/ModularCube"), { ssr: false })

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const cascadeFade: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: index * 0.1,
    },
  }),
}

const viewportConfig = { once: true, margin: "-100px" } as const

const aiPipelines = [
  {
    eyebrow: "Section 1 · IA propriétaire",
    title: "Moteur neuronal avancé",
    description:
      "Notre intelligence artificielle propriétaire absorbe des millions de signaux bruts, les normalise puis les reconstruit en insights exploitables. Traitement du signal, pondération contextuelle et synthèse cognitive sont orchestrés sous une seule pile.",
    bullet: [
      "Filtration du bruit en temps réel",
      "Scoring sémantique et détection d'anomalies",
      "Narration adaptée à votre style décisionnel",
    ],
    gradient: "from-indigo-500/30 via-violet-500/20 to-rose-500/30",
  },
  {
    eyebrow: "Section 1 · Contrôle qualité",
    title: "Vérifications multi-sources",
    description:
      "Un module de veille compare chaque signal à nos flux institutionnels, valide les dates, détecte les biais et traque les incohérences. Le résultat : une information vérifiée à la source avant de rejoindre votre Flow.",
    bullet: [
      "Priorisation par crédibilité et fraîcheur",
      "Clusterisation thématique instantanée",
      "Trace d'audit consultable à tout moment",
    ],
    gradient: "from-sky-500/30 via-cyan-400/20 to-emerald-400/30",
  },
]

const projectCards = [
  {
    title: "Bitcoin & Altcoins",
    description: "Surveillez les cycles, l'adoption et les décisions réglementaires en un seul coup d'œil.",
    points: ["Sentiment marché minute par minute", "Alertes régulation", "Suivi on-chain simplifié"],
    accent: "from-purple-500/30 to-pink-500/30",
  },
  {
    title: "Géopolitique mondiale",
    description: "Décodez les tensions USA-Chine, les conflits majeurs et leurs impacts business.",
    points: ["Cartographie des zones chaudes", "Briefings diplomatiques", "Impacts sur l'énergie et la tech"],
    accent: "from-red-500/30 to-slate-500/30",
  },
  {
    title: "Tech Giants",
    description: "Apple, Nvidia, Microsoft : suivez leurs feuilles de route, acquisitions et paris IA.",
    points: ["Veille produits", "Stratégies IA", "Lecture des earnings calls"],
    accent: "from-blue-500/30 to-indigo-500/30",
  },
  {
    title: "Macro Économie",
    description: "Inflation, taux directeurs, risques de récession : tout est contextualisé pour vous.",
    points: ["Surveillance banques centrales", "Scénarios macro", "Indicateurs avancés clés"],
    accent: "from-amber-500/30 to-orange-500/30",
  },
  {
    title: "Immobilier & Taux",
    description: "Comprenez les dynamiques immobilières US/EU et leur corrélation avec les taux.",
    points: ["Courbes des taux", "Données transactionnelles", "Synthèse des politiques locales"],
    accent: "from-emerald-500/30 to-lime-500/30",
  },
  {
    title: "Startups & VC",
    description: "Repérez les levées majeures, nouveaux fonds et signaux émergents.",
    points: ["Dealflow structuré", "Cartographie des acteurs", "Narratives sectorielles"],
    accent: "from-fuchsia-500/30 to-cyan-500/30",
  },
]

const readingHighlights = [
  { title: "Mode sombre signature", text: "Fond zinc-950, typographie Geist optimisée pour de longues sessions de lecture." },
  { title: "Structure éditoriale", text: "Sections hiérarchisées, ANC (Analyse · Narration · Conclusion) pour scanner en 90 secondes." },
  { title: "Gains de temps", text: "Chaque Flow montre le temps estimé économisé et les actions prioritaires." },
  {
    title: "Vous êtes le pilote",
    text: "Ajustez la longueur (du flash info au dossier complet) et la complexité (débutant à expert) pour chaque projet.",
  },
]

const trustPoints = [
  {
    title: "Flux institutionnels",
    text: "Banques centrales (FED, BCE), agences statistiques, rapports officiels et données de marché temps réel alimentent nos briefs.",
  },
  {
    title: "Score de fiabilité",
    text: "Chaque paragraphe est vérifié à la source puis noté selon la cohérence des documents institutionnels associés.",
  },
  {
    title: "Filtre anti fake news",
    text: "Cross-check automatique, détection des biais et rejet des sites non institutionnels avant publication.",
  },
]

const separator = <div className="my-24 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 ${className}`}
  >
    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
    <div className="relative z-10 space-y-4">{children}</div>
  </motion.div>
)

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-white">
      <Navbar />
      {/* Spot lumineux subtil réduit pour cohérence */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.03),_transparent_60%)]" />
      <div className="mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-32 pt-24 lg:px-12">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-center space-y-6"
        >
          <motion.p variants={fadeInUp} className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            Feature Deep Dive
          </motion.p>
          <motion.h1 variants={fadeInUp} transition={{ delay: 0.1 }} className="text-4xl font-bold sm:text-5xl md:text-6xl">
            Plongez dans le moteur de NewsFlow
          </motion.h1>
          <motion.p variants={fadeInUp} transition={{ delay: 0.2 }} className="text-lg text-zinc-300 md:text-xl">
            Architecture IA, bento d&apos;insights et expérience Bloomberg-ready : découvrez comment nous produisons un Flow
            taillé pour les décideurs.
          </motion.p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="px-8 py-6 text-base font-semibold">
              <Link href="/signup">
                <Sparkles className="mr-2 h-5 w-5" />
                Créer mon compte
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 px-8 py-6 text-base text-white hover:bg-white/10">
              <Link href="/how-it-works">Voir la stack complète</Link>
            </Button>
          </div>
        </motion.section>

        {separator}

        <motion.section
          className="space-y-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <motion.div className="space-y-4" initial="hidden" whileInView="visible" viewport={viewportConfig}>
            <motion.p variants={fadeInUp} className="text-sm uppercase tracking-[0.3em] text-indigo-300">
              Section 1
            </motion.p>
            <motion.h2 variants={fadeInUp} transition={{ delay: 0.1 }} className="text-3xl font-bold md:text-4xl">
              Une Intelligence Artificielle propriétaire
            </motion.h2>
            <motion.p variants={fadeInUp} transition={{ delay: 0.2 }} className="text-lg text-zinc-300">
              Notre moteur neuronal avancé traite le bruit du web, extrait le signal utile et synthétise des décisions
              exploitables. Vous obtenez une vision claire sans jamais dévoiler notre stack interne.
            </motion.p>
          </motion.div>

          <div className="space-y-20">
            {aiPipelines.map((block, index) => (
              <div key={block.title} className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <motion.div
                  className={index % 2 !== 0 ? "lg:order-2" : ""}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={fadeInUp}
                  transition={{ duration: 0.7 }}
                >
                  <SpotlightCard className="bg-black/40">
                    <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">{block.eyebrow}</span>
                    <h3 className="text-2xl font-semibold">{block.title}</h3>
                    <p className="text-zinc-300">{block.description}</p>
                    <ul className="space-y-2 text-sm text-zinc-200">
                      {block.bullet.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Brain className="mt-1 h-4 w-4 text-indigo-300" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </SpotlightCard>
                </motion.div>
                <motion.div
                  className={`relative h-[400px] rounded-[32px] border border-white/5 bg-zinc-900/40 ${
                    index % 2 !== 0 ? "lg:order-1" : ""
                  }`}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={fadeInUp}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  {/* Scène 3D : NeuralBrain */}
                  {index === 0 && (
                    <Scene3DWrapper cameraPosition={[0, 0, 6]}>
                      <NeuralBrain />
                    </Scene3DWrapper>
                  )}
                  {/* Scène 3D alternative pour le second bloc */}
                  {index === 1 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4 p-8">
                        <Zap className="h-12 w-12 text-indigo-400 mx-auto animate-pulse" />
                        <div className="space-y-2 text-sm text-white/90">
                          <p>1. Ingestion multi-sources</p>
                          <p>2. Scoring &amp; clustering</p>
                          <p>3. Synthèse cognitive</p>
                          <p>4. Validation interne</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>

        {separator}

        <motion.section
          className="space-y-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <motion.div className="space-y-4" initial="hidden" whileInView="visible" viewport={viewportConfig}>
            <motion.p variants={fadeInUp} className="text-sm uppercase tracking-[0.3em] text-sky-300">
              Section 2
            </motion.p>
            <motion.h2 variants={fadeInUp} transition={{ delay: 0.1 }} className="text-3xl font-bold md:text-4xl">
              Ultra-personnalisation par projet
            </motion.h2>
            <motion.p variants={fadeInUp} transition={{ delay: 0.2 }} className="text-lg text-zinc-300">
              Composez votre propre bento de projets (Forex, Crypto, Énergie, etc.). Chaque carte ajuste les sources,
              l&apos;analyse et la granularité selon vos priorités.
            </motion.p>
          </motion.div>

          {/* Scène 3D : ModularCube */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="h-[400px] rounded-[32px] border border-white/5 bg-zinc-900/40 mb-10"
          >
            <Scene3DWrapper cameraPosition={[0, 0, 4]}>
              <ModularCube />
            </Scene3DWrapper>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectCards.map((card, index) => (
              <motion.div
                key={card.title}
                className="h-full"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={cascadeFade}
                custom={index}
              >
                <SpotlightCard className={`h-full bg-zinc-900/40`}>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="text-sm text-zinc-200">{card.description}</p>
                  <ul className="space-y-2 text-sm text-white/90">
                    {card.points.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <Layers className="mt-1 h-4 w-4" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {separator}

        <motion.section
          className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <motion.div className="space-y-6" initial="hidden" whileInView="visible" viewport={viewportConfig}>
            <motion.p variants={fadeInUp} className="text-sm uppercase tracking-[0.3em] text-pink-300">
              Section 3
            </motion.p>
            <motion.h2 variants={fadeInUp} transition={{ delay: 0.1 }} className="text-3xl font-bold md:text-4xl">
              L&apos;expérience de lecture
            </motion.h2>
            <motion.p variants={fadeInUp} transition={{ delay: 0.2 }} className="text-lg text-zinc-300">
              Interface épurée, hiérarchies typographiques maîtrisées et mode sombre calibré pour les longues sessions
              Bloomberg-style.
            </motion.p>
            <div className="space-y-4">
              {readingHighlights.map((item) => (
                <SpotlightCard key={item.title} className="bg-black/30 p-6">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-zinc-300">{item.text}</p>
                </SpotlightCard>
              ))}
            </div>
          </motion.div>

          {/* Illustration statique : Focus & Clarté */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[400px] rounded-[32px] border border-white/5 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 lg:order-2 flex items-center justify-center p-8"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Simulation de page de texte hiérarchisé */}
              <div className="space-y-3 w-full max-w-sm">
                {/* Titre (large barre blanche) */}
                <div className="h-4 bg-white/80 rounded-full w-3/4" />
                
                {/* Paragraphe 1 (barres grises) */}
                <div className="space-y-2 opacity-40">
                  <div className="h-2 bg-zinc-400 rounded-full w-full" />
                  <div className="h-2 bg-zinc-400 rounded-full w-5/6" />
                  <div className="h-2 bg-zinc-400 rounded-full w-4/5" />
                </div>

                {/* Zone de focus (lentille lumineuse) */}
                <div className="relative py-4">
                  {/* Glow circulaire derrière */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-32 bg-indigo-500/10 blur-3xl rounded-full" />
                  </div>
                  
                  {/* Texte en focus (blanc lumineux) */}
                  <div className="relative space-y-2">
                    <div className="h-2.5 bg-white rounded-full w-full" />
                    <div className="h-2.5 bg-white rounded-full w-11/12" />
                    <div className="h-2.5 bg-white rounded-full w-4/5" />
                  </div>
                </div>

                {/* Paragraphe 2 (barres grises) */}
                <div className="space-y-2 opacity-40">
                  <div className="h-2 bg-zinc-400 rounded-full w-full" />
                  <div className="h-2 bg-zinc-400 rounded-full w-3/4" />
                </div>

                {/* Icône de lecture rapide */}
                <div className="absolute top-4 right-4 flex items-center gap-2 text-zinc-500">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">~2 min</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 space-y-6"
          >
            <div className="flex items-center gap-3 text-zinc-300">
              <Clock className="h-5 w-5 text-indigo-300" />
              4h43 économisées / semaine
            </div>
            <div className="space-y-3 text-sm text-zinc-200">
              <p>• Mode Lecture : optimise marges et interlignage.</p>
              <p>• Résumés dynamiques : switch entre TL;DR, Standard, Expert.</p>
              <p>• Synchronisation multi-supports avec reprise de lecture.</p>
            </div>
            <SpotlightCard className="bg-white/10 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/70">Gain de temps</p>
              <p className="text-2xl font-semibold text-white">x5</p>
              <p className="text-sm text-zinc-200">Comparé à une veille manuelle classique.</p>
            </SpotlightCard>
          </motion.div>
        </motion.section>

        {separator}

        <motion.section
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
        >
          <motion.div className="space-y-4" initial="hidden" whileInView="visible" viewport={viewportConfig}>
            <motion.p variants={fadeInUp} className="text-sm uppercase tracking-[0.3em] text-emerald-300">
              Section 4
            </motion.p>
            <motion.h2 variants={fadeInUp} transition={{ delay: 0.1 }} className="text-3xl font-bold md:text-4xl">
              Sources &amp; Fiabilité
            </motion.h2>
            <motion.p variants={fadeInUp} transition={{ delay: 0.2 }} className="text-lg text-zinc-300">
              Chaque Flow embarque son audit trail : d&apos;où vient l&apos;info, quand a-t-elle été vérifiée, pourquoi vous
              pouvez agir dessus.
            </motion.p>
          </motion.div>

          {/* Illustration statique : Forteresse de Données */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="h-[400px] rounded-[32px] border border-white/5 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 mb-8 flex items-center justify-center p-8"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Cercles concentriques de sécurité */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                <defs>
                  <radialGradient id="glowGradient">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </radialGradient>
                </defs>
                
                {/* Cercles concentriques */}
                <circle
                  cx="200"
                  cy="200"
                  r="140"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="100"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="60"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
                
                {/* Halo central */}
                <circle cx="200" cy="200" r="80" fill="url(#glowGradient)" />
                
                {/* Lignes de flux sécurisés (radiantes) */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                  const rad = (angle * Math.PI) / 180
                  const x1 = 200 + Math.cos(rad) * 40
                  const y1 = 200 + Math.sin(rad) * 40
                  const x2 = 200 + Math.cos(rad) * 140
                  const y2 = 200 + Math.sin(rad) * 140
                  
                  return (
                    <line
                      key={angle}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#6366f1"
                      strokeWidth="0.5"
                      opacity="0.15"
                      strokeDasharray="4 4"
                    />
                  )
                })}
              </svg>

              {/* Icône centrale (cadenas brillant) */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full" />
                <Shield className="h-16 w-16 text-indigo-400 relative drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
              </div>

              {/* Indicateurs de sécurité aux coins */}
              <div className="absolute top-6 right-6 flex items-center gap-2 text-emerald-400 text-xs">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono">VERIFIED</span>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {trustPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={cascadeFade}
                custom={index}
              >
                <SpotlightCard className="bg-black/40 p-6">
                  <div className="flex items-center gap-2 text-sm text-emerald-300">
                    <Shield className="h-4 w-4" />
                    Fiabilité
                  </div>
                  <h3 className="text-xl font-semibold">{point.title}</h3>
                  <p className="text-sm text-zinc-300">{point.text}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
          <SpotlightCard className="bg-zinc-900/40">
            <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-200">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-emerald-300" />
                Flux institutionnels (FED, BCE, OCDE)
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-emerald-300" />
                Fonds d&apos;investissement &amp; desks marchés
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-300" />
                Rapports officiels &amp; données temps réel
              </div>
            </div>
            <p className="mt-4 text-sm text-white/80">Chaque insight est vérifié à la source avant d&apos;intégrer votre Flow.</p>
          </SpotlightCard>
        </motion.section>

        {separator}

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 p-12 text-center"
        >
          <div className="absolute inset-0 opacity-40">
            <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
          </div>
          <div className="relative z-10 space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">CTA</p>
            <h2 className="text-4xl font-bold">Prêt à dominer votre veille stratégique ?</h2>
            <p className="text-lg text-white/90">
              Rejoignez les équipes qui remplacent les PDF interminables par un Flow ultra-personnalisé. 14 jours d&apos;essai
              offerts.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="px-8 py-6 text-base font-semibold">
                <Link href="/signup">Commencer gratuitement</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/40 px-8 py-6 text-base text-white">
                <Link href="/how-it-works">Voir la démo en détail</Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}


