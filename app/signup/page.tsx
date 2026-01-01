"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import Logo from "@/components/ui/logo"
import { getURL } from "@/lib/utils"

const Particles = dynamic(() => import("@/components/ui/particles"), { ssr: false })
const NewsGlobe = dynamic(() => import("@/components/3d/NewsGlobe"), { ssr: false })
const Scene3DWrapper = dynamic(() => import("@/components/3d/Scene3DWrapper"), { ssr: false })

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const supabaseEnabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const handleGoogleSignup = async () => {
    if (!supabaseEnabled) {
      setError(
        "⚠️ Mode preview v0 : L'authentification n'est pas disponible. Déployez sur Vercel pour tester la connexion réelle.",
      )
      return
    }

    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${getURL()}/auth/callback`,
        },
      })

      if (error) {
        console.error("[v0] Google Signup: auth error:", error)
        setError(error.message)
        setLoading(false)
      }
    } catch (err: any) {
      console.error("[v0] Google Signup: unexpected error:", err)
      setError(err.message || "Une erreur est survenue lors de l'inscription avec Google")
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!supabaseEnabled) {
      setError(
        "⚠️ Mode preview v0 : L'inscription n'est pas disponible. Déployez sur Vercel pour tester l'inscription réelle.",
      )
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return
    }

    setLoading(true)

    try {
      console.log("[v0] Signup: starting registration")

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/onboarding`,
        },
      })

      if (authError) {
        console.error("[v0] Signup: auth error:", authError)
        setError(authError.message)
        setLoading(false)
        return
      }

      if (authData.user) {
        console.log("[v0] Signup: user created, creating profile")

        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
        })

        if (profileError && profileError.code !== "23505") {
          console.error("[v0] Signup: profile creation error:", profileError)
        }

        router.push("/onboarding")
      }
    } catch (err: any) {
      console.error("[v0] Signup: unexpected error:", err)
      setError(err.message || "Une erreur est survenue lors de l'inscription")
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
              Rejoignez les <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text font-medium">décideurs</span> qui ne ratent rien.
            </p>
            <p className="text-sm text-zinc-400 font-mono">— +2,400 professionnels nous font confiance</p>
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
            <h1 className="text-4xl md:text-5xl font-bold text-white">Créez votre compte</h1>
            <p className="text-zinc-400 text-lg">Commencez à recevoir vos actualités personnalisées en quelques secondes.</p>
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
                <p className="text-orange-400/70">L&apos;inscription est désactivée. Déployez sur Vercel pour activer l&apos;inscription.</p>
              </div>
            </motion.div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Bouton Google */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading || !supabaseEnabled}
              className="group relative w-full py-4 px-4 rounded-xl border border-purple-500/30 bg-black/40 backdrop-blur-sm hover:border-purple-500/60 text-white font-medium text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              {/* Glow effect au survol - effet néon */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
              
              {/* Contenu */}
              <span className="relative z-10 flex items-center justify-center gap-3">
                {/* Logo Google SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-zinc-100 group-hover:text-white transition-colors">S'inscrire avec Google</span>
              </span>
            </button>

            {/* Séparateur */}
            <div className="relative flex items-center py-4">
              <div className="flex-1 border-t border-zinc-700"></div>
              <span className="px-4 text-sm text-zinc-500 uppercase tracking-wider">ou</span>
              <div className="flex-1 border-t border-zinc-700"></div>
            </div>

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
              <label htmlFor="password" className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || !supabaseEnabled}
                minLength={6}
                className="w-full bg-transparent border-0 border-b-2 border-zinc-700 text-white text-lg px-0 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 focus:ring-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading || !supabaseEnabled}
                minLength={6}
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

            {/* Bouton d'inscription */}
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
                    Création en cours...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </span>
            </button>

            {/* Lien connexion */}
            <div className="text-center pt-4">
              <p className="text-zinc-500">
                Vous avez déjà un compte ?{" "}
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Se connecter
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
