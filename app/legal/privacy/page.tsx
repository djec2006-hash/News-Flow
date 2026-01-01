export default function PrivacyPage() {
  return (
    <>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Politique de Confidentialité
      </h1>
      <p className="text-lg text-zinc-400 mb-8">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
        <p>
          NewsFlow ("nous", "notre", "nos") s'engage à protéger la confidentialité de vos données personnelles. 
          Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons 
          vos informations lorsque vous utilisez notre service.
        </p>
        <p>
          En utilisant NewsFlow, vous acceptez les pratiques décrites dans cette politique. Si vous n'acceptez pas 
          cette politique, veuillez ne pas utiliser notre service.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Données que nous collectons</h2>
        
        <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1. Données d'identification</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Nom et prénom</strong> : Collectés lors de l'inscription pour personnaliser votre expérience</li>
          <li><strong>Adresse email</strong> : Requise pour l'authentification et l'envoi de vos Flows</li>
          <li><strong>Date de naissance</strong> : Optionnelle, utilisée pour adapter le niveau de complexité du contenu</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2. Données de paiement</h3>
        <p>
          Les informations de paiement sont gérées exclusivement par <strong>Stripe</strong>, notre processeur de paiement. 
          NewsFlow ne stocke jamais vos numéros de carte bancaire. Nous recevons uniquement :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Le statut de votre abonnement (Free, Basic, Pro)</li>
          <li>La date d'expiration de votre plan (pour les codes promos temporaires)</li>
          <li>L'historique de vos transactions (via webhooks Stripe)</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.3. Données d'utilisation</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Préférences de contenu</strong> : Vos centres d'intérêt, domaines suivis, projets créés</li>
          <li><strong>Flows générés</strong> : Le contenu de vos analyses personnalisées</li>
          <li><strong>Paramètres d'email</strong> : Fréquence et heure d'envoi de vos Flows</li>
          <li><strong>Logs d'activité</strong> : Connexions, générations de Flows, exports PDF</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.4. Données techniques</h3>
        <p>
          Nous collectons automatiquement certaines informations techniques via <strong>Supabase</strong> (notre base de données) :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Adresse IP (pour la sécurité et la prévention de la fraude)</li>
          <li>Type de navigateur et système d'exploitation</li>
          <li>Cookies de session pour maintenir votre connexion</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Comment nous utilisons vos données</h2>
        <p>Nous utilisons vos données personnelles uniquement pour :</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Fournir le service</strong> : Générer vos Flows personnalisés selon vos préférences</li>
          <li><strong>Gérer votre compte</strong> : Authentification, gestion de l'abonnement, facturation</li>
          <li><strong>Améliorer le service</strong> : Analyser l'utilisation pour optimiser l'IA et l'expérience utilisateur</li>
          <li><strong>Communication</strong> : Vous envoyer vos Flows par email, notifications importantes, support client</li>
          <li><strong>Sécurité</strong> : Détecter et prévenir la fraude, les abus, les violations de sécurité</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Base légale (RGPD)</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD), nous traitons vos données sur les bases légales suivantes :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Exécution du contrat</strong> : Pour fournir le service NewsFlow que vous avez souscrit</li>
          <li><strong>Consentement</strong> : Pour l'envoi d'emails marketing (vous pouvez vous désabonner à tout moment)</li>
          <li><strong>Intérêt légitime</strong> : Pour améliorer le service et prévenir la fraude</li>
          <li><strong>Obligation légale</strong> : Pour respecter nos obligations comptables et fiscales</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Partage de vos données</h2>
        <p>
          Nous ne vendons jamais vos données personnelles. Nous partageons vos informations uniquement avec :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Stripe</strong> : Pour le traitement des paiements (conformément à leur politique de confidentialité)</li>
          <li><strong>Supabase</strong> : Pour l'hébergement sécurisé de nos bases de données (conformément à leur politique de confidentialité)</li>
          <li><strong>Resend</strong> : Pour l'envoi d'emails transactionnels (conformément à leur politique de confidentialité)</li>
          <li><strong>Obligations légales</strong> : Si la loi l'exige (réquisition judiciaire, etc.)</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Sécurité des données</h2>
        <p>
          Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles strictes pour protéger vos données :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Chiffrement</strong> : Toutes les communications sont chiffrées en transit (HTTPS/TLS)</li>
          <li><strong>Chiffrement au repos</strong> : Vos données sont chiffrées dans notre base de données Supabase</li>
          <li><strong>Authentification forte</strong> : Connexion sécurisée via Supabase Auth avec tokens JWT</li>
          <li><strong>Accès restreint</strong> : Seuls les membres autorisés de l'équipe ont accès aux données</li>
          <li><strong>Audits réguliers</strong> : Nous effectuons des audits de sécurité réguliers</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Vos droits (RGPD)</h2>
        <p>
          Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Droit d'accès</strong> : Vous pouvez demander une copie de toutes vos données personnelles</li>
          <li><strong>Droit de rectification</strong> : Vous pouvez corriger vos données inexactes ou incomplètes</li>
          <li><strong>Droit à l'effacement</strong> : Vous pouvez demander la suppression de vos données ("droit à l'oubli")</li>
          <li><strong>Droit à la portabilité</strong> : Vous pouvez exporter vos données dans un format structuré (JSON)</li>
          <li><strong>Droit d'opposition</strong> : Vous pouvez vous opposer au traitement de vos données pour certaines finalités</li>
          <li><strong>Droit à la limitation</strong> : Vous pouvez demander la limitation du traitement dans certains cas</li>
        </ul>
        <p>
          Pour exercer ces droits, contactez-nous à l'adresse : <a href="mailto:privacy@newsflow.com">privacy@newsflow.com</a>
        </p>
        <p>
          Nous répondrons à votre demande dans un délai de 30 jours maximum.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Conservation des données</h2>
        <p>
          Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir le service :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Données de compte</strong> : Conservées tant que votre compte est actif, puis supprimées 30 jours après la fermeture</li>
          <li><strong>Flows générés</strong> : Conservés indéfiniment sauf demande de suppression de votre part</li>
          <li><strong>Données de paiement</strong> : Conservées 10 ans conformément aux obligations comptables françaises</li>
          <li><strong>Logs de sécurité</strong> : Conservés 12 mois pour la prévention de la fraude</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Transferts internationaux</h2>
        <p>
          Vos données sont hébergées par Supabase (États-Unis) et Stripe (États-Unis). Ces transferts sont encadrés par :
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Les <strong>Clauses Contractuelles Types</strong> de la Commission Européenne</li>
          <li>Le <strong>Privacy Shield</strong> (pour les données transférées avant son invalidation)</li>
          <li>Les garanties contractuelles de nos prestataires (Supabase, Stripe) conformes au RGPD</li>
        </ul>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Modifications de cette politique</h2>
        <p>
          Nous pouvons modifier cette politique de confidentialité à tout moment. Les modifications importantes vous seront 
          notifiées par email. La date de dernière mise à jour est indiquée en haut de cette page.
        </p>
      </section>

      <section className="space-y-6 mb-12">
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Contact</h2>
        <p>
          Pour toute question concernant cette politique de confidentialité ou vos données personnelles, contactez-nous :
        </p>
        <ul className="list-none pl-0 space-y-2">
          <li><strong>Email</strong> : <a href="mailto:privacy@newsflow.com">privacy@newsflow.com</a></li>
          <li><strong>Formulaire de contact</strong> : <a href="/contact">/contact</a></li>
        </ul>
        <p>
          Vous avez également le droit de déposer une plainte auprès de la <strong>CNIL</strong> (Commission Nationale de 
          l'Informatique et des Libertés) si vous estimez que vos droits ne sont pas respectés.
        </p>
      </section>
    </>
  )
}


