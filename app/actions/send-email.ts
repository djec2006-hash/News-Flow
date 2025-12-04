"use server"

import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"
import FlowEmail from "@/components/emails/FlowEmail"

// 🌐 Client Resend
const resend = new Resend(process.env.RESEND_API_KEY || "")

export interface SendFlowEmailResult {
  success: boolean
  message: string
  emailId?: string
}

export async function sendFlowEmail(flowId: string): Promise<SendFlowEmailResult> {
  try {
    // 🔐 Vérifier l'authentification
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        success: false,
        message: "Non authentifié. Veuillez vous connecter.",
      }
    }

    // 📄 Récupérer le profil utilisateur (email)
    const { data: profile } = await supabase.from("profiles").select("email, full_name").eq("id", user.id).single()

    if (!profile?.email) {
      return {
        success: false,
        message: "Aucune adresse email trouvée dans votre profil.",
      }
    }

    // 📊 Récupérer les données du Flow
    const { data: flow, error: flowError } = await supabase
      .from("recaps")
      .select("id, summary, body, source_json, created_at, key_events, topics_covered")
      .eq("id", flowId)
      .eq("user_id", user.id) // 🔒 Sécurité : vérifier que le Flow appartient à l'utilisateur
      .single()

    if (flowError || !flow) {
      return {
        success: false,
        message: "Flow introuvable ou vous n'avez pas accès à ce Flow.",
      }
    }

    // 🎨 Parser source_json pour extraire sections et sources
    let sections: Array<{ title: string; content: string }> = []
    let sources: Array<{ name: string; type?: string }> = []

    try {
      if (flow.source_json) {
        const parsed = typeof flow.source_json === "string" ? JSON.parse(flow.source_json) : flow.source_json
        sections = parsed.sections || []
        sources = parsed.sources || []
      }
    } catch (e) {
      console.warn("[SendEmail] Failed to parse source_json:", e)
      // Fallback : utiliser le body comme contenu unique
      sections = [{ title: "Contenu", content: flow.body || "" }]
    }

    // 📧 Vérifier la configuration Resend
    if (!process.env.RESEND_API_KEY) {
      return {
        success: false,
        message: "Service email non configuré. Contactez l'administrateur.",
      }
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "NewsFlow <onboarding@resend.dev>"

    // 🚀 Envoyer l'email via Resend
    console.log(`[SendEmail] Sending Flow ${flowId} to ${profile.email}`)

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [profile.email],
      subject: `📰 NewsFlow : ${flow.summary || "Votre Flow du jour"}`,
      react: FlowEmail({
        userName: profile.full_name || "Cher utilisateur",
        flowSummary: flow.summary || "Flow sans titre",
        flowDate: new Date(flow.created_at).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        sections,
        sources,
        topicsCovered: flow.topics_covered,
      }),
    })

    if (error) {
      console.error("[SendEmail] Resend error:", error)
      return {
        success: false,
        message: `Erreur d'envoi : ${error.message}`,
      }
    }

    // ✅ Marquer le Flow comme envoyé par email (optionnel)
    await supabase.from("recaps").update({ email_sent: true }).eq("id", flowId)

    console.log(`[SendEmail] ✅ Email sent successfully. ID: ${data?.id}`)

    return {
      success: true,
      message: "Email envoyé avec succès !",
      emailId: data?.id,
    }
  } catch (error) {
    console.error("[SendEmail] Unexpected error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi.",
    }
  }
}



