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

/**
 * Envoie un Flow par email à l'utilisateur connecté
 * @param flowId - L'ID du Flow à envoyer
 * @param targetEmail - (Optionnel) Email de destination. Si non fourni, utilise l'email de l'utilisateur
 */
export async function sendFlowEmail(
  flowId: string,
  targetEmail?: string
): Promise<SendFlowEmailResult> {
  console.log("============================================")
  console.log("[SendEmail] 📧 SENDING FLOW EMAIL - START")
  console.log("[SendEmail] Flow ID:", flowId)
  console.log("[SendEmail] Target Email:", targetEmail || "User's email")
  console.log("============================================")

  try {
    // 🔐 Vérifier l'authentification
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[SendEmail] ❌ Authentication failed:", authError?.message)
      return {
        success: false,
        message: "Non authentifié. Veuillez vous connecter.",
      }
    }

    console.log("[SendEmail] ✅ User authenticated:", user.id)
    console.log("[SendEmail] User email from auth:", user.email)

    // 📄 Récupérer le profil utilisateur pour le nom
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()

    const userName = profile?.full_name || "Cher utilisateur"
    console.log("[SendEmail] User name:", userName)

    // Déterminer l'email de destination
    const recipientEmail = targetEmail || user.email
    if (!recipientEmail) {
      console.log("[SendEmail] ❌ No email address found")
      return {
        success: false,
        message: "Aucune adresse email trouvée.",
      }
    }

    console.log("[SendEmail] 📬 Recipient email:", recipientEmail)

    // 📊 Récupérer les données du Flow
    const { data: flow, error: flowError } = await supabase
      .from("recaps")
      .select("id, summary, body, source_json, created_at, key_events, topics_covered")
      .eq("id", flowId)
      .eq("user_id", user.id) // 🔒 Sécurité : vérifier que le Flow appartient à l'utilisateur
      .single()

    if (flowError || !flow) {
      console.log("[SendEmail] ❌ Flow not found or access denied:", flowError?.message)
      return {
        success: false,
        message: "Flow introuvable ou vous n'avez pas accès à ce Flow.",
      }
    }

    console.log("[SendEmail] ✅ Flow found:", flow.summary)

    // 🎨 Parser source_json pour extraire sections et sources
    let sections: Array<{ title: string; content: string }> = []
    let sources: Array<{ name: string; type?: string }> = []

    try {
      if (flow.source_json) {
        const parsed = typeof flow.source_json === "string" 
          ? JSON.parse(flow.source_json) 
          : flow.source_json
        sections = parsed.sections || []
        sources = parsed.sources || []
        console.log("[SendEmail] ✅ Parsed sections:", sections.length)
        console.log("[SendEmail] ✅ Parsed sources:", sources.length)
      }
    } catch (e) {
      console.warn("[SendEmail] ⚠️ Failed to parse source_json:", e)
      // Fallback : utiliser le body comme contenu unique
      sections = [{ title: "Contenu", content: flow.body || "" }]
    }

    // 📧 Vérifier la configuration Resend
    if (!process.env.RESEND_API_KEY) {
      console.log("[SendEmail] ❌ RESEND_API_KEY not configured")
      return {
        success: false,
        message: "Service email non configuré. Ajoutez RESEND_API_KEY dans .env.local",
      }
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "NewsFlow <onboarding@resend.dev>"
    console.log("[SendEmail] From:", fromEmail)

    // 🚀 Envoyer l'email via Resend
    console.log("[SendEmail] 🚀 Sending email via Resend...")

    const flowDate = new Date(flow.created_at).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      subject: `📰 Votre briefing : ${flow.summary || "Votre Flow du jour"}`,
      react: FlowEmail({
        userName,
        flowSummary: flow.summary || "Flow sans titre",
        flowDate,
        sections,
        sources,
        topicsCovered: flow.topics_covered,
      }),
    })

    if (error) {
      console.error("[SendEmail] ❌ Resend error:", error)
      return {
        success: false,
        message: `Erreur d'envoi : ${error.message}`,
      }
    }

    console.log("[SendEmail] ✅ Email sent successfully!")
    console.log("[SendEmail] Email ID:", data?.id)

    // ✅ Marquer le Flow comme envoyé par email
    await supabase
      .from("recaps")
      .update({ email_sent: true })
      .eq("id", flowId)

    console.log("============================================")
    console.log("[SendEmail] ✅ SUCCESS!")
    console.log("[SendEmail] Sent to:", recipientEmail)
    console.log("[SendEmail] Email ID:", data?.id)
    console.log("============================================")

    return {
      success: true,
      message: `Email envoyé avec succès à ${recipientEmail} !`,
      emailId: data?.id,
    }
  } catch (error) {
    console.error("============================================")
    console.error("[SendEmail] ❌ UNEXPECTED ERROR:")
    console.error(error)
    console.error("============================================")
    return {
      success: false,
      message: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi.",
    }
  }
}

/**
 * Envoie un Flow par email à plusieurs destinataires
 */
export async function sendFlowToMultipleEmails(
  flowId: string,
  emails: string[]
): Promise<SendFlowEmailResult> {
  console.log("[SendEmail] Sending to multiple recipients:", emails)
  
  const results: { email: string; success: boolean }[] = []
  
  for (const email of emails) {
    const result = await sendFlowEmail(flowId, email)
    results.push({ email, success: result.success })
  }
  
  const successCount = results.filter(r => r.success).length
  
  if (successCount === emails.length) {
    return {
      success: true,
      message: `Email envoyé avec succès à ${successCount} destinataire(s).`,
    }
  } else if (successCount > 0) {
    return {
      success: true,
      message: `Email envoyé à ${successCount}/${emails.length} destinataire(s).`,
    }
  } else {
    return {
      success: false,
      message: "Échec de l'envoi à tous les destinataires.",
    }
  }
}
