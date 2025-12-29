"use server"

import { createClient } from "@/lib/supabase/server"
import { BlogPost } from "@/lib/blog-data"
import { BLOG_POSTS } from "@/lib/blog-data"

// Interface pour les données Supabase (avec mapping)
interface SupabasePost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  category: string
  read_time: number
  image_url: string | null
  is_published: boolean
}

/**
 * Récupère tous les posts publiés depuis Supabase
 * Fallback vers les données statiques si Supabase n'est pas configuré
 */
export async function getPosts(): Promise<BlogPost[]> {
  try {
    const supabase = await createClient()
    
    // Vérifier si Supabase est configuré
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return BLOG_POSTS
    }

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error) {
      // Mode hors ligne / Table non trouvée - fallback silencieux
      console.warn("[blog-service] Mode hors ligne / Table non trouvée, utilisation des données statiques")
      return BLOG_POSTS
    }

    if (!data || data.length === 0) {
      return BLOG_POSTS
    }

    // Mapper les données Supabase vers l'interface BlogPost
    return data.map((post: SupabasePost) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      category: post.category,
      readTime: post.read_time,
      imageUrl: post.image_url || "/images/blog/default.jpg",
    }))
  } catch (error) {
    // Mode hors ligne / Table non trouvée - fallback silencieux
    console.warn("[blog-service] Mode hors ligne / Table non trouvée, utilisation des données statiques")
    return BLOG_POSTS
  }
}

/**
 * Récupère un post par son slug depuis Supabase
 * Fallback vers les données statiques si Supabase n'est pas configuré
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const supabase = await createClient()
    
    // Vérifier si Supabase est configuré
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseKey) {
      return BLOG_POSTS.find((post) => post.slug === slug)
    }

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (error) {
      // Mode hors ligne / Table non trouvée - fallback silencieux
      return BLOG_POSTS.find((post) => post.slug === slug)
    }

    if (!data) {
      // Fallback vers données statiques si pas trouvé
      return BLOG_POSTS.find((post) => post.slug === slug)
    }

    // Mapper les données Supabase vers l'interface BlogPost
    const post: SupabasePost = data
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      category: post.category,
      readTime: post.read_time,
      imageUrl: post.image_url || "/images/blog/default.jpg",
    }
  } catch (error) {
    // Mode hors ligne / Table non trouvée - fallback silencieux
    return BLOG_POSTS.find((post) => post.slug === slug)
  }
}

/**
 * Récupère tous les slugs pour la génération statique
 */
export async function getAllSlugs(): Promise<string[]> {
  try {
    const posts = await getPosts()
    return posts.map((post) => post.slug)
  } catch (error) {
    // Fallback vers données statiques
    return BLOG_POSTS.map((post) => post.slug)
  }
}

