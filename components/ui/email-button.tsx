"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Loader2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { sendFlowEmail } from "@/app/actions/send-email"
import { motion, AnimatePresence } from "framer-motion"

interface EmailButtonProps {
  flowId: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function EmailButton({ flowId, variant = "outline", size = "sm", className = "" }: EmailButtonProps) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const handleSendEmail = async () => {
    setSending(true)

    // Toast de chargement
    toast({
      title: "📧 Envoi en cours...",
      description: "Préparation de votre Flow",
    })

    try {
      const result = await sendFlowEmail(flowId)

      if (result.success) {
        setSent(true)
        toast({
          title: "✅ Email envoyé !",
          description: "Votre Flow a été envoyé à votre adresse email.",
        })

        // Reset l'état "sent" après 3 secondes
        setTimeout(() => setSent(false), 3000)
      } else {
        toast({
          title: "❌ Erreur",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "❌ Erreur",
        description: "Une erreur inattendue est survenue.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <Button
      onClick={handleSendEmail}
      disabled={sending || sent}
      variant={variant}
      size={size}
      className={className}
    >
      <AnimatePresence mode="wait">
        {sending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="hidden sm:inline">Envoi...</span>
          </motion.div>
        ) : sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4 text-green-500" />
            <span className="hidden sm:inline text-green-500">Envoyé</span>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Envoyer par email</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}

