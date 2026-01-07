"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import Navbar from "@/components/layout/navbar"
import { ThumbsUp, Calendar } from "lucide-react"

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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

// Données des cartes
const plannedItems = [
  {
    id: 1,
    title: "Application Mobile iOS & Android",
    description: "Accédez à vos Flows depuis votre smartphone avec une application native optimisée.",
    votes: 145,
  },
  {
    id: 2,
    title: "Mode hors-ligne",
    description: "Téléchargez vos Flows pour les consulter sans connexion internet.",
    votes: 89,
  },
  {
    id: 3,
    title: "Export PDF personnalisé",
    description: "Générez des rapports PDF avec votre branding et mise en page personnalisée.",
    votes: 67,
  },
]

const inProgressItems = [
  {
    id: 4,
    title: "Intégration Notion & Slack",
    description: "Envoyez automatiquement vos Flows dans vos espaces de travail Notion et Slack.",
    eta: "Q1 2026",
  },
  {
    id: 5,
    title: "API GraphQL",
    description: "Nouvelle API GraphQL pour des requêtes plus flexibles et performantes.",
    eta: "Q1 2026",
  },
  {
    id: 6,
    title: "Mode sombre amélioré",
    description: "Interface encore plus confortable avec de nouveaux thèmes sombres personnalisables.",
    eta: "Q1 2026",
  },
]

const doneItems = [
  {
    id: 7,
    title: "Connexion Google OAuth",
    description: "Connectez-vous rapidement avec votre compte Google.",
    date: "Décembre 2025",
  },
  {
    id: 8,
    title: "Deep Search amélioré",
    description: "Algorithme de recherche approfondie optimisé pour de meilleurs résultats.",
    date: "Novembre 2025",
  },
  {
    id: 9,
    title: "Système de projets",
    description: "Organisez vos Flows par projets pour une meilleure gestion.",
    date: "Octobre 2025",
  },
]

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Roadmap Publique
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-zinc-400 max-w-2xl mx-auto"
            >
              Découvrez ce que nous préparons. La transparence est notre priorité.
            </motion.p>
          </motion.div>

          {/* Tableau Kanban */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Colonne 1 : En réflexion */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💡</span>
                <h2 className="text-lg font-semibold text-zinc-300">En réflexion</h2>
                <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {plannedItems.length}
                </span>
              </div>
              
              <div className="space-y-4">
                {plannedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg border border-white/10 bg-zinc-900 p-4 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-400 mb-3 leading-relaxed">{item.description}</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{item.votes} votes</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Colonne 2 : En cours de développement */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏗️</span>
                <h2 className="text-lg font-semibold text-zinc-300">En cours de développement</h2>
                <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {inProgressItems.length}
                </span>
              </div>
              
              <div className="space-y-4">
                {inProgressItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg border border-blue-500/30 bg-zinc-900 p-4 hover:border-blue-500/50 transition-all cursor-pointer relative"
                  >
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {item.eta}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-2 pr-16">{item.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Colonne 3 : Déployé récemment */}
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✅</span>
                <h2 className="text-lg font-semibold text-zinc-300">Déployé récemment</h2>
                <span className="ml-auto px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                  {doneItems.length}
                </span>
              </div>
              
              <div className="space-y-4">
                {doneItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-lg border border-green-500/30 bg-zinc-900 p-4 hover:border-green-500/50 transition-all cursor-pointer"
                  >
                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-400 mb-3 leading-relaxed">{item.description}</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{item.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="mt-16 text-center"
          >
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-3 text-white">Votre avis compte</h3>
              <p className="text-zinc-400 mb-6 max-w-2xl mx-auto">
                Vous avez une idée de fonctionnalité ? Partagez-la avec nous et votez pour les fonctionnalités 
                qui vous intéressent le plus.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
              >
                Proposer une fonctionnalité
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}






