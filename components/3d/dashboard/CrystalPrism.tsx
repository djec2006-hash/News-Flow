"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function CrystalPrism() {
  const meshRef = useRef<THREE.Mesh>(null)

  // Animation : lévitation douce + rotation lente
  useFrame((state) => {
    if (meshRef.current) {
      // Rotation lente et élégante
      meshRef.current.rotation.y += 0.008
      meshRef.current.rotation.x += 0.003

      // Lévitation douce (float up and down)
      const time = state.clock.elapsedTime
      meshRef.current.position.y = Math.sin(time * 0.8) * 0.15
    }
  })

  return (
    <group>
      {/* Éclairage pour faire briller le cristal */}
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={2} color="#a855f7" />
      <pointLight position={[-3, -2, 2]} intensity={1.5} color="#ec4899" />
      <spotLight position={[0, 5, 0]} intensity={1.5} angle={0.4} penumbra={1} color="#ffffff" />

      {/* Prisme Octaèdre (Diamant) */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshPhysicalMaterial
          color="#c026d3"           // Fuchsia/Violet néon
          transparent
          opacity={0.4}
          metalness={0.05}
          roughness={0.05}          // Très lisse (verre poli)
          transmission={0.95}       // 🔥 Transmission élevée (effet verre/cristal)
          thickness={1.2}
          ior={2.4}                 // Indice de réfraction du diamant
          emissive="#a855f7"        // Lueur violet
          emissiveIntensity={0.6}
          clearcoat={1}
          clearcoatRoughness={0}
          reflectivity={1}
          toneMapped={false}        // Brille fort même en environnement sombre
        />
      </mesh>

      {/* Wireframe subtil pour accentuer les arêtes */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.91, 0]} />
        <meshBasicMaterial
          color="#ec4899"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Glow externe (halo) */}
      <mesh ref={meshRef} scale={1.3}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}













