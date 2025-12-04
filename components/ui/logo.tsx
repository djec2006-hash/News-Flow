"use client"

import { motion } from "framer-motion"

type LogoProps = {
  className?: string
}

export default function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Définition du gradient néon (couleurs ultra-saturées) */}
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" /> {/* Indigo-400 - Électrique */}
          <stop offset="50%" stopColor="#a855f7" /> {/* Purple-500 - Vif */}
          <stop offset="100%" stopColor="#ec4899" /> {/* Pink-500 - Néon */}
        </linearGradient>
        
        {/* Filtre glow pour effet lumineux */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Grande étoile (droite) - Version BOLD */}
      <motion.path
        d="M 70 38 L 74 48 L 85 48 L 77 56 L 81 68 L 70 61 L 59 68 L 63 56 L 55 48 L 66 48 Z"
        fill="url(#logo-gradient)"
        filter="url(#glow)"
        strokeWidth="0.5"
        stroke="url(#logo-gradient)"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.95, 1, 0.95],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "70px 53px" }}
      />

      {/* Petite étoile (gauche, décalée) - Version BOLD */}
      <motion.path
        d="M 35 28 L 38 36 L 46 36 L 40 42 L 43 51 L 35 45 L 27 51 L 30 42 L 24 36 L 32 36 Z"
        fill="url(#logo-gradient)"
        filter="url(#glow)"
        strokeWidth="0.5"
        stroke="url(#logo-gradient)"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4, // Asynchrone avec la grande étoile
        }}
        style={{ transformOrigin: "35px 39px" }}
      />

      {/* Petite particule brillante (accent renforcé) */}
      <motion.circle
        cx="52"
        cy="65"
        r="2.5"
        fill="url(#logo-gradient)"
        filter="url(#glow)"
        animate={{
          opacity: [0.4, 0.9, 0.4],
          scale: [0.8, 1.3, 0.8],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      />
    </svg>
  )
}

