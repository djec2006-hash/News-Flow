"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BlogPost } from "@/lib/blog-data"

// Variants pour animations
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// Fonction pour formater la date relative
function formatRelativeDate(dateString: string): string {
  // Si la date est au format "12 Jan 2025", on la retourne telle quelle
  if (dateString.includes("Jan") || dateString.includes("Déc") || dateString.includes("Nov") || dateString.includes("Oct")) {
    return dateString
  }
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Hier"
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
    return `Il y a ${Math.floor(diffDays / 30)} mois`
  } catch {
    return dateString
  }
}

// Couleurs de badges par catégorie
const categoryColors: Record<string, string> = {
  Tech: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  Crypto: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Produit: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Conseil: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Marchés: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Tuto: "bg-purple-500/20 text-purple-400 border-purple-500/30",
}

// Composant Hero Post (Article à la Une)
const HeroPost = ({ article }: { article: BlogPost }) => {
  return (
    <motion.article
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="mb-16"
    >
      <Link href={`/blog/${article.slug}`}>
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 hover:border-white/20 transition-all duration-500">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image à gauche */}
            <div className="relative h-64 md:h-auto aspect-video md:aspect-auto overflow-hidden">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/60 via-zinc-900/20 to-transparent md:hidden" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900/80 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-zinc-900/60" />
            </div>

            {/* Contenu à droite */}
            <div className="relative p-8 md:p-12 flex flex-col justify-center bg-zinc-900/50 md:bg-transparent">
              <div className="mb-4">
                <Badge className={categoryColors[article.category] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"}>
                  {article.category}
                </Badge>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white group-hover:text-indigo-400 transition-colors leading-tight">
                {article.title}
              </h2>
              
              <p className="text-lg text-zinc-400 mb-6 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>

              {/* Méta-données */}
              <div className="flex items-center gap-4 text-sm text-zinc-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{formatRelativeDate(article.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime} min de lecture</span>
                </div>
              </div>

              {/* Bouton CTA */}
              <Button
                variant="ghost"
                className="w-fit text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 p-0 h-auto font-medium group/btn"
              >
                Lire l'article
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

// Composant Carte Article
const ArticleCard = ({ article }: { article: BlogPost }) => {
  return (
    <motion.article
      variants={fadeInUp}
      className="group"
    >
      <Link href={`/blog/${article.slug}`}>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent" />
            
            {/* Badge catégorie */}
            <div className="absolute top-4 left-4">
              <Badge className={categoryColors[article.category] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"}>
                {article.category}
              </Badge>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-tight">
              {article.title}
            </h3>
            
            <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
              {article.excerpt}
            </p>
            
            {/* Méta-données */}
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatRelativeDate(article.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{article.readTime} min</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

interface BlogContentProps {
  posts: BlogPost[]
}

export default function BlogContent({ posts }: BlogContentProps) {
  // Le premier article est le hero, les autres sont dans la grille
  const heroPost = posts[0]
  const recentPosts = posts.slice(1)

  if (!heroPost) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400">Aucun article disponible</p>
      </div>
    )
  }

  return (
    <>
      {/* Article à la Une */}
      <HeroPost article={heroPost} />

      {/* Grille d'articles récents */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="mb-8"
      >
        <motion.h2
          variants={fadeInUp}
          className="text-3xl font-bold mb-8 text-white"
        >
          Articles récents
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </motion.div>
    </>
  )
}



