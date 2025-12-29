"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { type MotionValue } from "framer-motion"

type MorphingCompassProps = {
  scrollProgress?: MotionValue<number>
  scrollVelocity?: MotionValue<number>
}

export default function MorphingCompass({ scrollProgress, scrollVelocity }: MorphingCompassProps) {
  const groupRef = useRef<THREE.Group>(null)
  const rotationSpeed = useRef(0.002)

  useFrame(() => {
    if (groupRef.current) {
      // Vitesse de rotation liée à la vitesse de scroll
      if (scrollVelocity) {
        const velocity = Math.abs(scrollVelocity.get())
        rotationSpeed.current = 0.002 + velocity * 0.1
      }

      groupRef.current.rotation.y += rotationSpeed.current

      // Ralentissement progressif
      rotationSpeed.current *= 0.95
      if (rotationSpeed.current < 0.002) rotationSpeed.current = 0.002
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#a855f7" />
      <pointLight position={[-3, -3, 3]} intensity={1} color="#ec4899" />

      {/* Boussole/Rouage hybride */}
      <mesh>
        <torusGeometry args={[0.8, 0.1, 16, 64]} />
        <meshPhysicalMaterial
          color="#a855f7"
          metalness={0.2}
          roughness={0.1}
          transmission={0.5}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Aiguille centrale */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.05, 1, 0.05]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#ec4899"
          emissiveIntensity={1}
          metalness={1}
          roughness={0.2}
        />
      </mesh>

      {/* Points cardinaux (rouages) */}
      {[0, 90, 180, 270].map((angle, i) => {
        const radian = (angle * Math.PI) / 180
        const x = Math.cos(radian) * 0.9
        const z = Math.sin(radian) * 0.9
        return (
          <mesh key={i} position={[x, 0, z]}>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 8]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#a855f7"
              emissiveIntensity={0.5}
            />
          </mesh>
        )
      })}

      {/* Cristal central */}
      <mesh>
        <octahedronGeometry args={[0.2, 0]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0.05}
          transmission={0.9}
          thickness={0.5}
          ior={2.4}
        />
      </mesh>
    </group>
  )
}










