"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function TrustShield() {
  const shieldRef = useRef<THREE.Group>(null)
  const lockRef = useRef<THREE.Group>(null)

  // Animation autonome ultra-lente (flottement contemplatif)
  useFrame((state) => {
    if (shieldRef.current) {
      shieldRef.current.rotation.y += 0.001 // Rotation très lente
      shieldRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.05 // Flottement subtil
    }

    if (lockRef.current) {
      lockRef.current.rotation.y -= 0.0008 // Rotation opposée très lente
      lockRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4 + Math.PI / 2) * 0.03
    }
  })

  return (
    <group>
      {/* Lumières */}
      <pointLight position={[3, 3, 3]} intensity={2} color="#10b981" />
      <pointLight position={[-3, -3, 3]} intensity={1.5} color="#3b82f6" />
      <ambientLight intensity={0.4} />

      {/* Bouclier principal (forme de losange/hexagone) */}
      <group ref={shieldRef}>
        {/* Face avant du bouclier (verre épais) */}
        <mesh position={[0, 0, 0.1]}>
          <cylinderGeometry args={[1.5, 1.8, 0.15, 6]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            metalness={0.1}
            roughness={0.05}
            transmission={0.9}
            thickness={0.8}
            emissive="#3b82f6"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Contour métallique du bouclier */}
        <mesh position={[0, 0, 0.1]}>
          <cylinderGeometry args={[1.5, 1.8, 0.15, 6]} />
          <meshStandardMaterial
            color="#d4d4d8"
            metalness={1}
            roughness={0.2}
            emissive="#10b981"
            emissiveIntensity={0.3}
            wireframe
          />
        </mesh>

        {/* Face arrière (métal solide) */}
        <mesh position={[0, 0, -0.05]}>
          <cylinderGeometry args={[1.4, 1.7, 0.05, 6]} />
          <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Arêtes lumineuses */}
        {[0, 60, 120, 180, 240, 300].map((angle, index) => {
          const rad = (angle * Math.PI) / 180
          const x = Math.cos(rad) * 1.6
          const y = Math.sin(rad) * 1.6

          return (
            <mesh key={index} position={[x, y, 0.1]} rotation={[0, 0, rad]}>
              <boxGeometry args={[0.05, 0.3, 0.05]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#10b981"
                emissiveIntensity={0.8}
                metalness={1}
                roughness={0.1}
              />
            </mesh>
          )
        })}
      </group>

      {/* Cadenas central (symbole de sécurité) */}
      <group ref={lockRef} position={[0, 0, 0.3]}>
        {/* Corps du cadenas (verre) */}
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.5, 0.6, 0.3]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.5}
            metalness={0.2}
            roughness={0.1}
            transmission={0.7}
            thickness={0.5}
            emissive="#3b82f6"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Anse du cadenas (métal) */}
        <mesh position={[0, 0.2, 0]}>
          <torusGeometry args={[0.25, 0.06, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#d4d4d8" metalness={1} roughness={0.2} emissive="#10b981" emissiveIntensity={0.2} />
        </mesh>

        {/* Trou de serrure */}
        <mesh position={[0, -0.2, 0.16]}>
          <cylinderGeometry args={[0.06, 0.06, 0.1, 16]} />
          <meshStandardMaterial color="#000000" emissive="#3b82f6" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Particules de sécurité (orbites) */}
      {[1, 2, 3].map((orbit) => (
        <mesh key={orbit} position={[0, 0, 0]} rotation={[Math.PI / 2 + orbit * 0.3, 0, 0]}>
          <torusGeometry args={[2 + orbit * 0.3, 0.01, 16, 64]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Points lumineux orbitant */}
      {[0, 120, 240].map((angle, index) => {
        const rad = (angle * Math.PI) / 180
        const x = Math.cos(rad) * 2.5
        const z = Math.sin(rad) * 2.5

        return (
          <mesh key={`point-${index}`} position={[x, 0, z]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1} />
          </mesh>
        )
      })}
    </group>
  )
}

