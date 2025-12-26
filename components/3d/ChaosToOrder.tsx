"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { type MotionValue } from "framer-motion"

type ChaosToOrderProps = {
  scrollProgress?: MotionValue<number>
}

export default function ChaosToOrder({ scrollProgress }: ChaosToOrderProps) {
  const pointsRef = useRef<THREE.Points>(null)

  // Générer particules avec positions chaos et ordre
  const { geometry, chaosPositions, orderPositions } = useMemo(() => {
    const count = 500
    const chaos = new Float32Array(count * 3)
    const order = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Position chaotique (nuage aléatoire)
      chaos[i * 3] = (Math.random() - 0.5) * 4
      chaos[i * 3 + 1] = (Math.random() - 0.5) * 4
      chaos[i * 3 + 2] = (Math.random() - 0.5) * 4

      // Position ordonnée (grille alignée)
      const row = Math.floor(i / 25)
      const col = i % 25
      order[i * 3] = (col - 12) * 0.15
      order[i * 3 + 1] = (row - 10) * 0.15
      order[i * 3 + 2] = 0
    }

    const geom = new THREE.BufferGeometry()
    geom.setAttribute("position", new THREE.BufferAttribute(chaos, 3))

    return { geometry: geom, chaosPositions: chaos, orderPositions: order }
  }, [])

  // Animation : transition chaos → ordre selon scroll
  useFrame(() => {
    if (pointsRef.current && scrollProgress) {
      const progress = Math.min(1, Math.max(0, scrollProgress.get()))
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length; i++) {
        // Interpolation linéaire (lerp) entre chaos et ordre
        positions[i] = chaosPositions[i] + (orderPositions[i] - chaosPositions[i]) * progress
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Rotation lente
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001
    }
  })

  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#3b82f6" />

      <points ref={pointsRef}>
        <bufferGeometry attach="geometry" {...geometry} />
        <pointsMaterial
          size={0.04}
          color="#3b82f6"
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}









