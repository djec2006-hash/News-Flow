import { checkOnboardingStatus } from "@/lib/auth/check-onboarding-status"
import { ensureProfileExists } from "@/lib/supabase/ensure-profile"
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[Middleware] MODE PREVIEW - Supabase non configuré, auth désactivée")
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname
    const protectedRoutes = ["/dashboard", "/onboarding", "/projects", "/settings", "/history"]
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

    // Logs détaillés pour le diagnostic
    console.log(`[Middleware] Path: ${path}, User: ${user ? `exists (${user.id})` : "null"}, Error: ${userError ? userError.message : "none"}`)

    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      console.log(`[Middleware] ❌ Redirection non-authentifié : ${path} → /login`)
      return NextResponse.redirect(url)
    }

    if (!user) {
      return supabaseResponse
    }

    // ÉTAPE 1: Vérifier le statut d'onboarding avec logs détaillés
    console.log(`[Middleware] 🔍 Vérification onboarding pour user: ${user.id}`)
    const { completed, error: onboardingError } = await checkOnboardingStatus(supabase, user.id)
    
    console.log(`[Middleware] 📊 Résultat onboarding: completed=${completed}, error=${onboardingError || "none"}`)

    // ÉTAPE 2: Si erreur RLS ou profil manquant, tenter la création différée
    if (onboardingError === "NO_PROFILE" || (!completed && !onboardingError)) {
      console.log(`[Middleware] ⚠️ Profil manquant ou incomplet, tentative de création différée...`)
      
      // Tenter de créer le profil manquant
      const profileResult = await ensureProfileExists(supabase, user.id, user.email)
      
      console.log(`[Middleware] 🔧 Résultat création profil: success=${profileResult.success}, created=${profileResult.created}, error=${profileResult.error || "none"}`)
      
      // Si création réussie, revérifier l'onboarding
      if (profileResult.success && profileResult.created) {
        const { completed: completedAfterCreation } = await checkOnboardingStatus(supabase, user.id)
        console.log(`[Middleware] ✅ Profil créé, onboarding après création: ${completedAfterCreation}`)
        
        // Si le profil vient d'être créé, l'onboarding n'est pas terminé
        if (!completedAfterCreation && isProtectedRoute && !path.startsWith("/onboarding")) {
          const url = request.nextUrl.clone()
          url.pathname = "/onboarding"
          console.log(`[Middleware] ➡️ Redirection vers onboarding (profil créé) : ${path} → /onboarding`)
          return NextResponse.redirect(url)
        }
      }
      
      // Si erreur de création (RLS, etc.), on laisse passer pour éviter la boucle
      if (!profileResult.success) {
        console.warn(`[Middleware] ⚠️ Erreur création profil (${profileResult.error}), laisse passer pour éviter la boucle`)
        return supabaseResponse
      }
    }

    // ÉTAPE 3: Si erreur autre que NO_PROFILE (RLS, timeout, etc.), on laisse passer
    if (onboardingError && onboardingError !== "NO_PROFILE") {
      console.warn(`[Middleware] ⚠️ Erreur RLS/timeout (${onboardingError}), laisse passer pour éviter de bloquer l'utilisateur`)
      return supabaseResponse
    }

    // ÉTAPE 4: Rediriger vers onboarding UNIQUEMENT si onboarding non terminé ET route protégée
    if (!completed && isProtectedRoute && !path.startsWith("/onboarding")) {
      const url = request.nextUrl.clone()
      url.pathname = "/onboarding"
      console.log(`[Middleware] ➡️ Redirection onboarding requis : ${path} → /onboarding`)
      return NextResponse.redirect(url)
    }

    // ÉTAPE 5: Si onboarding terminé, rediriger depuis /onboarding vers /dashboard
    if (completed && path.startsWith("/onboarding")) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      console.log(`[Middleware] ➡️ Redirection onboarding terminé : ${path} → /dashboard`)
      return NextResponse.redirect(url)
    }

    // ÉTAPE 6: Redirection depuis login/signup
    if (path === "/login" || path === "/signup") {
      const url = request.nextUrl.clone()
      url.pathname = completed ? "/dashboard" : "/onboarding"
      console.log(`[Middleware] ➡️ Redirection utilisateur authentifié : ${path} → ${url.pathname}`)
      return NextResponse.redirect(url)
    }

    console.log(`[Middleware] ✅ Requête autorisée : ${path}`)
  } catch (error) {
    console.error("[Middleware] ❌ Erreur middleware Supabase:", error)
    // En cas d'erreur, on laisse passer pour éviter de bloquer l'utilisateur
  }

  return supabaseResponse
}
