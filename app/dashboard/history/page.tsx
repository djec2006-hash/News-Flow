"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PDFButton } from "@/components/ui/pdf-button"
import { EmailButton } from "@/components/ui/email-button"
import { Loader2, Calendar, Mail, FileText, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import SourcesList from "@/components/flow/SourcesList"
import { MarkdownRenderer } from "@/components/flow/MarkdownRenderer"

interface Recap {
  id: string
  user_id: string
  created_at: string
  type: string
  channels: string[] | null
  complexity_level: string
  summary: string
  body: string
  key_events: string | null
  topics_covered: string | null
  source_json: string | null
  email_sent: boolean
  email_sent_at: string | null
}

export default function HistoryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [recaps, setRecaps] = useState<Recap[]>([])
  const [selectedRecap, setSelectedRecap] = useState<Recap | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadRecaps()
  }, [])

  const loadRecaps = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from("recaps")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setRecaps(data || [])
    } catch (err: any) {
      console.error(err)
      setError("Erreur lors du chargement de l'historique")
    } finally {
      setLoading(false)
    }
  }

  const openRecapDialog = (recap: Recap) => {
    setSelectedRecap(recap)
    setDialogOpen(true)
  }

  const renderFlowBody = (recap: Recap) => {
    if (!recap.body) return null

    try {
      // Si on a le JSON brut, on l'utilise pour structurer l'affichage
      const parsed = recap.source_json ? JSON.parse(recap.source_json) : null

      if (!parsed?.sections || !Array.isArray(parsed.sections)) {
        // Fallback : ancien comportement si jamais pas de sections
        return (
          <div className="text-zinc-100 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-normal">
            {recap.body}
          </div>
        )
      }

      return (
        <div className="space-y-8">
          {/* 🖼️ Image principale - Style Presse Premium */}
          {parsed.main_image_url && (
            <div className="relative w-full mb-12">
              {/* Glow effect - Copie floue en arrière-plan */}
              <div className="absolute inset-0 -z-10">
                <img
                  src={parsed.main_image_url}
                  alt="Background glow"
                  className="w-full h-64 object-cover rounded-xl blur-3xl opacity-20"
                />
              </div>
              
              {/* Image principale */}
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                <img
                  src={parsed.main_image_url}
                  alt={parsed.summary || "Illustration du Flow"}
                  className="w-full h-64 object-cover"
                />
                {/* Gradient overlay subtil pour meilleure lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
              </div>
            </div>
          )}

          {parsed.sections.map((section: any, idx: number) => {
            return (
              <section key={idx} className="space-y-4">
                {/* Titre de section : style High Contrast avec soulignement */}
                <h3 className="text-3xl font-bold text-white mt-8 mb-4 underline decoration-indigo-500 decoration-2 underline-offset-8">
                  {section.title}
                </h3>
                <div className="space-y-3">
                  <MarkdownRenderer content={section.content || ""} />
                </div>
              </section>
            )
          })}
          
          {/* Sources utilisées */}
          <SourcesList sources={parsed.sources} />
        </div>
      )
    } catch (e) {
      console.error("[v0] Failed to parse source_json in history:", e)
      // Fallback si jamais le JSON est cassé
        return (
          <div className="text-zinc-100 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-normal">
            {recap.body}
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // 🎬 Animation variants pour la cascade
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Délai entre chaque carte
      },
    },
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 text-white">Historique</h1>
        <p className="text-zinc-400">Vos Flows passés, toujours à portée de main</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-4 rounded-xl"
        >
          {error}
        </motion.div>
      )}

      {recaps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl p-12 text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <FileText className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Aucun Flow pour le moment</h3>
            <p className="text-zinc-400 max-w-md mx-auto">
              Vos Flows générés apparaîtront ici. Créez votre premier Flow depuis le dashboard.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {recaps.map((recap, index) => (
            <motion.div
              key={recap.id}
              variants={cardVariants}
              whileHover={{ 
                y: -4,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
              className="group"
            >
              <div
                onClick={() => openRecapDialog(recap)}
                className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/40 backdrop-blur-xl p-6 cursor-pointer transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                {/* Effet de brillance au hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    {/* Date - Le Repère */}
                    <div className="flex items-center gap-3 mb-3">
                      <time className="text-xl md:text-2xl font-bold font-mono text-indigo-400">
                        {new Date(recap.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </time>
                      <span className="text-xs font-mono text-zinc-600">
                        {new Date(recap.created_at).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {recap.email_sent && (
                        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                          <Mail className="h-3 w-3" />
                          Envoyé
                        </div>
                      )}
                    </div>

                    {/* Titre */}
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                      {recap.summary || "Flow sans titre"}
                    </h3>

                    {/* Résumé */}
                    {recap.body && (
                      <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                        {recap.body}
                      </p>
                    )}
                  </div>

                  {/* Actions à droite */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <EmailButton
                      flowId={recap.id}
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <PDFButton
                      flowData={{
                        id: recap.id,
                        summary: recap.summary,
                        created_at: recap.created_at,
                        body: recap.body,
                        source_json: recap.source_json,
                        key_events: recap.key_events,
                        topics_covered: recap.topics_covered,
                      }}
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-white/10">
          {selectedRecap && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Date en grand */}
                    <time className="text-sm font-mono text-indigo-400 mb-2 block">
                      {new Date(selectedRecap.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                    <DialogTitle className="text-3xl text-white font-bold mb-2">
                      {selectedRecap.summary || "Recap"}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 flex-wrap">
                      {selectedRecap.email_sent && (
                        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                          <Mail className="h-3 w-3" />
                          Envoyé par email
                        </div>
                      )}
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <EmailButton
                      flowId={selectedRecap.id}
                      variant="outline"
                      size="sm"
                      className="border-white/10 hover:border-indigo-500/50"
                    />
                    <PDFButton
                      flowData={{
                        id: selectedRecap.id,
                        summary: selectedRecap.summary,
                        created_at: selectedRecap.created_at,
                        body: selectedRecap.body,
                        source_json: selectedRecap.source_json,
                        key_events: selectedRecap.key_events,
                        topics_covered: selectedRecap.topics_covered,
                      }}
                      variant="outline"
                      className="border-white/10 hover:border-indigo-500/50"
                    />
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-6 mt-4 max-w-3xl mx-auto">
                {selectedRecap.body && (
                  <div>
                    {renderFlowBody(selectedRecap)}
                  </div>
                )}
                {selectedRecap.key_events && (
                  <div>
                    <h3 className="font-semibold mb-4 text-xl text-white">Événements clés</h3>
                    <div className="text-zinc-100 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-normal">
                      {selectedRecap.key_events}
                    </div>
                  </div>
                )}
                {selectedRecap.topics_covered && (
                  <div>
                    <h3 className="font-semibold mb-4 text-xl text-white">Sujets couverts</h3>
                    <p className="text-zinc-100 text-base md:text-lg leading-relaxed font-normal">
                      {selectedRecap.topics_covered}
                    </p>
                  </div>
                )}
                {selectedRecap.channels && selectedRecap.channels.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-white">Canaux</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedRecap.channels.map((channel: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedRecap.email_sent_at && (
                  <div className="text-xs text-zinc-500">
                    Email envoyé le{" "}
                    {new Date(selectedRecap.email_sent_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
