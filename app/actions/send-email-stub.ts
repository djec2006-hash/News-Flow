// Stub temporaire pour éviter les erreurs de build
// Supprimer ce fichier après installation de 'resend' et '@react-email/components'

export interface SendFlowEmailResult {
  success: boolean
  message: string
  emailId?: string
}

export async function sendFlowEmail(flowId: string): Promise<SendFlowEmailResult> {
  return {
    success: false,
    message: "Service email non configuré. Veuillez installer les packages requis (voir SETUP_EMAIL.md)",
  }
}







