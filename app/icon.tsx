import { ImageResponse } from "next/og"

// Configuration de l'icône
export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

// Génération de l'icône avec les deux étincelles
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Définition du gradient */}
          <defs>
            <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          
          {/* Première étincelle (grande, à gauche) */}
          <path
            d="M10 2 L12 8 L18 10 L12 12 L10 18 L8 12 L2 10 L8 8 Z"
            fill="url(#sparkGradient)"
          />
          
          {/* Deuxième étincelle (petite, en bas à droite) */}
          <path
            d="M22 14 L23.5 18 L27.5 19.5 L23.5 21 L22 25 L20.5 21 L16.5 19.5 L20.5 18 Z"
            fill="url(#sparkGradient)"
          />
          
          {/* Points lumineux au centre des étincelles */}
          <circle cx="10" cy="10" r="1.5" fill="white" opacity="0.9" />
          <circle cx="22" cy="19.5" r="1" fill="white" opacity="0.9" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}






