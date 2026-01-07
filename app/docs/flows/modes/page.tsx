import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export default function FlowsModesPage() {
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
              Flux
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Modes de recherche</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold mb-6 !text-white">Modes de recherche</h1>
      <p className="text-xl text-zinc-400 leading-relaxed !mt-0">
        Comprendre la différence entre le mode Fast et le mode Deep Search pour choisir celui qui correspond à vos besoins.
      </p>

      <div className="space-y-8 mt-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Vue d'ensemble</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            NewsFlow propose deux modes de recherche distincts, chacun optimisé pour des cas d'usage spécifiques. 
            Le choix du mode impacte la vitesse, la profondeur et la complétude de vos Flows.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Mode Fast</h2>
          
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2 !text-white">⚡ Rapide et efficace</h3>
            <p className="text-zinc-300 leading-relaxed !my-0">
              Le mode Fast analyse les sources principales en quelques secondes. Idéal pour une veille quotidienne 
              où la vitesse prime sur l'exhaustivité.
            </p>
          </div>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Caractéristiques</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li><strong className="text-white">Temps de traitement</strong> : 30 à 60 secondes</li>
            <li><strong className="text-white">Sources analysées</strong> : 50 à 100 sources principales</li>
            <li><strong className="text-white">Profondeur</strong> : Analyse standard, focus sur l'actualité récente</li>
            <li><strong className="text-white">Coût</strong> : 1 crédit par Flow</li>
          </ul>
          
          <h3 className="text-xl font-semibold mb-3 !text-white mt-6">Quand l'utiliser ?</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>Veille quotidienne régulière</li>
            <li>Suivi de sujets bien couverts par la presse</li>
            <li>Besoin de résultats rapides</li>
            <li>Flows automatisés fréquents</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Mode Deep Search</h2>
          
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2 !text-white">🔍 Approfondi et exhaustif</h3>
            <p className="text-zinc-300 leading-relaxed !my-0">
              Le mode Deep Search explore des milliers de sources simultanément pour une analyse complète. 
              Plus lent mais beaucoup plus approfondi.
            </p>
          </div>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Caractéristiques</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li><strong className="text-white">Temps de traitement</strong> : 2 à 5 minutes</li>
            <li><strong className="text-white">Sources analysées</strong> : 1000+ sources diverses</li>
            <li><strong className="text-white">Profondeur</strong> : Analyse contextuelle approfondie</li>
            <li><strong className="text-white">Coût</strong> : 3 crédits par Flow</li>
          </ul>
          
          <h3 className="text-xl font-semibold mb-3 !text-white mt-6">Quand l'utiliser ?</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>Analyses stratégiques importantes</li>
            <li>Recherches ponctuelles sur des sujets complexes</li>
            <li>Veille réglementaire ou législative</li>
            <li>Détection de signaux faibles</li>
            <li>Études de marché complètes</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Comparaison détaillée</h2>
          
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
                  <td className="py-3 px-4 text-zinc-300">Temps moyen</td>
                  <td className="py-3 px-4 text-zinc-300">30-60 secondes</td>
                  <td className="py-3 px-4 text-zinc-300">2-5 minutes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-300">Sources</td>
                  <td className="py-3 px-4 text-zinc-300">50-100 principales</td>
                  <td className="py-3 px-4 text-zinc-300">1000+ diverses</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-300">Types de sources</td>
                  <td className="py-3 px-4 text-zinc-300">Presse, sites officiels</td>
                  <td className="py-3 px-4 text-zinc-300">Tous types (presse, réseaux, analyses, académique)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-300">Analyse contextuelle</td>
                  <td className="py-3 px-4 text-zinc-300">Standard</td>
                  <td className="py-3 px-4 text-zinc-300">Approfondie</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-300">Détection de tendances</td>
                  <td className="py-3 px-4 text-zinc-300">Basique</td>
                  <td className="py-3 px-4 text-zinc-300">Avancée</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-300">Signaux faibles</td>
                  <td className="py-3 px-4 text-zinc-300">Limité</td>
                  <td className="py-3 px-4 text-zinc-300">Détectés</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-zinc-300">Coût (crédits)</td>
                  <td className="py-3 px-4 text-zinc-300">1</td>
                  <td className="py-3 px-4 text-zinc-300">3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Comment choisir ?</h2>
          
          <div className="space-y-4">
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 !text-white">Choisissez Fast si :</h3>
              <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                <li>Vous avez besoin de résultats en moins d'une minute</li>
                <li>Vous suivez des sujets bien couverts par la presse</li>
                <li>Vous créez des Flows fréquents (quotidien)</li>
                <li>Vous avez un budget limité en crédits</li>
                <li>L'actualité récente vous suffit</li>
              </ul>
            </div>
            
            <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3 !text-white">Choisissez Deep Search si :</h3>
              <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                <li>Vous avez besoin d'une analyse complète et approfondie</li>
                <li>Vous recherchez des informations sur des sujets de niche</li>
                <li>Vous faites une recherche ponctuelle importante</li>
                <li>Vous voulez détecter des tendances émergentes</li>
                <li>La qualité prime sur la vitesse</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Changer de mode</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Vous pouvez changer le mode de recherche à tout moment lors de la création ou de la modification 
            d'un Flow. Le mode est sauvegardé avec votre projet et sera utilisé pour toutes les générations 
            futures de ce Flow.
          </p>
          
          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4 my-4">
            <p className="text-sm text-zinc-400 !my-0">
              💡 <strong className="text-white">Astuce</strong> : Vous pouvez créer deux projets identiques 
              avec des modes différents pour comparer les résultats et déterminer lequel correspond le mieux 
              à vos besoins.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">En savoir plus</h2>
          <p className="text-zinc-300 leading-relaxed">
            Pour une explication détaillée du fonctionnement du Deep Search, consultez notre{" "}
            <Link href="/docs/advanced/deep-search" className="text-indigo-400 hover:text-indigo-300 underline">
              guide dédié
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}






