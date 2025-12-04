"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function PremiumCoin() {
  const coinRef = useRef<THREE.Group>(null)
  const innerRingRef = useRef<THREE.Mesh>(null)

  // Animation autonome ultra-lente (breathing premium)
  useFrame((state) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += 0.002 // Rotation très lente
      coinRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08 // Oscillation subtile
      coinRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 // Flottement doux
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= 0.003 // Rotation opposée lente
    }
  })

  return (
    <group ref={coinRef}>
      {/* Lumières dorées */}
      <pointLight position={[3, 3, 3]} intensity={3} color="#fbbf24" />
      <pointLight position={[-3, -3, 2]} intensity={2} color="#f59e0b" />
      <ambientLight intensity={0.5} />

      {/* Disque principal (Or/Verre) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.15, 64]} />
        <meshPhysicalMaterial
          color="#fbbf24"
          metalness={0.9}
          roughness={0.1}
          transmission={0.3}
          thickness={0.5}
          emissive="#f59e0b"
          emissiveIntensity={0.4}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Bordure du disque (Plus dorée) */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.5, 0.08, 16, 64]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={1}
          roughness={0.1}
          emissive="#fbbf24"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Anneaux concentriques (gravés) */}
      {[0.7, 1.0, 1.3].map((radius, index) => (
        <mesh key={index} position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.01, 16, 64]} />
          <meshBasicMaterial color="#d97706" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Symbole central (Hexagone) */}
      <mesh position={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 6]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={1}
          roughness={0.2}
          emissive="#fbbf24"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Anneau intérieur qui tourne indépendamment */}
      <mesh ref={innerRingRef} position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.6, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#fbbf24"
          metalness={1}
          roughness={0.1}
          emissive="#f59e0b"
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* Particules dorées orbitant */}
      {[0, 60, 120, 180, 240, 300].map((angle, index) => {
        const rad = (angle * Math.PI) / 180
        const x = Math.cos(rad) * 2
        const z = Math.sin(rad) * 2

        return (
          <mesh key={`particle-${index}`} position={[x, 0, z]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={1}
              metalness={1}
              roughness={0.1}
            />
          </mesh>
        )
      })}

      {/* Halo lumineux */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2, 0.01, 64]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

