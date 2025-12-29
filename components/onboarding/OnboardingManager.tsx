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

    // AVANT : Le tour se lançait automatiquement pour les nouveaux utilisateurs
    // MAINTENANT : Désactivé - Le tour ne se lance plus automatiquement
    // if (!hasSeenOnboarding) {
    //   setRun(true)
    // }
    
    // On vérifie juste pour info, mais on ne lance RIEN automatiquement
    if (!hasSeenOnboarding) {
      console.log("[OnboardingManager] Onboarding non vu, mais désactivé par défaut.")
    }
  }, [])

  // Callback appelé quand le tour se termine (finish ou skip)
  const handleTourComplete = () => {
    // Sauvegarder dans localStorage que l'utilisateur a vu le tutoriel
    if (typeof window !== "undefined") {
      localStorage.setItem("newsflow_has_seen_onboarding", "true")
    }
    setRun(false)
  }

  // Early return : si le tour n'est pas en train de tourner ("run" est false), 
  // on ne rend RIEN DU TOUT. Cela empêche le curseur fantôme d'apparaître.
  if (!run) {
    return null
  }

  // Sinon, on rend le composant normal
  return (
    <InteractiveTour
      autoStart={true}
      onComplete={handleTourComplete}
      onSkip={handleTourComplete}
    />
  )
}
