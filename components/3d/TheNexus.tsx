"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { type MotionValue } from "framer-motion"

type TheNexusProps = {
  scrollProgress?: MotionValue<number>
}

export default function TheNexus({ scrollProgress }: TheNexusProps) {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)

  // Animation autonome + réaction au scroll
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002
    }

    // Pulse du cœur
    if (coreRef.current) {
      const pulse = Math.sin(Date.now() * 0.001) * 0.1 + 1
      coreRef.current.scale.setScalar(pulse)
    }

    // Ouverture au scroll (simulée par expansion des anneaux)
    if (scrollProgress && groupRef.current) {
      const progress = scrollProgress.get()
      const expansion = 1 + progress * 0.5 // S'ouvre de 50% au scroll
      groupRef.current.scale.setScalar(expansion)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Éclairage */}
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#6366f1" />
      <pointLight position={[-3, -3, 3]} intensity={1} color="#a855f7" />

      {/* Cœur central pulsant */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#6366f1"
          emissiveIntensity={1.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Anneaux orbitaux (le nexus) */}
      {[0, 60, 120].map((angle, i) => (
        <mesh key={i} rotation={[(angle * Math.PI) / 180, 0, Math.PI / 4]}>
          <torusGeometry args={[0.8 + i * 0.2, 0.02, 16, 64]} />
          <meshStandardMaterial
            color={i === 0 ? "#6366f1" : i === 1 ? "#a855f7" : "#ec4899"}
            emissive={i === 0 ? "#6366f1" : i === 1 ? "#a855f7" : "#ec4899"}
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Particules de données */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const radian = (angle * Math.PI) / 180
        const x = Math.cos(radian) * 1.2
        const z = Math.sin(radian) * 1.2
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={2}
            />
          </mesh>
        )
      })}
    </group>
  )
}







