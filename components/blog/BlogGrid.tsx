"use client"

import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import { BlogPost } from "@/lib/blog-data"

interface BlogGridProps {
  posts: BlogPost[]
}

export function BlogGrid({ posts }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="group"
        >
          <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-lg hover:scale-[1.02] transition-all duration-300 hover:border-zinc-700 hover:shadow-xl hover:shadow-indigo-500/10 h-full flex flex-col">
            {/* Image */}
            <div className="h-48 w-full overflow-hidden bg-zinc-800">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  // Fallback si l'image ne charge pas
                  const target = e.target as HTMLImageElement
                  target.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop"
                }}
              />
              {/* Overlay gradient subtil */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent" />
            </div>

            {/* Contenu */}
            <div className="p-6 flex-1 flex flex-col">
              {/* Badge catégorie */}
              <div className="mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {post.category}
                </span>
              </div>

              {/* Titre */}
              <h2 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors line-clamp-2">
                {post.title}
              </h2>

              {/* Extrait */}
              <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                {post.excerpt}
              </p>

              {/* Pied de carte */}
              <div className="flex items-center gap-4 text-xs text-zinc-500 pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {new Date(post.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}








