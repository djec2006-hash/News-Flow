import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

export default function EmailAlertsPage() {
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
            <BreadcrumbPage className="text-white">Configurer vos alertes email</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold mb-6 !text-white">Configurer vos alertes email</h1>
      
      <p className="text-zinc-300 leading-relaxed">
        Les alertes email vous permettent de recevoir vos Flows directement dans votre boîte de réception. 
        Vous pouvez personnaliser la fréquence, le format et le contenu de ces notifications.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4 !text-white">Activer les alertes email</h2>
      <p className="text-zinc-300 leading-relaxed">
        Pour activer les alertes email, rendez-vous dans les paramètres de votre compte et activez 
        l'option "Notifications par email". Vous pouvez choisir de recevoir un email à chaque génération 
        de Flow ou uniquement un résumé quotidien.
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4 !text-white">Personnaliser la fréquence</h2>
      <p className="text-zinc-300 leading-relaxed">
        Vous avez le choix entre plusieurs options de fréquence :
      </p>
      <ul className="list-disc pl-6 space-y-2 text-zinc-300">
        <li><strong className="text-white">En temps réel</strong> : Recevez un email dès qu'un Flow est généré</li>
        <li><strong className="text-white">Quotidien</strong> : Un résumé de tous vos Flows du jour</li>
        <li><strong className="text-white">Hebdomadaire</strong> : Un récapitulatif chaque lundi</li>
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4 !text-white">Format des emails</h2>
      <p className="text-zinc-300 leading-relaxed">
        Les emails peuvent être envoyés en format texte simple ou HTML enrichi, selon vos préférences. 
        Le format HTML inclut des images, des liens cliquables et une mise en page optimisée pour la lecture.
      </p>
    </div>
  )
}



