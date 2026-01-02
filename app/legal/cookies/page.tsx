export default function CookiesPage() {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Politique de Cookies
      </h1>
      <p className="text-lg text-zinc-400 mb-8">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
        <p>
          Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la 
          visite d'un site web. Il permet au site de reconnaître votre navigateur et de mémoriser certaines informations 
          vous concernant.
        </p>
        <p>
          Les cookies sont largement utilisés pour faire fonctionner les sites web de manière plus efficace, ainsi que 
          pour fournir des informations aux propriétaires du site.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Cookies utilisés sur NewsFlow</h2>
        
        <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1. Cookies strictement nécessaires</h3>
        <p>
          Ces cookies sont indispensables au fonctionnement du service. Ils ne peuvent pas être désactivés :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Cookies de session Supabase</strong> : 
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Nom : <code className="text-indigo-400">sb-*-auth-token</code></li>
              <li>Durée : Session (supprimé à la fermeture du navigateur)</li>
              <li>Finalité : Maintenir votre session de connexion sécurisée</li>
              <li>Fournisseur : Supabase (notre base de données)</li>
            </ul>
          </li>
          <li>
            <strong>Cookies de sécurité</strong> :
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Protection CSRF (Cross-Site Request Forgery)</li>
              <li>Vérification de l'intégrité des requêtes</li>
            </ul>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2. Cookies de fonctionnalité</h3>
        <p>
          Ces cookies améliorent votre expérience utilisateur :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Préférences utilisateur</strong> :
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Mémorisation de vos paramètres (thème, langue, préférences de contenu)</li>
              <li>Durée : 12 mois</li>
            </ul>
          </li>
          <li>
            <strong>Cookies Stripe</strong> (si vous avez un abonnement) :
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Nom : <code className="text-indigo-400">__stripe_*</code></li>
              <li>Finalité : Sécuriser les transactions de paiement</li>
              <li>Durée : Variable (selon Stripe)</li>
              <li>Fournisseur : Stripe (processeur de paiement)</li>
            </ul>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.3. Cookies d'analyse (Analytics)</h3>
        <p>
          Ces cookies nous aident à comprendre comment vous utilisez NewsFlow pour améliorer le service :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Vercel Analytics</strong> :
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Finalité : Mesurer le trafic, les pages visitées, les performances</li>
              <li>Données collectées : Anonymisées (pas d'identification personnelle)</li>
              <li>Durée : 24 mois</li>
              <li>Fournisseur : Vercel (hébergeur)</li>
            </ul>
          </li>
        </ul>
        <p className="mt-4">
          <strong>Note importante</strong> : Nous n'utilisons pas de cookies publicitaires ou de tracking tiers 
          (Google Analytics, Facebook Pixel, etc.). Notre analyse est limitée aux métriques techniques anonymes.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Gestion des cookies</h2>
        
        <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.1. Paramètres du navigateur</h3>
        <p>
          Vous pouvez configurer votre navigateur pour refuser les cookies. Cependant, cela peut affecter le 
          fonctionnement de NewsFlow :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Chrome</strong> : Paramètres → Confidentialité et sécurité → Cookies</li>
          <li><strong>Firefox</strong> : Options → Vie privée et sécurité → Cookies</li>
          <li><strong>Safari</strong> : Préférences → Confidentialité → Cookies</li>
          <li><strong>Edge</strong> : Paramètres → Cookies et autorisations de site</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.2. Impact du refus des cookies</h3>
        <p>
          Si vous refusez les cookies strictement nécessaires (session Supabase), vous ne pourrez pas :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Vous connecter à votre compte</li>
          <li>Générer des Flows</li>
          <li>Accéder à vos données personnelles</li>
        </ul>
        <p className="mt-4">
          Le refus des cookies d'analyse n'affecte pas le fonctionnement du service, mais nous prive d'informations 
          utiles pour améliorer NewsFlow.
        </p>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.3. Suppression des cookies</h3>
        <p>
          Vous pouvez supprimer les cookies déjà stockés sur votre terminal à tout moment via les paramètres de votre 
          navigateur. Notez que cela vous déconnectera de votre compte NewsFlow.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Cookies tiers</h2>
        <p>
          NewsFlow utilise les services suivants qui peuvent déposer leurs propres cookies :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Supabase</strong> : Cookies de session pour l'authentification
            <br />
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
              Politique de confidentialité Supabase
            </a>
          </li>
          <li>
            <strong>Stripe</strong> : Cookies de sécurité pour les paiements
            <br />
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
              Politique de confidentialité Stripe
            </a>
          </li>
          <li>
            <strong>Vercel</strong> : Cookies d'analyse anonyme
            <br />
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
              Politique de confidentialité Vercel
            </a>
          </li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Durée de conservation</h2>
        <p>
          Les cookies que nous utilisons ont différentes durées de vie :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Cookies de session</strong> : Supprimés à la fermeture du navigateur</li>
          <li><strong>Cookies de préférences</strong> : 12 mois maximum</li>
          <li><strong>Cookies d'analyse</strong> : 24 mois maximum</li>
          <li><strong>Cookies Stripe</strong> : Selon la politique de Stripe (généralement 1 an)</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Vos droits</h2>
        <p>
          Conformément au RGPD et à la directive ePrivacy, vous avez le droit de :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Être informé de l'utilisation des cookies (via cette politique)</li>
          <li>Donner ou retirer votre consentement pour les cookies non essentiels</li>
          <li>Configurer votre navigateur pour refuser les cookies</li>
          <li>Supprimer les cookies déjà stockés</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Modifications de cette politique</h2>
        <p>
          Nous pouvons modifier cette politique de cookies à tout moment pour refléter les changements dans nos pratiques 
          ou pour d'autres raisons opérationnelles, légales ou réglementaires. La date de dernière mise à jour est indiquée 
          en haut de cette page.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Contact</h2>
        <p>
          Pour toute question concernant notre utilisation des cookies, contactez-nous :
        </p>
        <ul className="list-none pl-0 space-y-2">
          <li><strong>Email</strong> : <a href="mailto:privacy@newsflow.com">privacy@newsflow.com</a></li>
          <li><strong>Formulaire de contact</strong> : <a href="/contact">/contact</a></li>
        </ul>
      </section>
    </>
  )
}



