"use server"

import { Resend } from "resend"

// 🌐 Client Resend
const resend = new Resend(process.env.RESEND_API_KEY || "")

export interface ContactFormData {
  firstName: string
  email: string
  subject: "support" | "commercial" | "autre"
  message: string
}

export interface ContactResult {
  success: boolean
  message: string
}

export async function sendContactEmail(formData: ContactFormData): Promise<ContactResult> {
  try {
    // Validation basique
    if (!formData.firstName || !formData.email || !formData.message) {
      return {
        success: false,
        message: "Tous les champs sont requis.",
      }
    }

    if (formData.message.length < 50) {
      return {
        success: false,
        message: "Le message doit contenir au moins 50 caractères.",
      }
    }

    // Vérifier la configuration Resend
    if (!process.env.RESEND_API_KEY) {
      console.warn("[Contact] RESEND_API_KEY not configured")
      return {
        success: false,
        message: "Service email non configuré. Veuillez contacter l'administrateur.",
      }
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "NewsFlow <onboarding@resend.dev>"
    const adminEmail = process.env.RESEND_ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || "admin@newsflow.com"

    // Mapping des sujets
    const subjectLabels: Record<string, string> = {
      support: "Support",
      commercial: "Commercial",
      autre: "Autre",
    }

    const subjectLabel = subjectLabels[formData.subject] || "Autre"

    // Construire le contenu de l'email
    const emailContent = `
Nouveau message de contact NewsFlow

De : ${formData.firstName} (${formData.email})
Sujet : ${subjectLabel}

Message :
${formData.message}

---
Envoyé depuis le formulaire de contact NewsFlow
`

    // Envoyer l'email
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      replyTo: formData.email,
      subject: `[NewsFlow Contact] ${subjectLabel} - ${formData.firstName}`,
      text: emailContent,
    })

    if (error) {
      console.error("[Contact] Resend error:", error)
      return {
        success: false,
        message: `Erreur d'envoi : ${error.message}`,
      }
    }

    console.log("[Contact] ✅ Email sent successfully! ID:", data?.id)

    return {
      success: true,
      message: "Message reçu 🚀 Nous vous répondrons dans les plus brefs délais.",
    }
  } catch (error) {
    console.error("[Contact] Unexpected error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Une erreur est survenue lors de l'envoi.",
    }
  }
}


