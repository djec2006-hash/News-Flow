"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, CheckCircle2 } from "lucide-react"
import Navbar from "@/components/layout/navbar"
import { sendContactEmail } from "@/app/actions/contact"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState<"support" | "commercial" | "autre">("support")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const result = await sendContactEmail({
        firstName,
        email,
        subject,
        message,
      })

      if (result.success) {
        setSuccess(true)
        toast({
          title: "Message envoyé !",
          description: result.message,
        })
        // Vider le formulaire
        setFirstName("")
        setEmail("")
        setSubject("support")
        setMessage("")
        // Réinitialiser le succès après 5 secondes
        setTimeout(() => setSuccess(false), 5000)
      } else {
        toast({
          title: "Erreur",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Contactez l'équipe NewsFlow
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Une question, un partenariat ou un bug ? Nous sommes à votre écoute.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">Formulaire de contact</CardTitle>
                  <CardDescription className="text-zinc-400">
                    Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-4"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message reçu 🚀</h3>
                  <p className="text-zinc-300">
                    Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Prénom */}
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">
                        Prénom <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-indigo-500/50"
                        placeholder="Votre prénom"
                        disabled={loading}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-indigo-500/50"
                        placeholder="votre@email.com"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Sujet */}
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-white">
                      Sujet <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={subject}
                      onValueChange={(value) => setSubject(value as "support" | "commercial" | "autre")}
                      disabled={loading}
                    >
                      <SelectTrigger className="bg-zinc-900/50 border-white/10 text-white focus:border-indigo-500/50">
                        <SelectValue placeholder="Sélectionnez un sujet" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white">
                      Message <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      required
                      minLength={50}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-zinc-900/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-indigo-500/50 min-h-[150px] resize-none"
                      placeholder="Votre message (minimum 50 caractères)..."
                      disabled={loading}
                    />
                    <p className="text-xs text-zinc-500">
                      {message.length}/50 caractères minimum
                    </p>
                  </div>

                  {/* Bouton submit */}
                  <Button
                    type="submit"
                    disabled={loading || message.length < 50}
                    size="lg"
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-5 w-5" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}






