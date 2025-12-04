"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type ParticleType = {
  position: THREE.Vector3
  velocity: number
  size: number
  opacity: number
}

export default function SpeedStream() {
  const particlesRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Générer des particules allongées qui filent vers la caméra (simplifié)
  const particles = useMemo(() => {
    const count = 80 // Réduit de 200 à 80 pour subtilité
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Position en cylindre
      const angle = Math.random() * Math.PI * 2
      const radius = 1 + Math.random() * 3
      positions[i3] = Math.cos(angle) * radius // x
      positions[i3 + 1] = Math.sin(angle) * radius // y
      positions[i3 + 2] = -5 - Math.random() * 15 // z (derrière)

      velocities[i] = 0.05 + Math.random() * 0.15
      sizes[i] = 0.02 + Math.random() * 0.05
    }

    return { positions, velocities, sizes, count }
  }, [])

  // Animation autonome ultra-lente (flux contemplatif)
  useFrame((state) => {
    if (particlesRef.current && groupRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < particles.count; i++) {
        const i3 = i * 3

        // Avancer très lentement vers la caméra
        positions[i3 + 2] += particles.velocities[i] * 0.3 // Réduit la vitesse de 70%

        // Reset si la particule dépasse la caméra
        if (positions[i3 + 2] > 5) {
          const angle = Math.random() * Math.PI * 2
          const radius = 1 + Math.random() * 3
          positions[i3] = Math.cos(angle) * radius
          positions[i3 + 1] = Math.sin(angle) * radius
          positions[i3 + 2] = -20
        }
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true

      // Rotation imperceptible du tunnel
      groupRef.current.rotation.z += 0.0005
    }
  })

  return (
    <group ref={groupRef}>
      {/* Lumières Cyan/Blanc */}
      <pointLight position={[0, 0, 5]} intensity={3} color="#06b6d4" />
      <pointLight position={[0, 0, -10]} intensity={2} color="#ffffff" />
      <ambientLight intensity={0.2} />

      {/* Particules filantes */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.count}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute attach="attributes-size" count={particles.count} array={particles.sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#06b6d4"
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Trails (lignes allongées) pour effet vitesse - simplifié */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const radius = 2 + (i % 3) * 0.5
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        return (
          <mesh key={i} position={[x, y, -10]} rotation={[0, 0, angle]}>
            <cylinderGeometry args={[0.01, 0.01, 15, 4]} />
            <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} />
          </mesh>
        )
      })}

      {/* Cercles concentriques pour effet tunnel */}
      {[0, -5, -10, -15].map((z, index) => (
        <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2 + index * 0.5, 0.02, 16, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  )
}

