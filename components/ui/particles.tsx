"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

type ParticleConfig = {
  id: number
  size: number
  top: string
  left: string
  duration: number
  delay: number
  opacity: number
  color: "white" | "zinc" | "indigo" | "purple" | "pink"
  oscillationX: number
  isSpecial: boolean // Particule scintillante
  twinkleDuration?: number // Durée du scintillement
}

const PARTICLE_COUNT = 35 // Réduit drastiquement (110 → 35)

function createParticles(): ParticleConfig[] {
  const particles: ParticleConfig[] = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // 15-20% de particules spéciales scintillantes
    const isSpecial = Math.random() < 0.17

    // Taille : plus grosse pour les spéciales
    const size = isSpecial ? 3 + Math.random() * 2 : 1 + Math.random() * 2

    const top = `${100 + Math.random() * 20}%`
    const left = `${Math.random() * 100}%`

    // Durée TRÈS lente : baseline calme (30-60s)
    const duration = 30 + Math.random() * 30

    const delay = Math.random() * 20

    // Opacité de base très discrète (0.1-0.3)
    const baseOpacity = 0.1 + Math.random() * 0.2

    // Couleurs : majorité blanches/zinc
    const isColoredAccent = Math.random() < 0.1 // Seulement 10% colorées
    let color: ParticleConfig["color"]

    if (isColoredAccent) {
      const colors: Array<"indigo" | "purple" | "pink"> = ["indigo", "purple", "pink"]
      color = colors[Math.floor(Math.random() * colors.length)]
    } else {
      color = Math.random() < 0.7 ? "white" : "zinc"
    }

    // Oscillation latérale subtile
    const oscillationX = 5 + Math.random() * 15

    // Durée du scintillement (pour particules spéciales)
    const twinkleDuration = isSpecial ? 2 + Math.random() * 2 : undefined

    particles.push({
      id: i,
      size,
      top,
      left,
      duration,
      delay,
      opacity: baseOpacity,
      color,
      oscillationX,
      isSpecial,
      twinkleDuration,
    })
  }
  return particles
}

// Helper pour obtenir les classes Tailwind + box-shadow
function getParticleStyles(particle: ParticleConfig): { className: string; boxShadow?: string } {
  let className = "absolute rounded-full "
  let boxShadow: string | undefined

  switch (particle.color) {
    case "indigo":
      className += "bg-indigo-400"
      boxShadow = particle.isSpecial
        ? "0 0 10px rgba(129, 140, 248, 0.6), 0 0 20px rgba(129, 140, 248, 0.3)"
        : "0 0 4px rgba(129, 140, 248, 0.4)"
      break
    case "purple":
      className += "bg-purple-400"
      boxShadow = particle.isSpecial
        ? "0 0 10px rgba(192, 132, 252, 0.6), 0 0 20px rgba(192, 132, 252, 0.3)"
        : "0 0 4px rgba(192, 132, 252, 0.4)"
      break
    case "pink":
      className += "bg-pink-400"
      boxShadow = particle.isSpecial
        ? "0 0 10px rgba(244, 114, 182, 0.6), 0 0 20px rgba(244, 114, 182, 0.3)"
        : "0 0 4px rgba(244, 114, 182, 0.4)"
      break
    case "zinc":
      className += "bg-zinc-400"
      boxShadow = particle.isSpecial ? "0 0 8px rgba(255, 255, 255, 0.4)" : "0 0 3px rgba(255, 255, 255, 0.2)"
      break
    case "white":
    default:
      className += "bg-white"
      boxShadow = particle.isSpecial
        ? "0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.2)"
        : "0 0 4px rgba(255, 255, 255, 0.2)"
      break
  }

  return { className, boxShadow }
}

export default function Particles() {
  const particles = useMemo(() => createParticles(), [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => {
        const styles = getParticleStyles(p)
        
        // Animation spéciale pour les particules scintillantes
        if (p.isSpecial && p.twinkleDuration) {
          return (
            <motion.div
              key={p.id}
              className={styles.className}
              style={{
                width: p.size,
                height: p.size,
                top: p.top,
                left: p.left,
                boxShadow: styles.boxShadow,
              }}
              animate={{
                y: [0, -window.innerHeight - 100],
                x: [0, p.oscillationX, -p.oscillationX, 0],
                opacity: [0.3, 0.9, 0.3], // Scintillement "bougie"
                scale: [1, 1.2, 1], // Légère pulsation
              }}
              transition={{
                y: {
                  duration: p.duration,
                  ease: "linear",
                  repeat: Infinity,
                  delay: p.delay,
                },
                x: {
                  duration: p.duration * 0.3,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: p.delay,
                },
                opacity: {
                  duration: p.twinkleDuration,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: p.delay * 0.5,
                },
                scale: {
                  duration: p.twinkleDuration,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: p.delay * 0.5,
                },
              }}
            />
          )
        }
        
        // Animation normale pour les particules "poussière"
        return (
          <motion.div
            key={p.id}
            className={styles.className}
            style={{
              width: p.size,
              height: p.size,
              top: p.top,
              left: p.left,
              opacity: p.opacity,
              boxShadow: styles.boxShadow,
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, p.oscillationX, -p.oscillationX, 0],
            }}
            transition={{
              y: {
                duration: p.duration,
                ease: "linear",
                repeat: Infinity,
                delay: p.delay,
              },
              x: {
                duration: p.duration * 0.3,
                ease: "easeInOut",
                repeat: Infinity,
                delay: p.delay,
              },
            }}
          />
        )
      })}
    </div>
  )
}
