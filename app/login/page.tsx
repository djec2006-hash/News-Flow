"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import Logo from "@/components/ui/logo"

const Particles = dynamic(() => import("@/components/ui/particles"), { ssr: false })
const NewsGlobe = dynamic(() => import("@/components/3d/NewsGlobe"), { ssr: false })
const Scene3DWrapper = dynamic(() => import("@/components/3d/Scene3DWrapper"), { ssr: false })

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const supabaseEnabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!supabaseEnabled) {
      setError(
        "⚠️ Mode preview v0 : L'authentification n'est pas disponible. Déployez sur Vercel pour tester la connexion réelle.",
      )
      return
    }

    setLoading(true)

    try {
      console.log("[v0] Login: starting authentication")

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error("[v0] Login: auth error:", authError)
        setError(authError.message)
        setLoading(false)
        return
      }

      if (authData.user) {
        console.log("[v0] Login: user authenticated, checking profile")

        const { data: profile } = await supabase.from("profiles").select("*").eq("id", authData.user.id).single()

        if (!profile || !profile.full_name || !profile.age) {
          router.push("/onboarding")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (err: any) {
      console.error("[v0] Login: unexpected error:", err)
      setError(err.message || "Une erreur est survenue lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-black overflow-hidden">
      {/* ========== COLONNE GAUCHE : VISUEL (Caché sur mobile) ========== */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-950">
        {/* Logo en haut à gauche */}
        <Link href="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-white hover:text-zinc-300 transition-colors">
          <Logo className="h-8 w-8" />
          <span className="text-xl font-semibold">NewsFlow</span>
        </Link>

        {/* Animation 3D : Globe */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <div className="w-full h-full max-w-3xl">
            <Scene3DWrapper cameraPosition={[0, 0, 6]}>
              <NewsGlobe />
            </Scene3DWrapper>
          </div>
        </div>

        {/* Particules en arrière-plan */}
        <div className="absolute inset-0 pointer-events-none">
          <Particles />
        </div>

        {/* Citation client (bas gauche) */}
        <div className="absolute bottom-12 left-8 right-8 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-3"
          >
            <p className="text-2xl md:text-3xl font-light text-white leading-relaxed">
              L&apos;information <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text font-medium">avant le marché</span>.
            </p>
            <p className="text-sm text-zinc-400 font-mono">— Sarah K., Hedge Fund Manager</p>
          </motion.div>
        </div>
      </div>

      {/* ========== COLONNE DROITE : FORMULAIRE ========== */}
      <div className="w-full lg:w-1/2 relative bg-black flex items-center justify-center p-6 lg:p-12">
        {/* Particules sur mobile uniquement */}
        <div className="lg:hidden absolute inset-0 pointer-events-none opacity-30">
          <Particles />
        </div>

        {/* Logo mobile (centré en haut) */}
        <Link href="/" className="lg:hidden absolute top-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-white">
          <Logo className="h-8 w-8" />
          <span className="text-xl font-semibold">NewsFlow</span>
        </Link>

        {/* Conteneur du formulaire */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md mt-16 lg:mt-0"
        >
          {/* Titre */}
          <div className="mb-10 space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-white">Bienvenue</h1>
            <p className="text-zinc-400 text-lg">Connectez-vous pour accéder à votre flux personnalisé.</p>
          </div>

          {/* Alerte Preview Mode */}
          {!supabaseEnabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 flex items-start gap-3 rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 backdrop-blur-sm"
            >
              <AlertCircle className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
              <div className="text-sm text-orange-300/90">
                <p className="font-medium mb-1">Mode Démo</p>
                <p className="text-orange-400/70">L&apos;authentification est désactivée. Déployez sur Vercel pour activer la connexion.</p>
              </div>
            </motion.div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || !supabaseEnabled}
                className="w-full bg-transparent border-0 border-b-2 border-zinc-700 text-white text-lg px-0 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                  Mot de passe
                </label>
                <Link href="/reset-password" className="text-sm text-zinc-500 hover:text-indigo-400 transition-colors">
                  Oublié ?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !supabaseEnabled}
                className="w-full bg-transparent border-0 border-b-2 border-zinc-700 text-white text-lg px-0 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-pink-500 focus:ring-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Message d'erreur */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading || !supabaseEnabled}
              className="group relative w-full py-4 rounded-xl font-semibold text-white text-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {/* Gradient de fond */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
              
              {/* Glow effect au survol */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              
              {/* Contenu */}
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
              </span>
            </button>

            {/* Lien inscription */}
            <div className="text-center pt-4">
              <p className="text-zinc-500">
                Pas encore de compte ?{" "}
                <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Créer un compte
                </Link>
              </p>
            </div>

            {/* Bouton démo (mode preview) */}
            {!supabaseEnabled && (
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 transition-all"
              >
                Voir le dashboard (Mode Démo)
              </button>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  )
}
