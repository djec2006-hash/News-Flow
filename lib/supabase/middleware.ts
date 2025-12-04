import { checkOnboardingStatus } from "@/lib/auth/check-onboarding-status"
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] MODE PREVIEW - Supabase non configuré, auth désactivée")
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
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname
    const protectedRoutes = ["/dashboard", "/onboarding", "/projects", "/settings", "/history"]
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      console.log(`[v0] Redirection non-authentifié : ${path} → /login`)
      return NextResponse.redirect(url)
    }

    if (!user) {
      return supabaseResponse
    }

    const { completed } = await checkOnboardingStatus(supabase, user.id)

    if (!completed && isProtectedRoute && !path.startsWith("/onboarding")) {
      const url = request.nextUrl.clone()
      url.pathname = "/onboarding"
      console.log(`[v0] Redirection onboarding requis : ${path} → /onboarding`)
      return NextResponse.redirect(url)
    }

    if (completed && path.startsWith("/onboarding")) {
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      console.log(`[v0] Redirection onboarding terminé : ${path} → /dashboard`)
      return NextResponse.redirect(url)
    }

    if (path === "/login" || path === "/signup") {
      const url = request.nextUrl.clone()
      url.pathname = completed ? "/dashboard" : "/onboarding"
      console.log(`[v0] Redirection utilisateur authentifié : ${path} → ${url.pathname}`)
      return NextResponse.redirect(url)
    }
  } catch (error) {
    console.error("[v0] Erreur middleware Supabase:", error)
  }

  return supabaseResponse
}
