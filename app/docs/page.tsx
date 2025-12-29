"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Mail, TrendingUp, Search } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { motion, type Variants } from "framer-motion"

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

const quickStartCards = [
  {
    title: "Créer votre premier Flow",
    description: "Apprenez à générer votre premier rapport personnalisé en quelques minutes. Guide pas à pas avec captures d'écran.",
    icon: Sparkles,
    href: "/docs/create-flow",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "Configurer vos alertes email",
    description: "Recevez vos Flows directement dans votre boîte mail. Configurez la fréquence et le format selon vos préférences.",
    icon: Mail,
    href: "/docs/alerts",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Comprendre le score de pertinence",
    description: "Découvrez comment notre IA évalue la pertinence des informations et comment interpréter les scores affichés.",
    icon: TrendingUp,
    href: "/docs/score",
    gradient: "from-pink-500 to-indigo-500",
  },
]

export default function DocsPage() {
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-zinc-400">Documentation</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mb-12"
      >
        <motion.h1
          variants={fadeInUp}
          className="text-5xl sm:text-6xl font-bold mb-6 !text-white"
        >
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Centre d'aide & Documentation
          </span>
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-xl text-zinc-400 leading-relaxed !mt-0"
        >
          Trouvez rapidement les réponses à vos questions et apprenez à tirer le meilleur parti de NewsFlow.
        </motion.p>
      </motion.div>

      {/* Barre de recherche */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-16 not-prose"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <Input
            type="text"
            placeholder="Rechercher dans la documentation..."
            className="pl-12 pr-4 py-6 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:ring-indigo-500/50 rounded-xl text-lg"
            disabled
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-1 rounded">Bientôt disponible</span>
          </div>
        </div>
      </motion.div>

      {/* Cartes de Démarrage Rapide */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid md:grid-cols-3 gap-6 mb-16 not-prose"
      >
        {quickStartCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.title}
              variants={fadeInUp}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 hover:border-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${card.gradient} mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white !mt-0">{card.title}</h3>
                <p className="text-zinc-400 mb-4 leading-relaxed !mt-0 text-sm">{card.description}</p>
                <Button
                  asChild
                  variant="ghost"
                  className="text-indigo-400 hover:text-indigo-300 p-0 h-auto font-medium"
                >
                  <Link href={card.href}>
                    Lire le guide
                    <span className="ml-2">→</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Contenu introductif */}
      <div className="space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-4 !text-white">Bienvenue dans la documentation NewsFlow</h2>
          <p className="text-zinc-300 leading-relaxed">
            Cette documentation vous accompagne dans l'utilisation de NewsFlow, de la création de votre premier Flow 
            à l'optimisation de votre veille stratégique. Chaque section contient des guides détaillés, des exemples 
            pratiques et des astuces pour maximiser votre productivité.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4 !text-white">Navigation rapide</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Utilisez le menu de navigation à gauche pour accéder rapidement aux sections qui vous intéressent :
          </p>
          
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>
              <strong className="text-white">Introduction</strong> : Découvrez les concepts de base et consultez la FAQ
            </li>
            <li>
              <strong className="text-white">Premiers pas</strong> : Guides pour débuter rapidement avec NewsFlow
            </li>
            <li>
              <strong className="text-white">Gérer les Sources</strong> : Apprenez à configurer et organiser vos sources d'information
            </li>
            <li>
              <strong className="text-white">Comprendre l'IA</strong> : Explorez les fonctionnalités avancées de notre intelligence artificielle
            </li>
            <li>
              <strong className="text-white">Compte & Facturation</strong> : Gérez votre abonnement et vos paramètres
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4 !text-white">Besoin d'aide supplémentaire ?</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Si vous ne trouvez pas la réponse à votre question dans cette documentation, n'hésitez pas à :
          </p>
          
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>
              Consulter notre{" "}
              <Link href="/dashboard/help" className="text-indigo-400 hover:text-indigo-300 underline">
                page d'aide interactive
              </Link>
            </li>
            <li>
              Nous{" "}
              <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 underline">
                contacter directement
              </Link>
              {" "}pour un support personnalisé
            </li>
            <li>
              Explorer notre{" "}
              <Link href="/blog" className="text-indigo-400 hover:text-indigo-300 underline">
                blog
              </Link>
              {" "}pour des articles approfondis sur l'utilisation de NewsFlow
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
