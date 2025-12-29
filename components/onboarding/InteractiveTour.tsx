"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
// ANCIEN CODE: import { completeOnboarding } from "@/app/actions/complete-onboarding" - SUPPRIMÉ car on utilise localStorage maintenant

export type TourStep = {
  id: string
  target: string // ID ou sélecteur CSS de l'élément cible
  title: string
  description: string
  position?: "top" | "bottom" | "left" | "right" | "center"
}

const defaultSteps: TourStep[] = [
  {
    id: "step-1",
    target: "tour-generate-flow",
    title: "Créer un Flow",
    description: "C'est ici que tout commence. Créez votre première veille thématique en quelques secondes.",
    position: "right",
  },
  {
    id: "step-2",
    target: "tour-stats",
    title: "Vos statistiques",
    description: "Suivez ici le volume d'articles analysés par l'IA et votre consommation hebdomadaire.",
    position: "bottom",
  },
  {
    id: "step-3",
    target: "tour-export",
    title: "Exporter vos Flows",
    description: "Exportez vos résumés en PDF ou recevez-les directement par email selon votre plan.",
    position: "top",
  },
]

interface InteractiveTourProps {
  steps?: TourStep[]
  onComplete?: () => void
  onSkip?: () => void
  autoStart?: boolean
}

export default function InteractiveTour({
  steps = defaultSteps,
  onComplete,
  onSkip,
  autoStart = true,
}: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isActive, setIsActive] = useState(autoStart)
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [targetPositionViewport, setTargetPositionViewport] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const currentStepData = steps[currentStep]

  // Calculer la position de l'élément cible
  useEffect(() => {
    if (!isActive || !currentStepData) return

    const updateTargetPosition = () => {
      const element = document.querySelector(currentStepData.target)
      if (!element) {
        // Si l'élément n'existe pas encore, réessayer après un court délai
        setTimeout(updateTargetPosition, 500)
        return
      }

      // Faire défiler l'élément en vue si nécessaire
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" })

      // Attendre que le scroll soit terminé avant de calculer les positions
      setTimeout(() => {
        const rect = element.getBoundingClientRect()
        const scrollX = window.scrollX || window.pageXOffset
        const scrollY = window.scrollY || window.pageYOffset

        const newTargetPosition = {
          x: rect.left + scrollX,
          y: rect.top + scrollY,
          width: rect.width,
          height: rect.height,
        }

        // Position viewport (pour l'overlay)
        const newTargetPositionViewport = {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        }

        setTargetPosition(newTargetPosition)
        setTargetPositionViewport(newTargetPositionViewport)

        // Calculer la position centrale pour le curseur
        const centerX = newTargetPosition.x + newTargetPosition.width / 2
        const centerY = newTargetPosition.y + newTargetPosition.height / 2

        // Animer le curseur vers la nouvelle position
        setCursorPosition({ x: centerX, y: centerY })
        
        // Afficher la tooltip après un court délai
        setTimeout(() => {
          setShowTooltip(true)
        }, 500)
      }, 1000)
    }

    // Réinitialiser l'état
    setShowTooltip(false)
    
    // Démarrer la mise à jour
    updateTargetPosition()

    // Réécouter les changements de taille de fenêtre
    const handleResize = () => {
      setShowTooltip(false)
      setTimeout(updateTargetPosition, 100)
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleResize, true)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleResize, true)
    }
  }, [isActive, currentStep, currentStepData])

  const handleNext = () => {
    setShowTooltip(false)
    if (currentStep < steps.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 300)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    setShowTooltip(false)
    if (currentStep > 0) {
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
      }, 300)
    }
  }

  // NOUVEAU CODE: Suppression de l'appel Supabase, la sauvegarde se fait dans OnboardingManager via localStorage
  // ANCIEN CODE: await completeOnboarding() - SUPPRIMÉ
  const handleSkip = () => {
    setIsActive(false)
    setShowTooltip(false)
    onSkip?.()
  }

  const handleComplete = () => {
    setIsActive(false)
    setShowTooltip(false)
    onComplete?.()
  }

  // Early return : si le tour n'est pas actif, on ne rend RIEN DU TOUT
  // Cela empêche le curseur fantôme d'apparaître en position (0,0)
  if (!isActive) {
    return null
  }

  // Calculer la position de la tooltip
  const getTooltipPosition = () => {
    const spacing = 20
    const tooltipWidth = 320
    const tooltipHeight = 150

    switch (currentStepData.position) {
      case "right":
        return {
          left: targetPosition.x + targetPosition.width + spacing,
          top: targetPosition.y + targetPosition.height / 2 - tooltipHeight / 2,
        }
      case "left":
        return {
          left: targetPosition.x - tooltipWidth - spacing,
          top: targetPosition.y + targetPosition.height / 2 - tooltipHeight / 2,
        }
      case "top":
        return {
          left: targetPosition.x + targetPosition.width / 2 - tooltipWidth / 2,
          top: targetPosition.y - tooltipHeight - spacing,
        }
      case "bottom":
        return {
          left: targetPosition.x + targetPosition.width / 2 - tooltipWidth / 2,
          top: targetPosition.y + targetPosition.height + spacing,
        }
      default:
        return {
          left: targetPosition.x + targetPosition.width + spacing,
          top: targetPosition.y + targetPosition.height / 2 - tooltipHeight / 2,
        }
    }
  }

  const tooltipPos = getTooltipPosition()

  return (
    <>
      {/* Overlay avec spotlight */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] pointer-events-none"
            style={{
              background: `radial-gradient(
                circle at ${targetPositionViewport.x + targetPositionViewport.width / 2}px ${targetPositionViewport.y + targetPositionViewport.height / 2}px,
                transparent ${Math.max(targetPositionViewport.width, targetPositionViewport.height) / 2 + 20}px,
                rgba(0, 0, 0, 0.85) ${Math.max(targetPositionViewport.width, targetPositionViewport.height) / 2 + 100}px
              )`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Curseur virtuel animé - Ne jamais rendre si isActive est false */}
      {isActive && (
        <AnimatePresence>
          <motion.div
            ref={cursorRef}
            initial={{ opacity: 0, scale: 0, x: cursorPosition.x, y: cursorPosition.y }}
            animate={{
              opacity: 1,
              scale: 1,
              x: cursorPosition.x,
              y: cursorPosition.y,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.3 },
            }}
            className="fixed z-[9999] pointer-events-none"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Curseur SVG */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-2xl"
            >
              <motion.path
                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                fill="white"
                stroke="rgba(99, 102, 241, 0.8)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.circle
                cx="12"
                cy="12"
                r="3"
                fill="rgba(99, 102, 241, 0.6)"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
              />
            </svg>

            {/* Animation de clic */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-indigo-400"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Tooltip explicative */}
      <AnimatePresence>
        {isActive && showTooltip && currentStepData && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="fixed z-[9999] pointer-events-auto"
            style={{
              left: `${tooltipPos.left}px`,
              top: `${tooltipPos.top}px`,
              width: "320px",
            }}
          >
            <div className="relative rounded-2xl border border-white/20 bg-zinc-900/95 backdrop-blur-xl p-6 shadow-2xl">
              {/* Badge étape */}
              <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold">
                Étape {currentStep + 1} / {steps.length}
              </div>

              {/* Contenu */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{currentStepData.title}</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">{currentStepData.description}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-zinc-400 hover:text-white"
                  >
                    <SkipForward className="h-4 w-4 mr-1" />
                    Passer
                  </Button>

                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevious}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={handleNext}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                    >
                      {currentStep === steps.length - 1 ? "Terminer" : "Suivant"}
                      {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Flèche pointant vers l'élément */}
              <div
                className="absolute w-0 h-0"
                style={{
                  ...(currentStepData.position === "right" && {
                    left: "-8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderRight: "8px solid rgba(39, 39, 42, 0.95)",
                  }),
                  ...(currentStepData.position === "left" && {
                    right: "-8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderLeft: "8px solid rgba(39, 39, 42, 0.95)",
                  }),
                  ...(currentStepData.position === "top" && {
                    bottom: "-8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderTop: "8px solid rgba(39, 39, 42, 0.95)",
                  }),
                  ...(currentStepData.position === "bottom" && {
                    top: "-8px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    borderBottom: "8px solid rgba(39, 39, 42, 0.95)",
                  }),
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

