import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Récupérer l'utilisateur pour vérifier le statut d'onboarding
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Vérifier le profil avec gestion d'erreur robuste
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, age, onboarding_completed")
          .eq("id", user.id)
          .maybeSingle()

        // Si erreur RLS ou timeout, NE PAS rediriger vers onboarding
        // L'utilisateur existant pourrait avoir un profil mais la requête a échoué
        if (profileError) {
          console.error("[Auth Callback] Erreur lors de la lecture du profil:", profileError)
          // En cas d'erreur, on laisse l'utilisateur aller au dashboard
          // Le middleware vérifiera à nouveau avec une meilleure gestion d'erreur
          return NextResponse.redirect(new URL(next, request.url))
        }

        // Rediriger vers onboarding UNIQUEMENT si :
        // 1. Le profil n'existe vraiment pas (première connexion)
        // 2. OU le profil existe mais full_name est vide (onboarding non terminé)
        // Note: age est optionnel, on ne l'utilise pas pour décider de la redirection
        const needsOnboarding = !profile || !profile.full_name || (profile.full_name.trim().length === 0)
        
        if (needsOnboarding) {
          console.log("[Auth Callback] Profil incomplet, redirection vers onboarding")
          return NextResponse.redirect(new URL("/onboarding", request.url))
        }
      }

      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // En cas d'erreur, rediriger vers la page de login
  return NextResponse.redirect(new URL("/login", request.url))
}




