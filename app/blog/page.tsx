import { BLOG_POSTS } from "@/lib/blog-data"
import Navbar from "@/components/layout/navbar"
import { BlogGrid } from "@/components/blog/BlogGrid"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background gradient subtle */}
        <div className="fixed inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-indigo-950/20 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Le Journal NewsFlow
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto">
              Analyses de marché, tendances tech et stratégies d'investissement.
            </p>
          </div>

          {/* Grille d'articles */}
          <BlogGrid posts={BLOG_POSTS} />
        </div>
      </main>
    </div>
  )
}
