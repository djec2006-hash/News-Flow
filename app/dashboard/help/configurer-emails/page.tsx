"use client"

import GuideLayout from "@/components/help/GuideLayout"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Mail, Clock } from "lucide-react"

export default function ConfigurerEmailsPage() {
  return (
    <GuideLayout title="Configurer les emails">
      <div className="space-y-8">
        {/* Introduction */}
        <div className="text-lg text-zinc-300 leading-relaxed">
          <p>
            Recevez vos Flows directement dans votre boîte mail. Configurez la fréquence, l'heure d'envoi 
            et le format selon vos préférences. Disponible pour les plans Basic et Pro.
          </p>
        </div>

        {/* Étape 1 */}
        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Accéder aux paramètres d'email</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Dans le menu latéral, cliquez sur <strong className="text-white">Emails & Alertes</strong> 
                  <Mail className="inline h-4 w-4 mx-1 text-pink-400" />. 
                  Vous verrez tous les paramètres de notification et d'envoi automatique.
                </p>
                <div className="relative w-full h-48 rounded-lg bg-zinc-800/50 border border-white/5 overflow-hidden mt-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-zinc-500 text-sm">Capture d'écran : Page de configuration des emails</p>
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Configurer l'envoi automatique</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Activez l'option <strong className="text-white">Recevoir les Flows par email</strong>. 
                  Choisissez la fréquence (quotidien, hebdomadaire) et l'heure d'envoi 
                  <Clock className="inline h-4 w-4 mx-1 text-pink-400" /> selon votre fuseau horaire.
                </p>
                <ul className="space-y-2 text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-pink-400 mt-0.5 shrink-0" />
                    <span>Recevez un Flow chaque matin à l'heure choisie</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-pink-400 mt-0.5 shrink-0" />
                    <span>Format HTML optimisé pour tous les clients email</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-pink-400 mt-0.5 shrink-0" />
                    <span>PDF en pièce jointe pour archivage</span>
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
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-2xl font-bold text-white">Personnaliser le format</h3>
                <p className="text-zinc-300 leading-relaxed">
                  Choisissez entre le format HTML (riche et interactif) ou PDF (pour archivage). 
                  Vous pouvez également activer les alertes pour les événements importants détectés par l'IA.
                </p>
                <div className="bg-pink-500/10 border border-pink-500/20 rounded-lg p-4 mt-4">
                  <p className="text-sm text-pink-300">
                    <strong className="text-pink-200">💡 Astuce :</strong> Configurez l'envoi pour 7h du matin 
                    pour recevoir votre Flow avec votre café. Les emails sont envoyés selon votre fuseau horaire local.
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



