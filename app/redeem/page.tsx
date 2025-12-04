"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Key, Sparkles, ArrowRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { savePromoCode } from "@/app/actions/save-promo"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"

export default function RedeemPage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast({
        title: "⚠️ Code requis",
        description: "Veuillez entrer un code d'accès.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Sauvegarder le code et rediriger vers login
      // Le code sera appliqué automatiquement après connexion
      await savePromoCode(code)
    } catch (error) {
      setLoading(false)
      toast({
        title: "❌ Code invalide",
        description: error instanceof Error ? error.message : "Code invalide ou expiré",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      <Navbar />

      {/* Effets de lumière subtils */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Icon avec animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/50"
          >
            <Key className="h-10 w-10 text-white" />
          </motion.div>

          {/* Titre mystérieux */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-4 text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Accès Privilégié
            </h1>
            <p className="text-zinc-400">
              Entrez votre code secret pour débloquer des fonctionnalités exclusives
            </p>
          </motion.div>

          {/* Carte principale - Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-2xl"
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />

            {/* Formulaire */}
            <div className="space-y-6">
              {/* Input code - Style PIN */}
              <div className="space-y-3">
                <label htmlFor="code" className="block text-sm font-medium text-zinc-400 text-center">
                  Code d'accès
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock className="h-5 w-5 text-zinc-500" />
                  </div>
                  <Input
                    id="code"
                    type="text"
                    placeholder="XXXXX-XXXXX"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && !loading && handleRedeem()}
                    className="h-14 bg-zinc-800/50 border-white/10 text-center text-lg font-mono tracking-widest text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 pl-12"
                    disabled={loading}
                    autoComplete="off"
                    autoFocus
                  />
                </div>
              </div>

              {/* Bouton d'activation */}
              <Button
                onClick={handleRedeem}
                disabled={loading || !code.trim()}
                className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg shadow-indigo-500/50 transition-all"
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Vérification...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Activer l'accès
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              {/* Info */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-center text-xs text-zinc-500">
                  Les codes sont sensibles à la casse et à usage unique
                </p>
              </div>
            </div>
          </motion.div>

          {/* Lien retour */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <Link
              href="/pricing"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Vous n'avez pas de code ? Voir les tarifs
            </Link>
          </motion.div>

          {/* Exemples de codes (à retirer en production !) */}
          {process.env.NODE_ENV === "development" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6"
            >
              <h4 className="text-sm font-semibold text-amber-300 mb-3 flex items-center gap-2">
                🔧 Mode Développement - Codes de test
              </h4>
              <div className="space-y-2 text-xs text-zinc-400">
                <div className="flex items-center justify-between p-2 rounded bg-zinc-900/50">
                  <span>Plan Basic (15 jours):</span>
                  <code className="font-mono text-cyan-400">BASIC15</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-zinc-900/50">
                  <span>Plan Basic (30 jours):</span>
                  <code className="font-mono text-cyan-400">BASIC30</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-zinc-900/50">
                  <span>Plan Pro (30 jours):</span>
                  <code className="font-mono text-purple-400">PRO30</code>
                </div>
              </div>
              <p className="mt-3 text-xs text-amber-400">
                💡 Ces codes vous redirigeront vers login, puis s'activeront automatiquement
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

