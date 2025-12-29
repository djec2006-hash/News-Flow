import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog-data"
import Navbar from "@/components/layout/navbar"
import { BlogImage } from "@/components/blog/BlogImage"

// Génération statique des pages
export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }))
}

// Métadonnées pour le SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: "Article non trouvé | NewsFlow Blog",
    }
  }

  return {
    title: `${post.title} | NewsFlow Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: "article",
      publishedTime: post.date,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  // Gestion d'erreur : Article non trouvé
  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        
        <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center py-20">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-4xl">📄</span>
              </div>
              <h1 className="text-4xl font-bold mb-4 text-white">Article non trouvé</h1>
              <p className="text-xl text-zinc-400 mb-8">
                Désolé, cet article n'existe pas ou a été supprimé.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au blog
              </Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // Formater la date en français
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="relative">
        {/* Hero Header avec image de couverture */}
        <div className="relative w-full h-[400px] sm:h-[500px] overflow-hidden">
          {/* Image de couverture */}
          <BlogImage
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          
          {/* Dégradé noir pour la lisibilité du texte */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />
          
          {/* Contenu par-dessus l'image */}
          <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto w-full">
              {/* Catégorie */}
              <div className="mb-4">
                <span className="inline-flex px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium border border-indigo-500/30 backdrop-blur-sm">
                  {post.category}
                </span>
              </div>
              
              {/* Titre */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight text-white">
                {post.title}
              </h1>
              
              {/* Date */}
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
            </div>
          </div>
        </div>

        {/* Conteneur Principal */}
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Bouton retour */}
          <div className="mb-8">
            <Button
              variant="ghost"
              asChild
              className="text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au blog
              </Link>
            </Button>
          </div>

          {/* Métadonnées : Auteur et temps de lecture */}
          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-zinc-800">
            {/* Photo de l'auteur */}
            <div className="flex-shrink-0">
              <BlogImage
                src={post.author.picture}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700"
                fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=6366f1&color=fff`}
              />
            </div>
            
            {/* Nom de l'auteur et temps de lecture */}
            <div className="flex-1">
              <p className="text-white font-medium">{post.author.name}</p>
              <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{post.readTime} de lecture</span>
              </div>
            </div>
          </div>

          {/* Corps du texte avec HTML */}
          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-blue-400 prose-p:text-zinc-300 prose-p:leading-relaxed prose-ul:text-zinc-300 prose-li:text-zinc-300 prose-strong:text-white prose-strong:font-semibold prose-a:no-underline hover:prose-a:text-blue-300 prose-a:underline prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Section Auteur en bas */}
          <div className="mt-16 pt-8 border-t border-zinc-800">
            <div className="flex items-center gap-4">
              <BlogImage
                src={post.author.picture}
                alt={post.author.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-zinc-700"
                fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=6366f1&color=fff&size=128`}
              />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{post.author.name}</h3>
                <p className="text-zinc-400 text-sm">
                  Expert NewsFlow
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-2xl border border-zinc-800 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm text-center">
            <h3 className="text-2xl font-bold mb-3 text-white">
              Prêt à transformer votre veille ?
            </h3>
            <p className="text-zinc-400 mb-6">
              Essayez NewsFlow gratuitement et découvrez comment l'IA peut révolutionner votre analyse financière.
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 hover:shadow-lg hover:shadow-purple-500/50 transition-all rounded-full"
            >
              <Link href="/signup">Commencer gratuitement</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
