// lib/supabase/admin.ts
import "server-only"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Client Supabase avec Service Role Key pour les opérations admin
 * ⚠️ À utiliser UNIQUEMENT dans les routes API sécurisées (webhooks, etc.)
 * NE JAMAIS exposer ce client au client-side
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing Supabase admin credentials. SUPABASE_SERVICE_ROLE_KEY must be set in environment variables."
    )
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}













