"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function ValueCrystal() {
  const crystalRef = useRef<THREE.Mesh>(null)

  // Rotation ultra-lente, presque imperceptible
  useFrame(() => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y += 0.001
      crystalRef.current.rotation.x += 0.0005
    }
  })

  return (
    <group>
      {/* Éclairage sophistiqué pour réfractions */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#6366f1" />
      <pointLight position={[-5, -3, 3]} intensity={1} color="#d4af37" /> {/* Or */}
      <spotLight position={[0, 10, 0]} intensity={2} angle={0.3} penumbra={1} color="#ffffff" />

      {/* Cristal principal (diamant complexe) */}
      <mesh ref={crystalRef}>
        <octahedronGeometry args={[1.2, 2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.9}
          metalness={0.1}
          roughness={0.05}
          transmission={0.95}
          thickness={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          ior={2.5}
          reflectivity={1}
          envMapIntensity={1}
        />
      </mesh>

      {/* Anneau intérieur (accent or) */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[0.8, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          emissive="#d4af37"
          emissiveIntensity={0.5}
          metalness={1}
          roughness={0.2}
        />
      </mesh>

      {/* Particules orbitales (symbolise valeur) */}
      {[0, 120, 240].map((angle, i) => {
        const radian = (angle * Math.PI) / 180
        const x = Math.cos(radian) * 1.5
        const z = Math.sin(radian) * 1.5
        return (
          <mesh key={i} position={[x, 0, z]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial
              color="#6366f1"
              emissive="#6366f1"
              emissiveIntensity={1}
            />
          </mesh>
        )
      })}
    </group>
  )
}










