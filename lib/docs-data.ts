export interface DocContent {
  slug: string
  title: string
  category: string
  content: string
}

export const DOCS_CONTENT: Record<string, DocContent> = {
  intro: {
    slug: 'intro',
    title: 'Bienvenue',
    category: 'Introduction',
    content: `
      <p class="lead">Bienvenue dans la documentation NewsFlow. Notre mission est de transformer votre façon de consommer l'information financière.</p>
      
      <h2>Qu'est-ce que NewsFlow ?</h2>
      <p>NewsFlow est une plateforme d'agrégation d'actualités alimentée par l'intelligence artificielle. Elle collecte, analyse et synthétise des milliers de sources d'information pour vous fournir des rapports personnalisés appelés <strong>Flows</strong>.</p>
      
      <h2>Notre mission</h2>
      <p>Dans un monde où l'information financière est dispersée sur des centaines de sources, NewsFlow centralise tout pour vous. Nous croyons que chaque professionnel de la finance mérite d'avoir accès à une veille intelligente, automatisée et personnalisée.</p>
      
      <h2>Comment commencer ?</h2>
      <p>Si vous débutez avec NewsFlow, nous vous recommandons de suivre ce parcours :</p>
      <ol>
        <li><a href="/docs/create-flow">Créer votre premier Flow</a></li>
        <li><a href="/docs/alerts">Configurer vos alertes email</a></li>
        <li><a href="/docs/score">Comprendre le score de pertinence</a></li>
      </ol>
      
      <p>Explorez la documentation à votre rythme. Chaque section contient des guides détaillés et des exemples pratiques.</p>
    `
  },
  'create-flow': {
    slug: 'create-flow',
    title: 'Créer votre premier Flow',
    category: 'Premiers pas',
    content: `
      <p class="lead">Un Flow est une veille thématique automatisée. Suivez ce guide étape par étape pour créer votre premier Flow en moins de 2 minutes.</p>
      
      <h2>Étape 1 : Accéder au Dashboard</h2>
      <p>Une fois connecté à votre compte NewsFlow, vous arrivez sur votre Dashboard. C'est votre centre de commande principal.</p>
      
      <h2>Étape 2 : Cliquer sur "Nouveau Flow"</h2>
      <p>Dans le Dashboard, repérez le bouton <strong>"Nouveau Flow"</strong> (généralement en haut à droite ou au centre de la page). Cliquez dessus pour commencer.</p>
      
      <h2>Étape 3 : Choisir vos mots-clés</h2>
      <p>C'est l'étape la plus importante. Définissez les sujets qui vous intéressent :</p>
      <ul>
        <li><strong>Exemples de mots-clés :</strong> "Bitcoin", "Fed taux directeur", "EUR/USD", "Tech stocks"</li>
        <li><strong>Astuce :</strong> Soyez spécifique. "Crypto" est trop large, préférez "Bitcoin ETF" ou "Ethereum upgrade"</li>
        <li><strong>Combinaisons :</strong> Vous pouvez ajouter plusieurs mots-clés pour un Flow plus complet</li>
      </ul>
      
      <h2>Étape 4 : Configurer les options (optionnel)</h2>
      <p>Avant de générer votre Flow, vous pouvez :</p>
      <ul>
        <li>Choisir la fréquence de mise à jour (quotidien, hebdomadaire)</li>
        <li>Sélectionner vos sources préférées</li>
        <li>Définir le niveau de complexité (débutant, standard, expert)</li>
      </ul>
      
      <h2>Étape 5 : Générer votre Flow</h2>
      <p>Cliquez sur <strong>"Générer"</strong> et attendez quelques secondes. Notre IA va analyser des milliers de sources et créer votre premier rapport personnalisé.</p>
      
      <h2>Prochaines étapes</h2>
      <p>Une fois votre Flow créé, vous pouvez :</p>
      <ul>
        <li>Le consulter directement dans le Dashboard</li>
        <li><a href="/docs/alerts">Configurer des alertes email</a> pour le recevoir automatiquement</li>
        <li>Le partager avec votre équipe</li>
        <li>L'exporter en PDF</li>
      </ul>
    `
  },
  alerts: {
    slug: 'alerts',
    title: 'Configurer vos alertes',
    category: 'Premiers pas',
    content: `
      <p class="lead">Recevez vos Flows directement dans votre boîte mail. Configurez la fréquence et le format selon vos préférences.</p>
      
      <h2>Activer les alertes email</h2>
      <p>Pour activer les alertes email, rendez-vous dans les paramètres de votre compte :</p>
      <ol>
        <li>Cliquez sur votre avatar en haut à droite</li>
        <li>Sélectionnez <strong>"Paramètres"</strong></li>
        <li>Allez dans la section <strong>"Notifications"</strong></li>
        <li>Activez l'option <strong>"Recevoir les Flows par email"</strong></li>
      </ol>
      
      <h2>Personnaliser la fréquence</h2>
      <p>Vous avez le choix entre plusieurs options :</p>
      <ul>
        <li><strong>En temps réel :</strong> Recevez un email dès qu'un Flow est généré</li>
        <li><strong>Quotidien :</strong> Un résumé de tous vos Flows du jour (recommandé)</li>
        <li><strong>Hebdomadaire :</strong> Un récapitulatif chaque lundi matin</li>
      </ul>
      
      <h2>Format des emails</h2>
      <p>Les emails peuvent être envoyés en deux formats :</p>
      <ul>
        <li><strong>Texte simple :</strong> Format minimaliste, rapide à lire</li>
        <li><strong>HTML enrichi :</strong> Format avec images, liens cliquables et mise en page optimisée (recommandé)</li>
      </ul>
      
      <h2>Filtrer par projet</h2>
      <p>Si vous avez plusieurs Flows organisés en projets, vous pouvez choisir de recevoir uniquement les alertes pour certains projets spécifiques.</p>
      
      <h2>Gérer vos alertes</h2>
      <p>Vous pouvez à tout moment :</p>
      <ul>
        <li>Modifier la fréquence depuis les paramètres</li>
        <li>Désactiver temporairement les alertes</li>
        <li>Consulter l'historique des emails envoyés</li>
      </ul>
    `
  },
  score: {
    slug: 'score',
    title: 'Comprendre le score de pertinence',
    category: 'Premiers pas',
    content: `
      <p class="lead">Le score de pertinence est un indicateur calculé par notre IA pour évaluer à quel point une information est pertinente par rapport à votre sujet de recherche.</p>
      
      <h2>Comment est calculé le score ?</h2>
      <p>Notre algorithme analyse plusieurs facteurs pour déterminer le score de pertinence (sur une échelle de 0 à 100) :</p>
      <ul>
        <li><strong>Pertinence sémantique (40%) :</strong> Correspondance entre le contenu et votre requête</li>
        <li><strong>Fraîcheur (25%) :</strong> Plus l'information est récente, plus le score est élevé</li>
        <li><strong>Source (20%) :</strong> Les sources institutionnelles et vérifiées ont un bonus</li>
        <li><strong>Exhaustivité (15%) :</strong> La profondeur et la complétude de l'information</li>
      </ul>
      
      <h2>Interpréter les scores</h2>
      <p>Les scores sont affichés sur une échelle de 0 à 100 :</p>
      <ul>
        <li><strong>90-100 :</strong> Information très pertinente, à lire en priorité</li>
        <li><strong>70-89 :</strong> Information pertinente, recommandée</li>
        <li><strong>50-69 :</strong> Information modérément pertinente</li>
        <li><strong>0-49 :</strong> Information peu pertinente, peut être ignorée</li>
      </ul>
      
      <h2>Utiliser le score pour filtrer</h2>
      <p>Vous pouvez utiliser le score de pertinence pour filtrer vos résultats :</p>
      <ol>
        <li>Dans les paramètres de recherche, définissez un score minimum</li>
        <li>Seuls les résultats au-dessus de ce seuil seront affichés</li>
        <li>Recommandation : Commencez avec un score de 70 pour voir uniquement les informations les plus pertinentes</li>
      </ol>
      
      <h2>Exemple concret</h2>
      <p>Si vous créez un Flow sur "Bitcoin ETF", une nouvelle annonçant l'approbation d'un ETF Bitcoin par la SEC aura un score de 95, tandis qu'un article général sur les cryptomonnaies n'aura qu'un score de 30.</p>
    `
  },
  'deep-search': {
    slug: 'deep-search',
    title: 'Deep Search',
    category: "Comprendre l'IA",
    content: `
      <p class="lead">Le mode Deep Search analyse non seulement les titres mais le contenu complet des articles pour trouver des corrélations cachées.</p>
      
      <h2>Qu'est-ce que Deep Search ?</h2>
      <p>Contrairement à une recherche classique qui se limite aux titres et mots-clés, Deep Search utilise l'intelligence artificielle pour analyser le contenu complet de chaque article. Cela permet de découvrir des informations pertinentes même si elles ne sont pas explicitement mentionnées dans le titre.</p>
      
      <h2>Comment ça fonctionne ?</h2>
      <p>Deep Search utilise un modèle de langage avancé qui :</p>
      <ul>
        <li><strong>Comprend le contexte :</strong> Identifie les concepts liés même s'ils ne sont pas explicitement mentionnés</li>
        <li><strong>Analyse sémantique :</strong> Détecte les synonymes et variations linguistiques</li>
        <li><strong>Détecte les corrélations :</strong> Trouve des liens entre différents concepts</li>
        <li><strong>Évalue la pertinence :</strong> Calcule un score de pertinence pour chaque résultat</li>
      </ul>
      
      <h2>Quand utiliser Deep Search ?</h2>
      <p>Deep Search est particulièrement utile pour :</p>
      <ul>
        <li><strong>Recherches complexes :</strong> Quand vous cherchez des concepts abstraits ou des relations indirectes</li>
        <li><strong>Veille stratégique :</strong> Pour identifier des tendances émergentes avant qu'elles ne deviennent évidentes</li>
        <li><strong>Analyse approfondie :</strong> Quand vous avez besoin d'une vue d'ensemble complète sur un sujet</li>
      </ul>
      
      <h2>Différence avec le mode Fast</h2>
      <p>Le mode Fast recherche uniquement dans les titres et métadonnées, ce qui est plus rapide mais moins complet. Deep Search est plus lent mais beaucoup plus exhaustif.</p>
      
      <h2>Limites et quotas</h2>
      <p>Deep Search nécessite plus de ressources, c'est pourquoi :</p>
      <ul>
        <li><strong>Plan Free :</strong> 5 recherches Deep Search par semaine</li>
        <li><strong>Plan Pro :</strong> Recherches illimitées</li>
        <li><strong>Plan Enterprise :</strong> Recherches illimitées + API access</li>
      </ul>
    `
  },
  sources: {
    slug: 'sources',
    title: 'Ajouter des sources',
    category: 'Gérer les Sources',
    content: `
      <p class="lead">Personnalisez vos Flows en choisissant les sources d'information qui vous intéressent. Filtrez par domaine, type de contenu et fiabilité.</p>
      
      <h2>Comment filtrer par domaine ?</h2>
      <p>NewsFlow vous permet de filtrer les sources par domaine d'activité :</p>
      <ol>
        <li>Dans les paramètres de votre Flow, allez dans la section <strong>"Sources"</strong></li>
        <li>Cliquez sur <strong>"Ajouter des sources"</strong></li>
        <li>Sélectionnez les domaines qui vous intéressent :
          <ul>
            <li>Finance & Marchés</li>
            <li>Technologie</li>
            <li>Géopolitique</li>
            <li>Économie</li>
            <li>Et bien d'autres...</li>
          </ul>
        </li>
      </ol>
      
      <h2>Types de sources disponibles</h2>
      <p>NewsFlow agrège plusieurs types de sources :</p>
      <ul>
        <li><strong>Presse spécialisée :</strong> Les Echos, Financial Times, Bloomberg, etc.</li>
        <li><strong>Institutions :</strong> Banques centrales, régulateurs, agences statistiques</li>
        <li><strong>Analyses :</strong> Rapports d'experts, analyses de marché</li>
        <li><strong>Réseaux sociaux :</strong> Twitter/X (pour le sentiment de marché)</li>
      </ul>
      
      <h2>Filtrer par fiabilité</h2>
      <p>Vous pouvez également filtrer les sources selon leur score de fiabilité :</p>
      <ul>
        <li><strong>Haute fiabilité :</strong> Sources institutionnelles vérifiées</li>
        <li><strong>Fiabilité moyenne :</strong> Presse reconnue</li>
        <li><strong>Toutes sources :</strong> Inclut également les analyses indépendantes</li>
      </ul>
      
      <h2>Gérer vos sources favorites</h2>
      <p>Marquez vos sources préférées pour qu'elles soient toujours prioritaires dans vos Flows. Vous pouvez :</p>
      <ul>
        <li>Ajouter des sources à vos favoris</li>
        <li>Créer des listes personnalisées</li>
        <li>Exclure certaines sources si nécessaire</li>
      </ul>
    `
  },
  account: {
    slug: 'account',
    title: 'Paramètres du compte',
    category: 'Compte & Facturation',
    content: `
      <p class="lead">Gérez votre abonnement, vos préférences et vos paramètres de compte depuis un seul endroit.</p>
      
      <h2>Accéder aux paramètres</h2>
      <p>Pour accéder aux paramètres de votre compte :</p>
      <ol>
        <li>Cliquez sur votre avatar en haut à droite du Dashboard</li>
        <li>Sélectionnez <strong>"Paramètres"</strong></li>
      </ol>
      
      <h2>Gestion de l'abonnement</h2>
      <p>Dans la section <strong>"Abonnement"</strong>, vous pouvez :</p>
      <ul>
        <li><strong>Voir votre plan actuel :</strong> Free, Pro ou Enterprise</li>
        <li><strong>Changer de plan :</strong> Upgrade ou downgrade selon vos besoins</li>
        <li><strong>Gérer la facturation :</strong> Ajouter/modifier votre carte bancaire</li>
        <li><strong>Consulter l'historique :</strong> Voir toutes vos factures précédentes</li>
      </ul>
      
      <h2>Préférences personnelles</h2>
      <p>Personnalisez votre expérience NewsFlow :</p>
      <ul>
        <li><strong>Langue :</strong> Choisissez votre langue d'interface</li>
        <li><strong>Fuseau horaire :</strong> Pour des dates et heures correctes</li>
        <li><strong>Thème :</strong> Mode sombre (par défaut) ou mode clair</li>
        <li><strong>Notifications :</strong> Configurez les alertes email et push</li>
      </ul>
      
      <h2>Sécurité</h2>
      <p>Protégez votre compte :</p>
      <ul>
        <li><strong>Changer le mot de passe :</strong> Mettez à jour votre mot de passe régulièrement</li>
        <li><strong>Authentification à deux facteurs :</strong> Activez la 2FA pour plus de sécurité</li>
        <li><strong>Sessions actives :</strong> Gérez les appareils connectés à votre compte</li>
      </ul>
      
      <h2>Données et confidentialité</h2>
      <p>Contrôlez vos données :</p>
      <ul>
        <li><strong>Export de données :</strong> Téléchargez toutes vos données en format JSON</li>
        <li><strong>Suppression de compte :</strong> Supprimez définitivement votre compte et toutes vos données</li>
        <li><strong>Préférences de confidentialité :</strong> Gérez ce que NewsFlow peut collecter</li>
      </ul>
    `
  }
}

// Fonction utilitaire pour obtenir un contenu par slug
export function getDocBySlug(slug: string): DocContent | undefined {
  return DOCS_CONTENT[slug]
}

// Fonction pour obtenir tous les slugs (pour la génération statique)
export function getAllDocSlugs(): string[] {
  return Object.keys(DOCS_CONTENT)
}

