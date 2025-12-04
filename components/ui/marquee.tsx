"use client"

import { motion } from "framer-motion"
import { useState } from "react"

// Logos SVG inline avec couleurs officielles adaptées pour dark mode
const InstitutionLogos = () => {
  return (
    <>
      {/* Bloomberg */}
      <div className="flex items-center gap-3 transition-all duration-300 hover:brightness-110">
        <svg className="h-6" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="24" height="24" fill="#ffffff" />
          <path
            d="M4 8h8v8H4V8zm12 0h8v8h-8V8zM4 4h16v2H4V4zm0 14h16v2H4v-2z"
            fill="#000000"
          />
          <text x="28" y="17" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#ffffff">
            Bloomberg
          </text>
        </svg>
      </div>

      {/* Reuters */}
      <div className="flex items-center gap-3 transition-all duration-300 hover:brightness-110">
        <svg className="h-7" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="14" r="6" fill="#ff8000" />
          <text x="22" y="19" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="600" fill="#ffffff">
            REUTERS
          </text>
        </svg>
      </div>

      {/* Financial Times */}
      <div className="flex items-center gap-3 transition-all duration-300 hover:brightness-110">
        <svg className="h-6" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="100" height="24" fill="#fcd0b1" rx="2" />
          <text
            x="50"
            y="17"
            fontFamily="Georgia, serif"
            fontSize="13"
            fontWeight="bold"
            fill="#000000"
            textAnchor="middle"
          >
            Financial Times
          </text>
        </svg>
      </div>

      {/* The Economist */}
      <div className="flex items-center gap-3 transition-all duration-300 hover:brightness-110">
        <svg className="h-6" viewBox="0 0 130 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="130" height="24" fill="#e3120b" rx="2" />
          <text
            x="65"
            y="17"
            fontFamily="Georgia, serif"
            fontSize="12"
            fontWeight="bold"
            fill="#ffffff"
            textAnchor="middle"
          >
            THE ECONOMIST
          </text>
        </svg>
      </div>

      {/* Wall Street Journal */}
      <div className="flex items-center gap-3 transition-all duration-300 hover:brightness-110">
        <svg className="h-7" viewBox="0 0 140 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="0" y="20" fontFamily="Georgia, serif" fontSize="15" fontWeight="bold" fill="#ffffff">
            The Wall Street
          </text>
          <text x="0" y="26" fontFamily="Georgia, serif" fontSize="11" fontWeight="600" fill="#a1a1aa">
            JOURNAL
          </text>
        </svg>
      </div>

      {/* Federal Reserve (FED) */}
      <div className="flex items-center gap-3 transition-all duration-300 hover:brightness-110">
        <svg className="h-8" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" stroke="#7dd3fc" strokeWidth="2" fill="none" />
          <text x="16" y="20" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#7dd3fc" textAnchor="middle">
            FED
          </text>
          <text x="38" y="19" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="600" fill="#e4e4e7">
            Federal Reserve
          </text>
        </svg>
      </div>

      {/* European Central Bank (ECB) */}
      <div className="flex items-center gap-3 transition-all duration-300 hover:brightness-110">
        <svg className="h-8" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="1.5" fill="#60a5fa" />
          <circle cx="8" cy="16" r="1.5" fill="#60a5fa" />
          <circle cx="8" cy="24" r="1.5" fill="#60a5fa" />
          <circle cx="16" cy="4" r="1.5" fill="#60a5fa" />
          <circle cx="16" cy="28" r="1.5" fill="#60a5fa" />
          <circle cx="24" cy="4" r="1.5" fill="#60a5fa" />
          <circle cx="24" cy="28" r="1.5" fill="#60a5fa" />
          <circle cx="32" cy="8" r="1.5" fill="#60a5fa" />
          <circle cx="32" cy="16" r="1.5" fill="#60a5fa" />
          <circle cx="32" cy="24" r="1.5" fill="#60a5fa" />
          <text x="42" y="19" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="600" fill="#e4e4e7">
            ECB
          </text>
        </svg>
      </div>

      {/* TechCrunch */}
      <div className="flex items-center gap-3 transition-all duration-300 hover:brightness-110">
        <svg className="h-7" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 8h4v4H4V8zm6 0h4v4h-4V8zm6 0h4v4h-4V8z"
            fill="#0ACF83"
          />
          <text x="28" y="19" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="#0ACF83">
            TechCrunch
          </text>
        </svg>
      </div>

      {/* OECD */}
      <div className="flex items-center gap-3 transition-all duration-300 hover:brightness-110">
        <svg className="h-7" viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="10" stroke="#93c5fd" strokeWidth="2" fill="none" />
          <text x="28" y="19" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="600" fill="#e4e4e7">
            OECD
          </text>
        </svg>
      </div>
    </>
  )
}

export default function Marquee() {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div className="relative overflow-hidden py-12">
      {/* Gradient fade sur les bords */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex gap-16 whitespace-nowrap"
          animate={{
            x: isPaused ? undefined : [0, -2400],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            x: isPaused ? 0 : undefined,
          }}
        >
          {/* Triple pour effet infini */}
          <div className="flex gap-16">
            <InstitutionLogos />
          </div>
          <div className="flex gap-16">
            <InstitutionLogos />
          </div>
          <div className="flex gap-16">
            <InstitutionLogos />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
