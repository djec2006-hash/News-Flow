// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"

function createMockClient() {
  console.warn("[newsflow] Supabase (client) non configuré - utilisation d'un client mock (preview v0)")

  const mockQuery: any = {
    select: () => mockQuery,
    insert: () => mockQuery,
    update: () => mockQuery,
    delete: () => mockQuery,
    eq: () => mockQuery,
    gte: () => mockQuery,
    order: () => mockQuery,
    limit: () => mockQuery,
    single: async () => ({ data: null, error: null }),
  }

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: new Error("Supabase désactivé en mode preview v0"),
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: new Error("Supabase désactivé en mode preview v0"),
      }),
      signOut: async () => ({ error: null }),
    },
    from() {
      return mockQuery
    },
    rpc: async () => ({ data: null, error: null }),
  } as any
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // 👉 En preview v0, ces variables ne sont souvent pas définies → on renvoie le mock
  if (!url || !key) {
    return createMockClient()
  }

  // 👉 En prod / vrai env local : client réel
  return createBrowserClient(url, key)
}
