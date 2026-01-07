import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function QuickStartPage() {
  return (
    <div className="prose prose-invert prose-lg max-w-none">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs" className="text-zinc-400 hover:text-white">
              Documentation
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs" className="text-zinc-400 hover:text-white">
              Introduction
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quick Start</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold mb-6 !text-white">Quick Start</h1>
      <p className="text-xl text-zinc-400 leading-relaxed !mt-0">
        Lancez votre premier Flow en 2 minutes. Ce guide vous accompagne étape par étape.
      </p>

      <div className="space-y-8 mt-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Étape 1 : Créer un compte</h2>
          <p className="text-zinc-300 leading-relaxed">
            Si vous n'avez pas encore de compte,{" "}
            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 underline">
              créez-en un gratuitement
            </Link>
            . Le plan Free vous permet de tester NewsFlow avec 2 Flows par semaine.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Étape 2 : Accéder au Dashboard</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Une fois connecté, vous arrivez sur votre Dashboard. C'est ici que vous gérez tous vos Flows.
          </p>
          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4 my-4">
            <p className="text-sm text-zinc-400 !my-0">
              💡 <strong className="text-white">Astuce</strong> : Le Dashboard affiche vos Flows récents 
              et vous permet de créer de nouveaux projets en un clic.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Étape 3 : Créer votre premier Flow</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Cliquez sur le bouton <strong className="text-white">"Créer un Flow"</strong> ou{" "}
            <strong className="text-white">"Nouveau projet"</strong>. Vous serez invité à :
          </p>
          
          <ol className="list-decimal pl-6 space-y-3 text-zinc-300">
            <li>
              <strong className="text-white">Définir un nom</strong> pour votre Flow (ex: "Marchés Crypto")
            </li>
            <li>
              <strong className="text-white">Choisir vos sources</strong> : Presse, réseaux sociaux, 
              analyses spécialisées, etc.
            </li>
            <li>
              <strong className="text-white">Rédiger une instruction</strong> : Décrivez ce que vous 
              souhaitez suivre (ex: "Suivre l'actualité Bitcoin et Ethereum, focus sur les annonces réglementaires")
            </li>
            <li>
              <strong className="text-white">Sélectionner le mode</strong> : Fast (rapide) ou Deep Search (approfondi)
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Étape 4 : Générer votre Flow</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Cliquez sur <strong className="text-white">"Générer"</strong>. NewsFlow va :
          </p>
          
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>Collecter les informations les plus récentes sur votre sujet</li>
            <li>Les analyser avec notre IA</li>
            <li>Générer un rapport structuré et synthétique</li>
          </ul>
          
          <p className="text-zinc-300 leading-relaxed mt-4">
            Le processus prend généralement entre 30 secondes (Fast) et 2-3 minutes (Deep Search).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Étape 5 : Consulter votre Flow</h2>
          <p className="text-zinc-300 leading-relaxed">
            Une fois généré, votre Flow apparaît dans votre Dashboard. Vous pouvez :
          </p>
          
          <ul className="list-disc pl-6 space-y-2 text-zinc-300 mt-4">
            <li>Le lire directement en ligne</li>
            <li>Le télécharger en PDF</li>
            <li>L'envoyer par email</li>
            <li>Le partager avec votre équipe</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Prochaines étapes</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Félicitations ! Vous avez créé votre premier Flow. Pour aller plus loin :
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/5">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1 !text-white">Comprendre les modes de recherche</h3>
                <p className="text-zinc-400 text-sm !my-0">
                  Découvrez quand utiliser Fast vs Deep Search pour optimiser vos Flows.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/docs/flows/modes">
                  Lire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/5">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1 !text-white">Configurer vos préférences</h3>
                <p className="text-zinc-400 text-sm !my-0">
                  Personnalisez votre expérience et configurez les notifications.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/docs/account/settings">
                  Lire
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}






