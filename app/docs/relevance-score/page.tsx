import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export default function RelevanceScorePage() {
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
              Premiers pas
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">Comprendre le score de pertinence</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold mb-6 !text-white">Comprendre le score de pertinence</h1>
      
      <p className="text-zinc-300 leading-relaxed">
        Le score de pertinence est un indicateur calculé par notre IA pour évaluer à quel point une information 
        est pertinente par rapport à votre sujet de recherche. Ce score vous aide à identifier rapidement 
        les informations les plus importantes.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4 !text-white">Comment est calculé le score ?</h2>
      <p className="text-zinc-300 leading-relaxed">
        Notre algorithme analyse plusieurs facteurs pour déterminer le score de pertinence :
      </p>
      <ul className="list-disc pl-6 space-y-2 text-zinc-300">
        <li><strong className="text-white">Pertinence sémantique</strong> : Correspondance entre le contenu et votre requête</li>
        <li><strong className="text-white">Fraîcheur</strong> : Plus l'information est récente, plus le score est élevé</li>
        <li><strong className="text-white">Source</strong> : Les sources institutionnelles et vérifiées ont un bonus</li>
        <li><strong className="text-white">Exhaustivité</strong> : La profondeur et la complétude de l'information</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4 !text-white">Interpréter les scores</h2>
      <p className="text-zinc-300 leading-relaxed">
        Les scores sont affichés sur une échelle de 0 à 100 :
      </p>
      <ul className="list-disc pl-6 space-y-2 text-zinc-300">
        <li><strong className="text-white">90-100</strong> : Information très pertinente, à lire en priorité</li>
        <li><strong className="text-white">70-89</strong> : Information pertinente, recommandée</li>
        <li><strong className="text-white">50-69</strong> : Information modérément pertinente</li>
        <li><strong className="text-white">0-49</strong> : Information peu pertinente, peut être ignorée</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4 !text-white">Utiliser le score pour filtrer</h2>
      <p className="text-zinc-300 leading-relaxed">
        Vous pouvez utiliser le score de pertinence pour filtrer vos résultats et ne voir que les informations 
        les plus importantes. Dans les paramètres de recherche, définissez un score minimum pour afficher 
        uniquement les résultats au-dessus de ce seuil.
      </p>
    </div>
  )
}






