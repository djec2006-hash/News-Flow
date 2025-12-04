// lib/supabase/server.ts
import "server-only"

import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // ✅ nouvelle API attendue par @supabase/ssr
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Appelé depuis un Server Component (sans accès en écriture aux cookies) :
            // on peut ignorer, la middleware se chargera de rafraîchir la session.
          }
        },
      },
    },
  )
}
