export interface BlogArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: number
  imageUrl: string
}

export const MOCK_BLOG_ARTICLES: BlogArticle[] = [
  {
    id: "1",
    slug: "ia-traders-2025",
    title: "L'IA remplace-t-elle vraiment les traders ?",
    excerpt: "Analyse des performances des fonds 100% IA versus les équipes hybrides sur le Q4 2024.",
    date: "12 Jan 2025",
    category: "Finance",
    readTime: 4,
    imageUrl: "/images/blog/ai.jpg",
  },
  {
    id: "2",
    slug: "altcoins-2025",
    title: "Crypto : Le réveil des Altcoins",
    excerpt: "Pourquoi la dominance du Bitcoin faiblit et ce que cela signifie pour votre portefeuille.",
    date: "05 Jan 2025",
    category: "Crypto",
    readTime: 3,
    imageUrl: "/images/blog/ai.jpg",
  },
  {
    id: "3",
    slug: "tuto-deep-search",
    title: "Comprendre le Deep Search de NewsFlow",
    excerpt: "Tutoriel rapide : comment filtrer 50 000 news en 3 secondes pour trouver une pépite.",
    date: "28 Déc 2024",
    category: "Produit",
    readTime: 2,
    imageUrl: "/images/blog/ai.jpg",
  },
]

