"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Loader2, AlertCircle, CheckCircle2, XCircle, Calendar, Sparkles } from "lucide-react"
import { getPlanConfig, type PlanType } from "@/lib/plans"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SubscriptionPanelProps {
  initialPlanType?: string | null
  initialStatus?: "active" | "cancelled" | "pending"
}

type SubscriptionStatus = "active" | "cancelled" | "pending"

export function SubscriptionPanel({ 
  initialPlanType = "free", 
  initialStatus = "active" 
}: SubscriptionPanelProps) {
  const { toast } = useToast()
  const [planType, setPlanType] = useState<PlanType>((initialPlanType as PlanType) || "free")
  const [status, setStatus] = useState<SubscriptionStatus>(initialStatus)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [nextPaymentDate, setNextPaymentDate] = useState<Date>(() => {
    // Simuler une date de prochain paiement (30 jours à partir d'aujourd'hui)
    const date = new Date()
    date.setDate(date.getDate() + 30)
    return date
  })
  const [cancellationDate, setCancellationDate] = useState<Date | null>(null)

  const planConfig = getPlanConfig(planType)

  // Formater la date en français
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Simuler l'upgrade vers Pro
  const handleUpgrade = async () => {
    setIsUpgrading(true)
    
    // Simulation d'un délai de paiement (2 secondes)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    setPlanType("pro")
    setStatus("active")
    
    // Mettre à jour la date de prochain paiement (30 jours)
    const newDate = new Date()
    newDate.setDate(newDate.getDate() + 30)
    setNextPaymentDate(newDate)
    setCancellationDate(null)
    
    setIsUpgrading(false)
    
    toast({
      title: "🎉 Paiement réussi !",
      description: "Bienvenue dans le club Pro. Votre abonnement est actif.",
      duration: 5000,
    })
  }

  // Simuler l'annulation
  const handleCancel = async () => {
    setIsCancelling(true)
    
    // Simulation d'un délai (1 seconde)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    setStatus("cancelled")
    
    // Calculer la date de fin (30 jours après aujourd'hui)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)
    setCancellationDate(endDate)
    
    setIsCancelling(false)
    setShowCancelDialog(false)
    
    toast({
      title: "Abonnement annulé",
      description: `Votre accès se terminera le ${formatDate(endDate)}.`,
      variant: "default",
      duration: 5000,
    })
  }

  // Obtenir le badge de statut
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Actif
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="h-3 w-3 mr-1" />
            Annulé
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Paiement en attente
          </Badge>
        )
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-8"
      >
        {/* Background gradient subtil */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-6">
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <CreditCard className="h-5 w-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Mon Abonnement</h2>
            </div>
            {getStatusBadge()}
          </div>

          {/* Plan actuel */}
          <div className="space-y-4">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">
                Plan {planConfig.label}
              </h3>
              <p className="text-2xl font-mono text-zinc-300">
                {planConfig.pricePerMonth}
              </p>
            </div>

            {/* Détails de facturation */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Calendar className="h-4 w-4" />
                  <span>Prochain paiement</span>
                </div>
                {status === "cancelled" && cancellationDate ? (
                  <p className="text-sm font-semibold text-red-400">
                    Se terminera le {formatDate(cancellationDate)}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-white">
                    {formatDate(nextPaymentDate)}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <CreditCard className="h-4 w-4" />
                  <span>Moyen de paiement</span>
                </div>
                {planType === "free" ? (
                  <p className="text-sm text-zinc-500 italic">Aucun</p>
                ) : (
                  <p className="text-sm font-mono text-white">
                    Visa •••• 4242
                  </p>
                )}
              </div>
            </div>

            {/* Zone d'actions */}
            <div className="pt-4 space-y-3">
              {planType === "free" ? (
                <Button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 text-white border-0 shadow-lg shadow-purple-500/20"
                  size="lg"
                >
                  {isUpgrading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Passer au plan PRO
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    onClick={() => {
                      // Rediriger vers la page pricing pour changer de plan
                      window.location.href = "/pricing"
                    }}
                  >
                    Changer de plan
                  </Button>
                  {status === "active" && (
                    <Button
                      variant="destructive"
                      className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30"
                      onClick={() => setShowCancelDialog(true)}
                      disabled={isCancelling}
                    >
                      {isCancelling ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Annulation...
                        </>
                      ) : (
                        "Annuler l'abonnement"
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dialog de confirmation d'annulation */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Annuler l'abonnement ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Votre abonnement restera actif jusqu'à la fin de la période de facturation. 
              Vous pourrez continuer à utiliser toutes les fonctionnalités jusqu'au {formatDate(nextPaymentDate)}.
              <br /><br />
              Après cette date, votre compte passera automatiquement au plan Free.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              Garder mon abonnement
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Confirmer l'annulation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}








