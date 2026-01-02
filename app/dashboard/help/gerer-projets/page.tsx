"use client"

import GuideLayout from "@/components/help/GuideLayout"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, FolderKanban } from "lucide-react"

export default function GererProjetsPage() {
  return (
    <GuideLayout title="Gérer vos projets">
      <div className="space-y-8">
        {/* Introduction */}
        <div className="text-lg text-zinc-300 leading-relaxed">
          <p>
            Organisez vos veilles thématiques en projets distincts. Chaque projet peut avoir ses propres sources, 
            niveau de complexité et fréquence de génération. Idéal pour séparer vos différents domaines d'intérêt.
          </p>
        </div>

        {/* Étape 1 */}
        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Accéder à la gestion de projets</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Dans le menu latéral, cliquez sur <strong className="text-white">Gestion de projets</strong> 
                  <FolderKanban className="inline h-4 w-4 mx-1 text-emerald-400" />. 
                  Vous verrez la liste de tous vos projets existants.
                </p>
                <div className="relative w-full h-48 rounded-lg bg-zinc-800/50 border border-white/5 overflow-hidden mt-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-zinc-500 text-sm">Capture d'écran : Liste des projets</p>
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Créer un nouveau projet</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Cliquez sur le bouton <strong className="text-white">Nouveau projet</strong>. 
                  Donnez-lui un nom descriptif (ex: "Crypto & Blockchain", "Géopolitique Asie-Pacifique") 
                  et choisissez un thème de couleur pour le différencier visuellement.
                </p>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Chaque projet peut avoir jusqu'à 15 sources actives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Définissez un niveau de complexité spécifique par projet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Les Flows générés sont automatiquement associés au projet actif</span>
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Organiser et filtrer</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Utilisez les filtres pour voir les projets actifs, archivés ou par thème. 
                  Vous pouvez modifier, dupliquer ou archiver un projet à tout moment depuis le menu d'actions.
                </p>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-4">
                  <p className="text-sm text-emerald-300">
                    <strong className="text-emerald-200">💡 Astuce :</strong> Créez un projet par domaine d'expertise 
                    pour une organisation optimale. Par exemple : un projet "Tech" pour les actualités technologiques, 
                    un projet "Finance" pour les marchés financiers, etc.
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



