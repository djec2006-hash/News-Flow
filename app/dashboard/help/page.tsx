"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, PlayCircle, Image, ArrowRight, HelpCircle, Settings, FileText, Mail, Sparkles } from "lucide-react"
import InteractiveTour from "@/components/onboarding/InteractiveTour"
import { createClient } from "@/lib/supabase/client"
import Logo from "@/components/ui/logo"
import Link from "next/link"

const guideCards = [
  {
    id: "guide-1",
    slug: "configurer-sources",
    title: "Configurer ses sources",
    description: "Apprenez à personnaliser vos sources d'information et à filtrer le contenu selon vos besoins.",
    icon: Settings,
    color: "from-indigo-500 to-purple-500",
    image: "/images/guides/configurer-sources.jpg",
  },
  {
    id: "guide-2",
    slug: "creer-premier-flow",
    title: "Créer votre premier Flow",
    description: "Découvrez comment générer un Flow personnalisé en quelques clics et optimiser vos instructions.",
    icon: Sparkles,
    color: "from-cyan-500 to-blue-500",
    image: "/images/guides/creer-premier-flow.jpg",
  },
  {
    id: "guide-3",
    slug: "exporter-partager",
    title: "Exporter et partager",
    description: "Maîtrisez l'export PDF et l'envoi par email pour partager vos analyses avec votre équipe.",
    icon: FileText,
    color: "from-amber-500 to-orange-500",
    image: "/images/guides/exporter-partager.jpg",
  },
  {
    id: "guide-4",
    slug: "gerer-projets",
    title: "Gérer vos projets",
    description: "Organisez vos veilles thématiques en projets distincts pour une meilleure organisation.",
    icon: BookOpen,
    color: "from-emerald-500 to-teal-500",
    image: "/images/guides/gerer-projets.jpg",
  },
  {
    id: "guide-5",
    slug: "configurer-emails",
    title: "Configurer les emails",
    description: "Configurez la réception automatique de vos Flows par email selon votre planning.",
    icon: Mail,
    color: "from-pink-500 to-rose-500",
    image: "/images/guides/configurer-emails.jpg",
  },
  {
    id: "guide-6",
    slug: "comprendre-plans",
    title: "Comprendre les plans",
    description: "Découvrez les différences entre les plans Free, Basic et Pro pour choisir celui qui vous convient.",
    icon: HelpCircle,
    color: "from-violet-500 to-fuchsia-500",
    image: "/images/guides/comprendre-plans.jpg",
  },
]

export default function HelpPage() {
  const [showTour, setShowTour] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("has_seen_onboarding")
            .eq("id", user.id)
            .single()

          setHasSeenOnboarding(profile?.has_seen_onboarding ?? true)
        }
      } catch (error) {
        console.error("[Help] Erreur lors de la vérification:", error)
      }
    }

    checkOnboardingStatus()
  }, [])

  const handleStartTour = () => {
    setShowTour(true)
  }

  const handleTourComplete = () => {
    setShowTour(false)
    setHasSeenOnboarding(true)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      {showTour && (
        <InteractiveTour
          autoStart={true}
          onComplete={handleTourComplete}
          onSkip={handleTourComplete}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-12">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-4">
            <Logo className="h-12 w-12 md:h-16 md:w-16" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Comment maîtriser NewsFlow
            </h1>
          </div>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Guides visuels, tutoriels interactifs et ressources pour tirer le meilleur parti de votre veille
            informationnelle.
          </p>
        </motion.div>

        {/* Section : Rejouer la visite */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
                  <PlayCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">Visite guidée interactive</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Découvrez les fonctionnalités principales avec notre curseur virtuel animé
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 mb-6">
                Une visite guidée interactive vous montrera les éléments clés du dashboard. Le curseur virtuel vous
                guidera étape par étape pour comprendre comment utiliser NewsFlow efficacement.
              </p>
              <Button
                onClick={handleStartTour}
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                Lancer la visite guidée
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section : Guides visuels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Guides visuels</h2>
            <p className="text-zinc-400">Explorez nos guides détaillés pour chaque fonctionnalité</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guideCards.map((guide, index) => {
              const Icon = guide.icon
              return (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="h-full border-white/10 bg-zinc-900/50 backdrop-blur-xl hover:border-white/20 transition-all cursor-pointer">
                    <CardHeader>
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${guide.color} w-fit mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white">{guide.title}</CardTitle>
                      <CardDescription className="text-zinc-400">{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Image de capture d'écran */}
                      <div className="relative w-full h-32 rounded-lg bg-zinc-800/50 border border-white/5 mb-4 overflow-hidden group-hover:border-white/10 transition-all">
                        <div className={`absolute inset-0 bg-gradient-to-br ${guide.color} opacity-20 flex items-center justify-center`}>
                          <Icon className="h-8 w-8 text-white opacity-50" />
                        </div>
                        <img
                          src={guide.image}
                          alt={guide.title}
                          className="relative w-full h-full object-cover z-10"
                          onError={(e) => {
                            // Cacher l'image si elle n'existe pas, le placeholder sera visible
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-zinc-900/50 z-20" />
                      </div>

                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-white/10 text-white hover:bg-white/10 group/btn"
                      >
                        <Link href={`/dashboard/help/${guide.slug}`}>
                          Lire le guide
                          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Section : FAQ rapide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-6"
        >
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Questions fréquentes</h2>
            <p className="text-zinc-400">Réponses rapides aux questions les plus courantes</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">Comment créer mon premier Flow ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 text-sm">
                  Utilisez le bouton "Générer maintenant" sur le dashboard. Vous pouvez ajouter des instructions
                  spécifiques pour personnaliser votre Flow.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">Puis-je exporter mes Flows ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 text-sm">
                  Oui ! Les plans Basic et Pro permettent l'export PDF et l'envoi par email. Le plan Free permet
                  uniquement la lecture en ligne.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">Comment changer de plan ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 text-sm">
                  Rendez-vous sur la page Tarifs pour upgrader votre plan. Les changements prennent effet
                  immédiatement.
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white">Les données sont-elles sécurisées ?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 text-sm">
                  Absolument. Vos données sont chiffrées de bout en bout et nous respectons strictement le RGPD. Vous
                  pouvez exporter ou supprimer vos données à tout moment.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

