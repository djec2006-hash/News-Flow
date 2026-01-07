import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export default function DeepSearchPage() {
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
              Avancé
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Deep Search</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold mb-6 !text-white">Deep Search</h1>
      <p className="text-xl text-zinc-400 leading-relaxed !mt-0">
        Comprendre comment notre IA fouille le web en profondeur pour vous fournir les analyses les plus complètes.
      </p>

      <div className="space-y-8 mt-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Qu'est-ce que Deep Search ?</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            <strong className="text-white">Deep Search</strong> est notre mode de recherche avancé qui utilise 
            l'intelligence artificielle pour analyser des milliers de sources simultanément. Contrairement au 
            mode Fast qui se concentre sur les sources principales, Deep Search explore :
          </p>
          
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>Des centaines de sites d'actualité spécialisés</li>
            <li>Les réseaux sociaux et forums de discussion</li>
            <li>Les rapports d'analystes et institutions financières</li>
            <li>Les publications académiques et recherches</li>
            <li>Les communiqués officiels et réglementaires</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Comment ça fonctionne ?</h2>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Phase 1 : Collecte massive</h3>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Notre système interroge simultanément des milliers de sources. Chaque source est analysée 
            pour déterminer sa pertinence par rapport à votre requête.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Phase 2 : Analyse contextuelle</h3>
          <p className="text-zinc-300 leading-relaxed mb-4">
            L'IA ne se contente pas de chercher des mots-clés. Elle comprend le contexte, identifie 
            les relations entre les concepts et détecte les tendances émergentes.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Phase 3 : Synthèse intelligente</h3>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Les informations collectées sont synthétisées en un rapport structuré qui :
          </p>
          
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>Hiérarchise les informations par importance</li>
            <li>Identifie les consensus et les divergences</li>
            <li>Met en évidence les signaux faibles</li>
            <li>Cite toutes les sources pour transparence</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Quand utiliser Deep Search ?</h2>
          
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3 !text-white">✅ Idéal pour :</h3>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>Analyses stratégiques approfondies</li>
              <li>Recherches ponctuelles sur des sujets complexes</li>
              <li>Veille réglementaire ou législative</li>
              <li>Études de marché complètes</li>
              <li>Détection de signaux faibles</li>
            </ul>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 !text-white">⚠️ À considérer :</h3>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>Le temps de traitement est plus long (2-5 minutes)</li>
              <li>Consomme plus de crédits selon votre plan</li>
              <li>Peut générer plus d'informations à traiter</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Différence avec le mode Fast</h2>
          
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-semibold text-zinc-300">Critère</th>
                  <th className="text-left py-3 px-4 font-semibold text-zinc-300">Fast</th>
                  <th className="text-left py-3 px-4 font-semibold text-zinc-300">Deep Search</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="py-3 px-4 text-zinc-300">Temps de traitement</td>
                  <td className="py-3 px-4 text-zinc-300">30-60 secondes</td>
                  <td className="py-3 px-4 text-zinc-300">2-5 minutes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-300">Sources analysées</td>
                  <td className="py-3 px-4 text-zinc-300">50-100 sources principales</td>
                  <td className="py-3 px-4 text-zinc-300">1000+ sources</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-300">Profondeur d'analyse</td>
                  <td className="py-3 px-4 text-zinc-300">Standard</td>
                  <td className="py-3 px-4 text-zinc-300">Approfondie</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-300">Idéal pour</td>
                  <td className="py-3 px-4 text-zinc-300">Veille quotidienne</td>
                  <td className="py-3 px-4 text-zinc-300">Analyses stratégiques</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Optimiser vos recherches Deep Search</h2>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Instructions précises</h3>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Plus votre instruction est précise, meilleurs seront les résultats. Au lieu de{" "}
            <code className="px-1.5 py-0.5 rounded bg-zinc-900 text-indigo-400 font-mono text-sm">
              "crypto"
            </code>
            , utilisez{" "}
            <code className="px-1.5 py-0.5 rounded bg-zinc-900 text-indigo-400 font-mono text-sm">
              "Impact de la régulation MiCA sur les exchanges européens en 2024"
            </code>
            .
          </p>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Filtres de sources</h3>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Utilisez les filtres pour cibler vos sources : presse, réseaux sociaux, analyses, rapports officiels. 
            Cela permet à l'IA de se concentrer sur les types de contenus les plus pertinents.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Suivi des résultats</h3>
          <p className="text-zinc-300 leading-relaxed">
            Après chaque Deep Search, analysez les sources citées. Cela vous aidera à affiner vos prochaines 
            recherches et à identifier les sources les plus fiables pour vos sujets.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">En savoir plus</h2>
          <p className="text-zinc-300 leading-relaxed">
            Pour comprendre comment choisir entre Fast et Deep Search, consultez notre guide sur les{" "}
            <Link href="/docs/flows/modes" className="text-indigo-400 hover:text-indigo-300 underline">
              modes de recherche
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}






