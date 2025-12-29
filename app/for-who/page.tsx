"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, type Variants } from "framer-motion"
import Navbar from "@/components/layout/navbar"
import { Radar, Zap, Network, Check } from "lucide-react"

// Variants pour animations scroll reveal
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

// Composant Carte Holographique
function HolographicCard({
  children,
  gradientFrom,
  gradientTo,
  glowColor,
  className = "",
}: {
  children: React.ReactNode
  gradientFrom: string
  gradientTo: string
  glowColor: string
  className?: string
}) {
  return (
    <div className={`relative group ${className}`}>
      {/* Halo de fond coloré */}
      <div
        className={`absolute inset-0 ${glowColor} blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}
      />

      {/* Carte holographique */}
      <div className="relative rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-8 h-full">
        {/* Bordure dégradée avec wrapper */}
        <div
          className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10`}
        />

        {/* Glow au survol */}
        <div
          className={`absolute -inset-1 rounded-2xl ${glowColor} blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`}
        />

        {/* Contenu */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  )
}

// Composant Visuel Abstrait
function AbstractVisual({
  gradientFrom,
  gradientTo,
  icon: Icon,
  className = "",
}: {
  gradientFrom: string
  gradientTo: string
  icon: React.ComponentType<{ className?: string }>
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Halo coloré en arrière-plan */}
      <div
        className={`absolute inset-0 ${gradientFrom.includes("cyan") ? "bg-cyan-500/20" : gradientFrom.includes("purple") ? "bg-purple-500/20" : "bg-amber-500/20"} blur-3xl rounded-full`}
      />

      {/* Carte holographique avec visuel */}
      <HolographicCard
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        glowColor={gradientFrom.includes("cyan") ? "bg-cyan-500" : gradientFrom.includes("purple") ? "bg-purple-500" : "bg-amber-500"}
        className="h-full min-h-[400px]"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-6">
            <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-20`}>
              <Icon className="h-16 w-16 text-white" />
            </div>
            <div className="space-y-2">
              <div className={`h-2 w-32 mx-auto rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-30`} />
              <div className={`h-2 w-24 mx-auto rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} opacity-20`} />
            </div>
          </div>
        </div>
      </HolographicCard>
    </div>
  )
}

export default function ForWhoPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-32"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Une puissance adaptée à votre ambition.
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              NewsFlow n'est pas juste un outil de veille. C'est un moteur d'intelligence qui évolue avec votre stratégie.
            </p>
          </motion.section>

          {/* Section 1 : L'Investisseur Individuel - Texte Gauche | Visuel Droite */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-150px" }}
            className="py-32 relative"
          >
            {/* Halo cyan en arrière-plan */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              {/* Texte à gauche */}
              <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
                    <Radar className="h-5 w-5 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-400">L'Investisseur Individuel</span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl font-bold text-white">
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      L'Investisseur Averti
                    </span>
                  </h2>

                  <p className="text-xl text-gray-300 leading-relaxed">
                    Comprenez le marché sans le bruit. Une synthèse claire pour démarrer sans stress.
                  </p>

                  <p className="text-lg text-gray-400 leading-relaxed">
                    Ne subissez plus le marché. Comprenez-le. NewsFlow filtre le bruit médiatique pour ne vous livrer que les faits qui impactent votre portefeuille. Passez de la réaction émotionnelle à la décision rationnelle en quelques minutes par jour.
                  </p>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300">Synthèse quotidienne</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300">Alertes anti-bruit</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300">Compréhension des tendances</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Visuel à droite */}
              <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <AbstractVisual
                  gradientFrom="from-cyan-500"
                  gradientTo="to-blue-500"
                  icon={Radar}
                />
              </motion.div>
            </div>
          </motion.section>

          {/* Section 2 : Le Trader Actif - Visuel Gauche | Texte Droite */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-150px" }}
            className="py-32 relative"
          >
            {/* Halo violet en arrière-plan */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              {/* Visuel à gauche */}
              <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:order-1">
                <AbstractVisual
                  gradientFrom="from-purple-500"
                  gradientTo="to-pink-500"
                  icon={Zap}
                />
              </motion.div>

              {/* Texte à droite */}
              <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="lg:order-2">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
                    <Zap className="h-5 w-5 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">Le Trader Actif</span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl font-bold text-white">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Le Trader & Analyste
                    </span>
                  </h2>

                  <p className="text-xl text-gray-300 leading-relaxed">
                    L'Alpha à la vitesse de la lumière. Signaux temps réel et Deep Search pour surperformer.
                  </p>

                  <p className="text-lg text-gray-400 leading-relaxed">
                    L'information est votre alpha. Détectez les catalyseurs de marché avant qu'ils ne soient pricés. Notre mode 'Deep Search' croise les données macro, crypto et forex pour révéler des corrélations invisibles aux outils classiques.
                  </p>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300">Flux temps réel milliseconde</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300">Analyse de sentiment IA</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300">Détection de signaux faibles</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Section 3 : L'Institutionnel - Texte Gauche | Visuel Droite */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-150px" }}
            className="py-32 relative"
          >
            {/* Halo ambre en arrière-plan */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              {/* Texte à gauche */}
              <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
                    <Network className="h-5 w-5 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400">L'Institutionnel</span>
                  </div>

                  <h2 className="text-4xl sm:text-5xl font-bold text-white">
                    <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      Fonds & Entreprises
                    </span>
                  </h2>

                  <p className="text-xl text-gray-300 leading-relaxed">
                    Infrastructure globale. API, Rapports White-Label et couverture 24/7.
                  </p>

                  <p className="text-lg text-gray-400 leading-relaxed">
                    L'infrastructure de veille ultime. Intégrez nos flux via API directement dans vos algorithmes de trading ou vos dashboards internes. Une couverture mondiale, multi-langues et 24/7 pour ne jamais laisser une opportunité géographique vous échapper.
                  </p>

                  <div className="space-y-3 pt-4">
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300">API dédiée & Webhooks</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300">Rapports marque blanche</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-gray-300">Support prioritaire</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Visuel à droite */}
              <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <AbstractVisual
                  gradientFrom="from-amber-400"
                  gradientTo="to-orange-500"
                  icon={Network}
                />
              </motion.div>
            </div>
          </motion.section>

          {/* CTA Final */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center py-32"
          >
            <div className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl p-12 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-4 text-white">
                Prêt à transformer votre veille ?
              </h3>
              <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                Rejoignez des milliers d'investisseurs et de professionnels qui ont repris le contrôle de leur information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 border-0 rounded-full px-8 py-6 text-lg font-medium"
                >
                  <Link href="/signup">Commencer gratuitement</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-gray-200 hover:bg-gray-900 hover:text-white rounded-full px-8 py-6 text-lg font-medium"
                >
                  <Link href="/features">Découvrir les fonctionnalités</Link>
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                Sans carte bancaire • Personnalisation en 2 minutes
              </p>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
