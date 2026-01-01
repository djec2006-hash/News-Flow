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
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        // Rediriger vers onboarding si le profil n'est pas complet
        if (!profile || !profile.full_name || !profile.age) {
          return NextResponse.redirect(new URL("/onboarding", request.url))
        }
      }

      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // En cas d'erreur, rediriger vers la page de login
  return NextResponse.redirect(new URL("/login", request.url))
}


