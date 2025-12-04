"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import * as THREE from "three"

export default function HeroAbstract() {
  const ringRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // Générer des particules en anneau (simplifié)
  const particles = useMemo(() => {
    const count = 80 // Réduit de 150 à 80 pour minimalisme
    const positions = new Float32Array(count * 3)
    const radius = 3

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radiusOffset = radius + (Math.random() - 0.5) * 0.5

      positions[i * 3] = Math.cos(angle) * radiusOffset // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3 // y (légère variation)
      positions[i * 3 + 2] = Math.sin(angle) * radiusOffset // z
    }

    return positions
  }, [])

  // Animation autonome ultra-lente (breathing, à peine perceptible)
  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.002 // Rotation imperceptible
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.003 // Légèrement plus rapide pour contraste subtil
    }
  })

  return (
    <Float
      speed={0.5}
      rotationIntensity={0.1}
      floatIntensity={0.3}
      floatingRange={[-0.2, 0.2]}
    >
      <group ref={ringRef}>
        {/* Lumière ambiante douce */}
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#6366f1" />
        <pointLight position={[-5, -5, 5]} intensity={0.3} color="#a5b4fc" />

        {/* Anneaux en fil de fer (Wireframe) */}
        {[2.5, 3, 3.5].map((radius, index) => (
          <mesh key={`ring-${index}`} rotation={[Math.PI / 2 + index * 0.1, 0, 0]}>
            <torusGeometry args={[radius, 0.01, 16, 100]} />
            <meshBasicMaterial
              color="#71717a"
              transparent
              opacity={0.15 - index * 0.03}
            />
          </mesh>
        ))}

        {/* Sphère en wireframe centrale */}
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial
            color="#52525b"
            wireframe
            transparent
            opacity={0.1}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Particules en anneau */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particles.length / 3}
              array={particles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color="#6366f1"
            transparent
            opacity={0.4}
            sizeAttenuation={true}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Lignes de connexion subtiles (Grille) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const x1 = Math.cos(angle) * 2.5
          const z1 = Math.sin(angle) * 2.5
          const x2 = Math.cos(angle) * 3.5
          const z2 = Math.sin(angle) * 3.5

          return (
            <mesh key={`line-${i}`} position={[(x1 + x2) / 2, 0, (z1 + z2) / 2]}>
              <boxGeometry args={[0.005, 0.005, Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2)]} />
              <meshBasicMaterial color="#3f3f46" transparent opacity={0.2} />
            </mesh>
          )
        })}

        {/* Arête centrale lumineuse (accent Indigo) */}
        <mesh rotation={[0, 0, 0]}>
          <torusGeometry args={[3, 0.015, 16, 64]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={0.3}
            metalness={1}
            roughness={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </Float>
  )
}

