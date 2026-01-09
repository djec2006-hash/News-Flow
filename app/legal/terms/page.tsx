export default function TermsPage() {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Conditions Générales d'Utilisation
      </h1>
      <p className="text-lg text-zinc-400 mb-8">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Définitions</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>"NewsFlow"</strong> : Le service d'agrégation et d'analyse d'actualités par intelligence artificielle proposé par notre société</li>
          <li><strong>"Utilisateur"</strong> : Toute personne physique ou morale utilisant le service NewsFlow</li>
          <li><strong>"Flow"</strong> : Un résumé intelligent personnalisé généré par notre IA à partir de sources d'information multiples</li>
          <li><strong>"Compte"</strong> : L'espace utilisateur créé lors de l'inscription permettant d'accéder au service</li>
          <li><strong>"Abonnement"</strong> : L'engagement contractuel permettant d'accéder aux fonctionnalités payantes du service</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Objet et description du service</h2>
        <p>
          NewsFlow est un <strong>agrégateur d'actualités alimenté par intelligence artificielle</strong> qui :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Analyse des milliers de sources d'information institutionnelles et fiables</li>
          <li>Synthétise l'essentiel en résumés personnalisés ("Flows") adaptés à vos centres d'intérêt</li>
          <li>Fournit des analyses structurées avec sources vérifiées</li>
          <li>Permet l'export et l'envoi par email de vos Flows selon votre plan d'abonnement</li>
        </ul>
        <p className="mt-4">
          <strong>Important</strong> : NewsFlow est un outil d'information et d'aide à la décision. Il ne constitue 
          en aucun cas un conseil en investissement financier, juridique ou fiscal. Les décisions prises sur la base 
          des informations fournies par NewsFlow relèvent de votre seule responsabilité.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Acceptation des CGU</h2>
        <p>
          En créant un compte ou en utilisant NewsFlow, vous acceptez sans réserve les présentes Conditions Générales 
          d'Utilisation. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser le service.
        </p>
        <p>
          Nous nous réservons le droit de modifier ces CGU à tout moment. Les modifications vous seront notifiées par 
          email et prendront effet 30 jours après la notification. Votre utilisation continue du service après cette période 
          vaut acceptation des nouvelles conditions.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Création de compte et éligibilité</h2>
        <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.1. Conditions d'éligibilité</h3>
        <p>Pour utiliser NewsFlow, vous devez :</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Être âgé d'au moins 18 ans ou avoir l'autorisation d'un représentant légal</li>
          <li>Disposer de la capacité juridique pour contracter</li>
          <li>Fournir des informations exactes et à jour lors de l'inscription</li>
          <li>Maintenir la confidentialité de vos identifiants de connexion</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.2. Responsabilité de l'utilisateur</h3>
        <p>
          Vous êtes seul responsable de toutes les activités effectuées sous votre compte. Vous devez immédiatement 
          nous notifier de toute utilisation non autorisée de votre compte.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Plans d'abonnement et tarification</h2>
        
        <h3 className="text-xl font-semibold text-white mt-6 mb-3">5.1. Plans disponibles</h3>
        <p>NewsFlow propose trois plans :</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Free</strong> : Accès gratuit avec limitations (2 Flows/semaine, pas d'export email)</li>
          <li><strong>Basic</strong> : 9,90€/mois (5 Flows/semaine, export PDF, envoi par email)</li>
          <li><strong>Pro</strong> : 16,90€/mois (15 Flows/semaine, IA avancée, support prioritaire)</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">5.2. Paiement et facturation</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Les paiements sont traités par <strong>Stripe</strong>, notre processeur de paiement sécurisé</li>
          <li>Les abonnements sont facturés mensuellement, à l'avance, le jour de votre souscription</li>
          <li>Les prix sont indiqués en euros (€) TTC</li>
          <li>Nous nous réservons le droit de modifier les tarifs avec un préavis de 30 jours</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">5.3. Renouvellement automatique</h3>
        <p>
          Votre abonnement se renouvelle automatiquement chaque mois jusqu'à annulation. Vous pouvez annuler votre 
          abonnement à tout moment depuis votre compte. L'annulation prend effet à la fin de la période de facturation 
          en cours (pas de remboursement au prorata).
        </p>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">5.4. Remboursement</h3>
        <p>
          Nous offrons une <strong>garantie satisfait ou remboursé de 14 jours</strong> à compter de votre première 
          souscription. Passé ce délai, aucun remboursement ne sera accordé sauf obligation légale.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Utilisation du service</h2>
        
        <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.1. Utilisation autorisée</h3>
        <p>Vous vous engagez à utiliser NewsFlow uniquement :</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>À des fins légales et conformément aux présentes CGU</li>
          <li>De manière à ne pas perturber le fonctionnement du service</li>
          <li>Sans tenter d'accéder de manière non autorisée aux systèmes ou données</li>
          <li>Sans reproduire, copier ou revendre le service à des tiers</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.2. Utilisations interdites</h3>
        <p>Il est strictement interdit de :</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Utiliser le service à des fins frauduleuses ou illégales</li>
          <li>Tenter de contourner les limitations techniques du service</li>
          <li>Extraire massivement des données via des scripts automatisés (scraping)</li>
          <li>Partager votre compte avec des tiers</li>
          <li>Utiliser le service pour créer un service concurrent</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Propriété intellectuelle</h2>
        
        <h3 className="text-xl font-semibold text-white mt-6 mb-3">7.1. Propriété de NewsFlow</h3>
        <p>
          Tous les éléments du service NewsFlow (code source, design, marques, logos, algorithmes d'IA) sont la 
          propriété exclusive de NewsFlow et sont protégés par les lois sur la propriété intellectuelle.
        </p>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">7.2. Contenu généré</h3>
        <p>
          Les Flows générés par NewsFlow sont créés à partir de sources publiques. Bien que le contenu soit original 
          et synthétisé par notre IA, les informations sous-jacentes proviennent de sources tierces. Vous pouvez utiliser 
          vos Flows à des fins personnelles ou professionnelles, mais vous ne pouvez pas les revendre ou les redistribuer 
          massivement sans autorisation.
        </p>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">7.3. Sources et citations</h3>
        <p>
          Chaque Flow inclut les sources utilisées. Vous devez respecter les droits d'auteur des sources originales 
          si vous utilisez les informations dans vos propres publications.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Limitation de responsabilité</h2>
        
        <h3 className="text-xl font-semibold text-white mt-6 mb-3">8.1. Nature du service</h3>
        <p>
          NewsFlow est un <strong>service d'information et d'aide à la décision</strong>. Nous ne garantissons pas :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>L'exactitude absolue de toutes les informations contenues dans les Flows</li>
          <li>L'exhaustivité des informations sur un sujet donné</li>
          <li>L'absence d'erreurs dans les analyses générées par l'IA</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">8.2. Exclusion de responsabilité</h3>
        <p>
          <strong>NewsFlow ne peut en aucun cas être tenu responsable :</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Des décisions d'investissement financier prises sur la base des informations fournies</li>
          <li>Des pertes financières résultant de l'utilisation des informations NewsFlow</li>
          <li>Des dommages indirects, pertes de profits, ou pertes de données</li>
          <li>Des interruptions de service dues à des causes indépendantes de notre volonté (maintenance, force majeure)</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">8.3. Disponibilité du service</h3>
        <p>
          Nous nous efforçons de maintenir le service disponible 24/7, mais nous ne garantissons pas une disponibilité 
          ininterrompue. Des interruptions peuvent survenir pour maintenance, mises à jour, ou causes techniques.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Protection des données</h2>
        <p>
          Le traitement de vos données personnelles est régi par notre <a href="/legal/privacy">Politique de Confidentialité</a>, 
          qui fait partie intégrante des présentes CGU. En utilisant NewsFlow, vous acceptez également notre politique de confidentialité.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Résiliation</h2>
        
        <h3 className="text-xl font-semibold text-white mt-6 mb-3">10.1. Résiliation par l'utilisateur</h3>
        <p>
          Vous pouvez résilier votre compte à tout moment depuis les paramètres de votre compte. Pour les abonnements payants, 
          l'annulation prend effet à la fin de la période de facturation en cours.
        </p>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">10.2. Résiliation par NewsFlow</h3>
        <p>
          Nous nous réservons le droit de suspendre ou résilier votre compte immédiatement en cas de :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Violation des présentes CGU</li>
          <li>Utilisation frauduleuse ou abusive du service</li>
          <li>Non-paiement de votre abonnement</li>
          <li>Activité suspecte ou préjudiciable au service</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Droit applicable et juridiction</h2>
        <p>
          Les présentes CGU sont régies par le droit français. En cas de litige, et après tentative de résolution amiable, 
          les tribunaux français seront seuls compétents.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Contact</h2>
        <p>
          Pour toute question concernant ces CGU, contactez-nous :
        </p>
        <ul className="list-none pl-0 space-y-2">
          <li><strong>Email</strong> : <a href="mailto:legal@newsflow.com">legal@newsflow.com</a></li>
          <li><strong>Formulaire de contact</strong> : <a href="/contact">/contact</a></li>
        </ul>
      </section>
    </>
  )
}








