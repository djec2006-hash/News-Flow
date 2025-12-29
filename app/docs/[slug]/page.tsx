// ANCIEN CODE: import { notFound } from "next/navigation" - SUPPRIMÉ pour forcer l'affichage "Coming Soon"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PenTool, ArrowLeft } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { getDocBySlug, getAllDocSlugs } from "@/lib/docs-data"

// Génération statique des pages existantes (pour le SEO et la performance)
export async function generateStaticParams() {
  const slugs = getAllDocSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

// NOUVEAU CODE: Permet le rendu dynamique pour les slugs non listés (évite les 404)
// ANCIEN CODE: Sans cette ligne, Next.js retournait une 404 pour les slugs non pré-générés
export const dynamicParams = true

// Métadonnées pour le SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const doc = getDocBySlug(params.slug)
  
  if (!doc) {
    return {
      title: "Page en rédaction | NewsFlow Docs",
    }
  }

  return {
    title: `${doc.title} | NewsFlow Documentation`,
    description: `Documentation NewsFlow - ${doc.title}`,
  }
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const doc = getDocBySlug(params.slug)

  if (!doc) {
    return (
      <div className="prose prose-invert prose-lg max-w-none">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/docs" className="text-zinc-400 hover:text-white">
                Documentation
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">Page en rédaction</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Interface "En cours de rédaction" */}
        <div className="flex items-center justify-center min-h-[60vh] py-16">
          <div className="text-center max-w-2xl mx-auto space-y-6">
            {/* Badge "Work in Progress" */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              Work in Progress
            </div>

            {/* Icône */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl"></div>
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <PenTool className="h-8 w-8 text-indigo-400" />
                </div>
              </div>
            </div>

            {/* Titre */}
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Documentation en cours de rédaction
            </h1>

            {/* Sous-titre */}
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed mb-8">
              Nos experts techniques finalisent cette section <span className="text-indigo-400 font-mono text-sm">({params.slug})</span> pour vous offrir un guide complet. Revenez très vite !
            </p>

            {/* Bouton retour */}
            <Button
              asChild
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all"
            >
              <Link href="/docs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au sommaire
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="prose prose-invert prose-lg max-w-none">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs" className="text-zinc-400 hover:text-white">
              Documentation
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs" className="text-zinc-400 hover:text-white">
              {doc.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">{doc.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Titre */}
      <h1 className="text-4xl sm:text-5xl font-bold mb-8 !text-white">
        {doc.title}
      </h1>

      {/* Contenu HTML */}
      <div
        className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-zinc-300 prose-p:leading-relaxed prose-ul:text-zinc-300 prose-li:text-zinc-300 prose-ol:text-zinc-300 prose-strong:text-white prose-strong:font-semibold prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:text-indigo-300 prose-a:underline prose-lead:text-zinc-200 prose-lead:text-lg prose-lead:font-medium"
        dangerouslySetInnerHTML={{ __html: doc.content }}
      />
    </div>
  )
}

