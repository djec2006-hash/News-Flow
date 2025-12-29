"use client"

import GuideLayout from "@/components/help/GuideLayout"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Sparkles } from "lucide-react"

export default function CreerPremierFlowPage() {
  return (
    <GuideLayout title="Créer votre premier Flow">
      <div className="space-y-8">
        {/* Introduction */}
        <div className="text-lg text-zinc-300 leading-relaxed">
          <p>
            Un Flow est un résumé intelligent personnalisé généré par notre IA. Créez votre premier Flow 
            en quelques secondes et découvrez la puissance de l'analyse automatisée de l'information.
          </p>
        </div>

        {/* Étape 1 */}
        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Accéder au générateur de Flow</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Sur votre dashboard, localisez la section <strong className="text-white">Générer un Flow</strong>. 
                  C'est la grande carte avec l'icône <Sparkles className="inline h-5 w-5 text-cyan-400" /> en haut de votre écran.
                </p>
                <div className="relative w-full h-48 rounded-lg bg-zinc-800/50 border border-white/5 overflow-hidden mt-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-zinc-500 text-sm">Capture d'écran : Interface de génération de Flow</p>
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Ajouter des instructions (optionnel)</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Dans le champ de texte, vous pouvez ajouter des instructions spécifiques pour personnaliser votre Flow. 
                  Par exemple : <em className="text-zinc-400">"Focus sur les actualités crypto et les décisions réglementaires"</em>.
                </p>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                    <span>Laissez vide pour un Flow général basé sur vos préférences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                    <span>Soyez spécifique : mentionnez des secteurs, entreprises ou thèmes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                    <span>L'IA enrichira automatiquement votre demande pour plus de précision</span>
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Générer et consulter</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Cliquez sur le bouton <strong className="text-white">Générer maintenant</strong>. 
                  La génération prend généralement 30 à 60 secondes. Une fois terminé, votre Flow apparaîtra 
                  automatiquement sur le dashboard avec un résumé, des sections détaillées et les sources utilisées.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 mt-4">
                  <p className="text-sm text-cyan-300">
                    <strong className="text-cyan-200">💡 Astuce :</strong> Les Flows sont sauvegardés dans votre 
                    historique. Vous pouvez les consulter, exporter ou partager à tout moment depuis la section 
                    <strong className="text-cyan-200"> Historique</strong>.
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

