export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  coverImage: string
  date: string
  category: string
  readTime: string
  author: {
    name: string
    picture: string
  }
  content: string // Contenu HTML pour la page de détail
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ia-trading-revolution-2025",
    title: "L'IA générative : La fin des traders humains d'ici 2030 ?",
    excerpt: "Analyse profonde de l'impact des nouveaux modèles LLM sur le trading haute fréquence et la gestion de portefeuille.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
    date: "2025-01-15",
    category: "Intelligence Artificielle",
    readTime: "5 min",
    author: {
      name: "Alex Chen",
      picture: "https://i.pravatar.cc/150?u=alex",
    },
    content: `
      <h2>Le grand remplacement algorithmique</h2>
      <p>Depuis l'avènement de GPT-4 et ses successeurs, le monde de la finance tremble. Ce qui n'était qu'un outil d'assistance devient rapidement un pilote autonome.</p>
      <p>Les banques d'investissement Goldman Sachs et JP Morgan ont déjà annoncé réduire leurs effectifs juniors au profit d'agents IA capables d'analyser des bilans en quelques secondes.</p>
      <h2>Où se situe la valeur humaine ?</h2>
      <p>Si l'exécution et l'analyse quantitative sont déléguées, il reste la stratégie macro-économique et... la psychologie de marché. Ironiquement, c'est en comprenant les peurs humaines que les traders survivront aux machines.</p>
    `,
  },
  {
    slug: "bitcoin-etf-impact-institutionnel",
    title: "Bitcoin à 150k$ : L'effet retard des ETF Spot enfin visible",
    excerpt: "Les flux institutionnels atteignent des records. Pourquoi le marché a mis 6 mois à digérer la nouvelle.",
    coverImage: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1000&auto=format&fit=crop",
    date: "2025-01-10",
    category: "Crypto & Blockchain",
    readTime: "4 min",
    author: {
      name: "Sarah Connor",
      picture: "https://i.pravatar.cc/150?u=sarah",
    },
    content: `
      <h2>Le barrage a cédé</h2>
      <p>Pendant des mois, les analystes s'interrogeaient : "Les ETF sont là, où est le pump ?". La réponse était simple : le temps de l'intégration.</p>
      <ul>
        <li>Les fonds de pension devaient modifier leurs statuts.</li>
        <li>Les conseillers financiers devaient être formés.</li>
        <li>Les plateformes bancaires devaient intégrer les produits.</li>
      </ul>
      <p>Aujourd'hui, le robinet est grand ouvert. BlackRock absorbe l'équivalent de 2 jours de production minière quotidiennement.</p>
    `,
  },
  {
    slug: "crise-dette-souveraine-retour",
    title: "Alerte Macro : Pourquoi la dette US inquiète de nouveau",
    excerpt: "Avec des taux directeurs qui ne baissent pas assez vite, le coût de la dette devient insoutenable pour les G7.",
    coverImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1000&auto=format&fit=crop",
    date: "2025-01-05",
    category: "Macro-économie",
    readTime: "7 min",
    author: {
      name: "Marc Fiorentino",
      picture: "https://i.pravatar.cc/150?u=marc",
    },
    content: `<p>Contenu détaillé sur la dette...</p>`,
  },
  {
    slug: "nvidia-vs-amd-guerre-puces",
    title: "Semi-conducteurs : La bataille pour l'inférence IA",
    excerpt: "Nvidia domine l'entraînement, mais AMD mise tout sur l'exécution des modèles. Qui gagnera la manche 2 ?",
    coverImage: "https://images.unsplash.com/photo-1661347561635-1f71814fb4cd?q=80&w=1000&auto=format&fit=crop",
    date: "2024-12-28",
    category: "Tech Stocks",
    readTime: "6 min",
    author: {
      name: "Linus T.",
      picture: "https://i.pravatar.cc/150?u=linus",
    },
    content: `<p>Analyse tech...</p>`,
  },
  {
    slug: "immobilier-commercial-krach",
    title: "L'immobilier de bureau ne s'en remettra pas",
    excerpt: "Le télétravail est devenu la norme. Des milliards de dollars d'actifs sont 'échoués' dans les bilans bancaires.",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
    date: "2024-12-20",
    category: "Immobilier",
    readTime: "5 min",
    author: {
      name: "Jean Dupont",
      picture: "https://i.pravatar.cc/150?u=jean",
    },
    content: `<p>Analyse immo...</p>`,
  },
  {
    slug: "cybersecurite-enjeu-2025",
    title: "Cybersécurité : Le nouveau champ de bataille des états",
    excerpt: "Les attaques contre les infrastructures financières se multiplient. Comment les banques se protègent-elles ?",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
    date: "2024-12-15",
    category: "Tech & Sécurité",
    readTime: "4 min",
    author: {
      name: "Alice M.",
      picture: "https://i.pravatar.cc/150?u=alice",
    },
    content: `<p>Analyse sécu...</p>`,
  },
]

// Fonction utilitaire pour obtenir un article par slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug)
}

// Fonction pour obtenir tous les slugs (pour la génération statique)
export function getAllSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug)
}
