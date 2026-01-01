import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Récupère l'URL de base de l'application de manière dynamique
 * Fonctionne en local et en production sur Vercel
 */
export function getURL(): string {
  // Côté client : utilise window.location.origin (le plus fiable et dynamique)
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Côté serveur : utilise les variables d'environnement
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ?? // Défini dans Vercel
    process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatique sur Vercel
    'http://localhost:3000'

  // S'assurer que l'URL commence par http:// ou https://
  url = url.includes('http') ? url : `https://${url}`
  
  // Retourner l'URL sans le / final pour avoir juste l'origin
  return url.replace(/\/$/, '')
}
