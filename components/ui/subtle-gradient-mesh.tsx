"use client"

import { motion } from "framer-motion"
import { useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function SubtleGradientMesh() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Transformations pour l'effet de parallaxe
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 40])
  const opacity1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.2, 0.15])
  const opacity2 = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.15, 0.1])
  const opacity3 = useTransform(scrollYProgress, [0, 0.5, 1], [0.12, 0.18, 0.12])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Gradient mesh 1 - Top left */}
      <motion.div
        style={{ y: y1, opacity: opacity1 }}
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-3xl"
      >
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-full h-full"
        />
      </motion.div>

      {/* Gradient mesh 2 - Bottom right */}
      <motion.div
        style={{ y: y2, opacity: opacity2 }}
        className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-3xl"
      >
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)",
            ],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-full h-full"
        />
      </motion.div>

      {/* Gradient mesh 3 - Center */}
      <motion.div
        style={{ y: y3, opacity: opacity3 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
      >
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, transparent 70%)",
              "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)",
            ],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-full h-full"
        />
      </motion.div>

      {/* Grille subtile animée */}
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "50px 50px"],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Vignettage très subtil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.3)_100%)]" />
    </div>
  )
}


