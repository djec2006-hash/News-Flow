"use client"

import GuideLayout from "@/components/help/GuideLayout"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Image from "next/image"

export default function ConfigurerSourcesPage() {
  return (
    <GuideLayout title="Configurer ses sources">
      <div className="space-y-8">
        {/* Introduction */}
        <div className="text-lg text-zinc-300 leading-relaxed">
          <p>
            Personnalisez vos sources d'information pour recevoir uniquement le contenu qui vous intéresse. 
            NewsFlow vous permet de filtrer et organiser vos sources selon vos besoins spécifiques.
          </p>
        </div>

        {/* Étape 1 */}
        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Accéder aux paramètres de sources</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Rendez-vous dans la section <strong className="text-white">Paramètres</strong> de votre dashboard, 
                  puis cliquez sur <strong className="text-white">Sources</strong> dans le menu latéral. 
                  Vous verrez la liste de toutes les sources disponibles.
                </p>
                <div className="relative w-full h-48 rounded-lg bg-zinc-800/50 border border-white/5 overflow-hidden mt-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-zinc-500 text-sm">Capture d'écran : Page de configuration des sources</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Étape 2 */}
        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Ajouter une nouvelle source</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Utilisez la barre de recherche en haut de la page pour trouver des sources spécifiques. 
                  Vous pouvez rechercher par nom, domaine ou catégorie. Cliquez sur <strong className="text-white">Ajouter</strong> 
                  à côté de la source souhaitée pour l'activer.
                </p>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                    <span>Recherchez par nom de source (ex: "Bloomberg", "Reuters")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                    <span>Filtrez par catégorie (Finance, Tech, Géopolitique...)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                    <span>Activez ou désactivez les sources en un clic</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Étape 3 */}
        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Filtrer et sauvegarder</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Une fois vos sources sélectionnées, vous pouvez ajuster les paramètres de filtrage. 
                  Les modifications sont sauvegardées automatiquement. Vos Flows futurs utiliseront uniquement 
                  les sources que vous avez activées.
                </p>
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4 mt-4">
                  <p className="text-sm text-indigo-300">
                    <strong className="text-indigo-200">💡 Astuce :</strong> Activez au moins 5-10 sources 
                    pour obtenir des Flows plus riches et variés. Trop peu de sources peuvent limiter la diversité 
                    de vos analyses.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </GuideLayout>
  )
}


