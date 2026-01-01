import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export default function IntegrationsPage() {
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
            <BreadcrumbPage>Intégrations</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold mb-6 !text-white">Intégrations</h1>
      <p className="text-xl text-zinc-400 leading-relaxed !mt-0">
        Connectez NewsFlow à vos outils préférés pour recevoir vos Flows directement là où vous travaillez.
      </p>

      <div className="space-y-8 mt-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Intégrations disponibles</h2>
          <p className="text-zinc-300 leading-relaxed mb-6">
            NewsFlow s'intègre avec les principales plateformes de communication et de productivité. 
            Configurez vos intégrations depuis les paramètres de votre compte.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Slack</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Recevez vos Flows directement dans vos canaux Slack. Idéal pour partager l'information 
            avec votre équipe en temps réel.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Configuration</h3>
          <ol className="list-decimal pl-6 space-y-2 text-zinc-300">
            <li>Allez dans <strong className="text-white">Paramètres → Intégrations</strong></li>
            <li>Cliquez sur <strong className="text-white">"Connecter Slack"</strong></li>
            <li>Autorisez NewsFlow à accéder à votre workspace</li>
            <li>Sélectionnez le canal où recevoir vos Flows</li>
            <li>Choisissez quels Flows envoyer (tous ou sélectionnés)</li>
          </ol>
          
          <div className="bg-zinc-900/50 border border-white/10 rounded-lg p-4 my-4">
            <p className="text-sm text-zinc-400 !my-0">
              💡 <strong className="text-white">Astuce</strong> : Vous pouvez configurer plusieurs canaux 
              pour différents types de Flows (ex: un canal pour la crypto, un autre pour le Forex).
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Discord</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Intégrez NewsFlow à votre serveur Discord pour une veille collaborative. Parfait pour les 
            communautés de traders et investisseurs.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Configuration</h3>
          <ol className="list-decimal pl-6 space-y-2 text-zinc-300">
            <li>Dans Discord, ajoutez le bot NewsFlow à votre serveur</li>
            <li>Dans NewsFlow, allez dans <strong className="text-white">Paramètres → Intégrations</strong></li>
            <li>Connectez votre compte Discord</li>
            <li>Sélectionnez le serveur et le canal de destination</li>
            <li>Configurez les préférences de formatage</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Email</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Recevez vos Flows par email. Disponible pour tous les plans, avec des options de personnalisation 
            avancées pour les plans Pro et Enterprise.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Options disponibles</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li><strong className="text-white">Fréquence</strong> : Immédiat, quotidien, hebdomadaire</li>
            <li><strong className="text-white">Format</strong> : HTML riche ou texte brut</li>
            <li><strong className="text-white">Pièces jointes</strong> : PDF automatique (plans Pro+)</li>
            <li><strong className="text-white">Filtres</strong> : Recevoir uniquement certains Flows</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">API</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Pour les développeurs, NewsFlow propose une API REST complète pour intégrer les Flows dans 
            vos propres applications.
          </p>
          
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-6 my-4">
            <h3 className="text-lg font-semibold mb-2 !text-white">Fonctionnalités API</h3>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>Récupérer vos Flows en JSON</li>
              <li>Déclencher la génération de Flows</li>
              <li>Gérer vos projets et sources</li>
              <li>Recevoir des webhooks sur événements</li>
            </ul>
          </div>
          
          <p className="text-zinc-300 leading-relaxed">
            Consultez la{" "}
            <Link href="/developers" className="text-indigo-400 hover:text-indigo-300 underline">
              documentation complète de l'API
            </Link>
            {" "}pour plus de détails.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Webhooks</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Configurez des webhooks pour être notifié en temps réel lorsqu'un Flow est généré. 
            Idéal pour automatiser vos workflows.
          </p>
          
          <h3 className="text-xl font-semibold mb-3 !text-white">Cas d'usage</h3>
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>Déclencher des actions dans vos outils internes</li>
            <li>Archiver automatiquement les Flows</li>
            <li>Analyser les tendances avec vos propres systèmes</li>
            <li>Intégrer dans des dashboards personnalisés</li>
          </ul>
          
          <p className="text-zinc-300 leading-relaxed mt-4">
            Pour configurer des webhooks, consultez notre{" "}
            <Link href="/docs/advanced/webhooks" className="text-indigo-400 hover:text-indigo-300 underline">
              guide dédié
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 !text-white">Intégrations à venir</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            Nous travaillons activement sur de nouvelles intégrations :
          </p>
          
          <ul className="list-disc pl-6 space-y-2 text-zinc-300">
            <li>Microsoft Teams</li>
            <li>Notion</li>
            <li>Google Workspace</li>
            <li>Zapier</li>
            <li>Make (ex-Integromat)</li>
          </ul>
          
          <p className="text-zinc-300 leading-relaxed mt-4">
            Souhaitez-vous voir une intégration spécifique ?{" "}
            <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 underline">
              Contactez-nous
            </Link>
            {" "}et faites-nous part de vos besoins.
          </p>
        </section>
      </div>
    </div>
  )
}


