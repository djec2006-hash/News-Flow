import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export default function ConceptsPage() {
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
            <BreadcrumbPage>Concepts de base</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold mb-6 !text-white">Concepts de base</h1>
      <p className="text-xl text-zinc-400 leading-relaxed !mt-0">
        Comprendre les concepts fondamentaux de NewsFlow pour tirer le meilleur parti de la plateforme.
      </p>

      <div className="space-y-8 mt-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Qu'est-ce qu'un Flow ?</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Un <strong className="text-white">Flow</strong> est une veille thématique automatisée générée par NewsFlow. 
            C'est un rapport structuré qui synthétise les informations les plus pertinentes sur un sujet donné, 
            collectées et analysées par notre intelligence artificielle.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Caractéristiques d'un Flow</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li><strong className="text-white">Thématique</strong> : Chaque Flow se concentre sur un sujet spécifique</li>
            <li><strong className="text-white">Temps réel</strong> : Basé sur les informations les plus récentes</li>
            <li><strong className="text-white">Synthétique</strong> : Résume l'essentiel sans bruit</li>
            <li><strong className="text-white">Structuré</strong> : Organisé en sections pour faciliter la lecture</li>
            <li><strong className="text-white">Traçable</strong> : Toutes les sources sont citées</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Le cycle de vie d'un Flow</h2>
          
          <ol className="list-decimal pl-6 space-y-4 text-zinc-300">
            <li>
              <strong className="text-white">Création</strong> : Vous définissez un projet avec un sujet et des sources
            </li>
            <li>
              <strong className="text-white">Génération</strong> : NewsFlow collecte et analyse les informations
            </li>
            <li>
              <strong className="text-white">Synthèse</strong> : L'IA génère un rapport structuré
            </li>
            <li>
              <strong className="text-white">Consultation</strong> : Vous lisez, téléchargez ou partagez le Flow
            </li>
            <li>
              <strong className="text-white">Historique</strong> : Le Flow est sauvegardé pour référence future
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Projets et Flows</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Un <strong className="text-white">projet</strong> est la configuration qui définit comment générer vos Flows. 
            Un projet peut générer plusieurs Flows au fil du temps.
          </p>
          
          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6 my-4">
            <h3 className="text-lg font-semibold mb-2 !text-white">Exemple</h3>
            <p className="text-zinc-300 leading-relaxed !my-0">
              Vous créez un projet <strong className="text-white">"Marchés Crypto"</strong> avec une instruction 
              pour suivre Bitcoin et Ethereum. Chaque fois que vous générez un Flow depuis ce projet, 
              vous obtenez un nouveau rapport basé sur les informations les plus récentes. Le projet reste 
              le même, mais chaque Flow est unique et reflète l'actualité du moment.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Instructions et personnalisation</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            L'<strong className="text-white">instruction</strong> est le texte qui guide l'IA dans la génération 
            de votre Flow. Plus elle est précise, meilleurs seront les résultats.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Bonnes pratiques</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>Soyez spécifique : "Bitcoin et régulation européenne" plutôt que "crypto"</li>
            <li>Définissez le périmètre : géographique, temporel, sectoriel</li>
            <li>Indiquez vos priorités : "Focus sur les annonces réglementaires"</li>
            <li>Précisez ce à éviter : "Exclure les analyses techniques"</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Sources d'information</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            NewsFlow analyse plusieurs types de sources pour construire vos Flows :
          </p>
          
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li><strong className="text-white">Presse</strong> : Sites d'actualité généralistes et spécialisés</li>
            <li><strong className="text-white">Réseaux sociaux</strong> : Twitter, Reddit, forums spécialisés</li>
            <li><strong className="text-white">Analyses</strong> : Rapports d'analystes, institutions financières</li>
            <li><strong className="text-white">Officiel</strong> : Communiqués de presse, régulateurs, banques centrales</li>
            <li><strong className="text-white">Académique</strong> : Publications et recherches (mode Deep Search)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Prochaines étapes</h2>
          <p className="text-zinc-300 leading-relaxed">
            Maintenant que vous comprenez les concepts de base, vous pouvez{" "}
            <Link href="/docs/quick-start" className="text-indigo-400 hover:text-indigo-300 underline">
              créer votre premier Flow
            </Link>
            {" "}ou explorer les{" "}
            <Link href="/docs/flows/modes" className="text-indigo-400 hover:text-indigo-300 underline">
              différents modes de recherche
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}








