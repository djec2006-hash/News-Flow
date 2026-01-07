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

  // Normalisation : accepter string[] ou objets
  const normalized = sources.map((s) => {
    if (typeof s === "string") {
      return { name: s, title: s, url: undefined, note: undefined }
    }
    return s
  })

  const validSources = normalized.filter((source) => source?.name || source?.title)

  if (validSources.length === 0) {
    return null
  }

  return (
    <div className="border-t border-white/5 mt-12 pt-4">
      <h4 className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-3">
        SOURCES :
      </h4>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
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
                  className="text-xs text-zinc-500 font-mono hover:text-zinc-300 transition-colors hover:underline inline-flex items-center gap-1.5"
                >
                  <span>{displayName}</span>
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
              ) : (
                <span className="text-xs text-zinc-500 font-mono inline-flex items-center gap-1.5">
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















