"use client"

import { ExternalLink } from "lucide-react"

type Source = {
  name?: string
  title?: string
  url?: string
  note?: string
}

type SourcesListProps = {
  sources?: Source[] | any[]
}

export default function SourcesList({ sources }: SourcesListProps) {
  if (!sources || !Array.isArray(sources) || sources.length === 0) {
    return null
  }

  // Filtrer les sources valides (qui ont au moins un nom ou un titre)
  const validSources = sources.filter((source) => source?.name || source?.title)

  if (validSources.length === 0) {
    return null
  }

  return (
    <div className="border-t border-white/5 mt-12 pt-6">
      <h4 className="text-xs font-medium text-zinc-600 uppercase tracking-widest mb-4">
        Sources utilisées
      </h4>
      
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {validSources.map((source, index) => {
          const displayName = source.name || source.title || `Source ${index + 1}`
          const hasUrl = source.url && typeof source.url === "string"

          return (
            <div key={index} className="flex items-center gap-1.5">
              {hasUrl ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors hover:underline inline-flex items-center gap-1.5"
                >
                  <span>{displayName}</span>
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
              ) : (
                <span className="text-sm text-zinc-500 inline-flex items-center gap-1.5">
                  {displayName}
                  {source.note && (
                    <span className="text-xs text-zinc-600">({source.note})</span>
                  )}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}












