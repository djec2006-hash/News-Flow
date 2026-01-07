"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function SparklesShape() {
  const groupRef = useRef<THREE.Group>(null)
  const sparklesRef = useRef<THREE.Points>(null)

  const particleCount = 15

  // Générer positions aléatoires pour les particules
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      // Position initiale aléatoire dans une petite sphère
      const radius = Math.random() * 0.6 + 0.3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)

      // Vélocités orbitales
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
    }

    return { positions, velocities }
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  // Animation : orbite + scintillement
  useFrame((state) => {
    if (groupRef.current) {
      // Rotation du groupe entier
      groupRef.current.rotation.y += 0.01
      groupRef.current.rotation.x += 0.005
    }

    if (sparklesRef.current) {
      const positionAttribute = sparklesRef.current.geometry.getAttribute("position")
      const positions = positionAttribute.array as Float32Array

      // Orbite des particules
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i * 3]
        positions[i * 3 + 1] += velocities[i * 3 + 1]
        positions[i * 3 + 2] += velocities[i * 3 + 2]

        // Garder les particules dans une zone limitée (rebond)
        if (Math.abs(positions[i * 3]) > 1) velocities[i * 3] *= -1
        if (Math.abs(positions[i * 3 + 1]) > 1) velocities[i * 3 + 1] *= -1
        if (Math.abs(positions[i * 3 + 2]) > 1) velocities[i * 3 + 2] *= -1
      }

      positionAttribute.needsUpdate = true

      // Scintillement (opacité oscillante)
      if (sparklesRef.current.material instanceof THREE.PointsMaterial) {
        const time = state.clock.elapsedTime
        sparklesRef.current.material.opacity = 0.6 + Math.sin(time * 4) * 0.4
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Éclairage cyan/indigo */}
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 2]} intensity={2} color="#38bdf8" />
      <pointLight position={[-2, -1, 1]} intensity={1.5} color="#6366f1" />

      {/* Particules scintillantes */}
      <points ref={sparklesRef}>
        <bufferGeometry attach="geometry" {...geometry} />
        <pointsMaterial
          attach="material"
          color="#38bdf8"          // Cyan électrique
          size={0.08}              // Taille des étincelles
          transparent
          opacity={0.9}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
          toneMapped={false}       // Brille fort
        />
      </points>

      {/* Étoiles supplémentaires (layer 2) */}
      <points position={[0, 0, 0]} scale={0.7}>
        <bufferGeometry attach="geometry" {...geometry} />
        <pointsMaterial
          attach="material"
          color="#6366f1"          // Indigo
          size={0.05}
          transparent
          opacity={0.7}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Glow central (noyau lumineux) */}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}













