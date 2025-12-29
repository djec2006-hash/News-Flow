"use client"

import { useEffect, useState } from "react"
import InteractiveTour from "./InteractiveTour"

export default function OnboardingManager() {
  const [run, setRun] = useState(false)

  useEffect(() => {
    // NOUVEAU CODE: Vérification via localStorage uniquement
    // ANCIEN CODE: Utilisait supabase.from('profiles') - SUPPRIMÉ
    
    // Vérifier si on est côté client (localStorage n'existe que côté client)
    if (typeof window === "undefined") {
      return
    }

    // Vérifier dans localStorage si l'utilisateur a déjà vu le tutoriel
    const hasSeenOnboarding = localStorage.getItem("newsflow_has_seen_onboarding") === "true"

    // Attendre un peu pour que le DOM soit prêt
    const timer = setTimeout(() => {
      // Lancer le tour si l'utilisateur ne l'a pas encore vu
      if (!hasSeenOnboarding) {
        setRun(true)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Callback appelé quand le tour se termine (finish ou skip)
  const handleTourComplete = () => {
    // Sauvegarder dans localStorage que l'utilisateur a vu le tutoriel
    if (typeof window !== "undefined") {
      localStorage.setItem("newsflow_has_seen_onboarding", "true")
    }
    setRun(false)
  }

  if (!run) {
    return null
  }

  return (
    <InteractiveTour
      autoStart={true}
      onComplete={handleTourComplete}
      onSkip={handleTourComplete}
    />
  )
}
