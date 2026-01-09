"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function PremiumSeal() {
  const sealRef = useRef<THREE.Group>(null)

  // Rotation majestueuse et très lente
  useFrame(() => {
    if (sealRef.current) {
      sealRef.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={sealRef}>
      {/* Éclairage luxueux */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2} color="#d4af37" />
      <pointLight position={[-5, -3, 5]} intensity={1} color="#ffffff" />
      <spotLight position={[0, 8, 0]} intensity={2.5} angle={0.4} penumbra={1} color="#ffffff" />

      {/* Base du sceau (médaille ronde) */}
      <mesh>
        <cylinderGeometry args={[1.2, 1.2, 0.15, 64]} />
        <meshPhysicalMaterial
          color="#d4af37"
          metalness={0.9}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Bordure externe (relief) */}
      <mesh>
        <torusGeometry args={[1.2, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#b8860b"
          metalness={0.9}
          roughness={0.3}
        />
      </mesh>

      {/* Centre en verre sombre (élégance) */}
      <mesh position={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 64]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          metalness={0.1}
          roughness={0.1}
          transmission={0.3}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Étoile centrale (symbole premium) */}
      <mesh position={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.15, 0.15, 0.08, 5]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.5}
          metalness={1}
          roughness={0.1}
        />
      </mesh>

      {/* Anneaux orbitaux (détails) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[0.95, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.3}
          metalness={1}
          roughness={0.2}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, Math.PI / 4]} position={[0, 0, 0]}>
        <torusGeometry args={[0.95, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.3}
          metalness={1}
          roughness={0.2}
        />
      </mesh>

      {/* Reflets lumineux (3 points) */}
      {[0, 120, 240].map((angle, i) => {
        const radian = (angle * Math.PI) / 180
        const x = Math.cos(radian) * 0.6
        const z = Math.sin(radian) * 0.6
        return (
          <mesh key={i} position={[x, 0, z + 0.12]}>
            <sphereGeometry args={[0.04, 16, 16]} />
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

















