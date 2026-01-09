import { createClient } from "@/lib/supabase/server"

export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
  if (error) throw error
  return data
}

export async function checkAndDeductCredits(userId: string, cost: number): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("profiles").select("credits, plan_type").eq("id", userId).single()
  if (error) {
    console.warn("[DB] ⚠️ Failed to fetch credits, fail-open:", error)
    return true // fail-open to avoid blocage dur
  }

  // Si pas de champ credits, on considère illimité (plans payants éventuels)
  if (data?.credits === undefined || data?.credits === null) return true

  const current = Number(data.credits) || 0
  if (current < cost) return false

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ credits: current - cost })
    .eq("id", userId)

  if (updateError) {
    console.error("[DB] ❌ Failed to deduct credits:", updateError)
    return false
  }

  return true
}

export async function saveGeneratedFlow(userId: string, flowData: any) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("recaps")
    .insert({
      user_id: userId,
      type: "on_demand",
      channels: ["app"],
      complexity_level: flowData.complexity_level || "standard",
      summary: flowData.summary?.slice(0, 250) || "Résumé",
      body: flowData.body || "",
      key_events: flowData.key_events || "",
      topics_covered: flowData.topics_covered || "",
      source_json: flowData.source_json || {},
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getUserTopics(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("custom_topics")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("position", { ascending: true })

  if (error) throw error
  return data || []
}



