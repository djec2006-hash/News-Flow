"use client"

import GuideLayout from "@/components/help/GuideLayout"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, FileText, Mail } from "lucide-react"

export default function ExporterPartagerPage() {
  return (
    <GuideLayout title="Exporter et partager">
      <div className="space-y-8">
        {/* Introduction */}
        <div className="text-lg text-zinc-300 leading-relaxed">
          <p>
            Partagez vos analyses avec votre équipe ou archivez-les pour consultation ultérieure. 
            NewsFlow offre plusieurs options d'export selon votre plan d'abonnement.
          </p>
        </div>

        {/* Étape 1 */}
        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Localiser les options d'export</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Sur chaque Flow généré, vous trouverez des boutons d'action en haut à droite : 
                  <FileText className="inline h-4 w-4 mx-1 text-amber-400" /> pour l'export PDF et 
                  <Mail className="inline h-4 w-4 mx-1 text-amber-400" /> pour l'envoi par email.
                </p>
                <div className="relative w-full h-48 rounded-lg bg-zinc-800/50 border border-white/5 overflow-hidden mt-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-zinc-500 text-sm">Capture d'écran : Options d'export sur un Flow</p>
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Exporter en PDF</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Cliquez sur le bouton <strong className="text-white">Export PDF</strong>. Le fichier sera généré 
                  avec une mise en page professionnelle incluant le résumé, les sections détaillées et les sources. 
                  Le téléchargement démarre automatiquement.
                </p>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                    <span>Format optimisé pour l'impression et le partage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                    <span>Inclut toutes les sections et sources du Flow</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                    <span>Disponible pour les plans Basic et Pro uniquement</span>
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Envoyer par email</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Cliquez sur le bouton <strong className="text-white">Envoyer par email</strong>. 
                  Le Flow sera envoyé à l'adresse email associée à votre compte. Vous pouvez également 
                  partager le lien avec vos collaborateurs.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mt-4">
                  <p className="text-sm text-amber-300">
                    <strong className="text-amber-200">💡 Astuce :</strong> Configurez l'envoi automatique 
                    dans les paramètres pour recevoir vos Flows directement dans votre boîte mail chaque matin.
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


