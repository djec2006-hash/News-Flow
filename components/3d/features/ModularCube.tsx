"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export default function ModularCube() {
  const groupRef = useRef<THREE.Group>(null)
  const cubesRef = useRef<THREE.Mesh[]>([])

  // Générer une grille de petits cubes (simplifié)
  const cubes = useMemo(() => {
    const positions: [number, number, number][] = []
    const gridSize = 4 // Réduit de 5 à 4 (125 → 64 cubes)
    const spacing = 0.25

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        for (let z = 0; z < gridSize; z++) {
          const px = (x - gridSize / 2) * spacing
          const py = (y - gridSize / 2) * spacing
          const pz = (z - gridSize / 2) * spacing
          positions.push([px, py, pz])
        }
      }
    }

    return positions
  }, [])

  // Animation autonome ultra-lente (breathing)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001 // Rotation très lente
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.05 // Oscillation subtile
    }

    cubesRef.current.forEach((cube, index) => {
      if (cube) {
        const time = state.clock.elapsedTime
        const offset = index * 0.05

        // Oscillation imperceptible
        cube.position.x += Math.sin(time * 0.3 + offset) * 0.0002
        cube.position.y += Math.cos(time * 0.25 + offset) * 0.0002
        cube.position.z += Math.sin(time * 0.2 + offset) * 0.0002

        // Rotation individuelle très lente
        cube.rotation.x = time * 0.1 + offset
        cube.rotation.y = time * 0.08 + offset

        // Breathing subtil
        const scale = 0.95 + Math.sin(time * 0.5 + offset) * 0.05
        cube.scale.setScalar(scale)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* Lumières */}
      <pointLight position={[3, 3, 3]} intensity={2} color="#06b6d4" />
      <pointLight position={[-3, -3, 3]} intensity={1.5} color="#8b5cf6" />
      <ambientLight intensity={0.4} />

      {/* Petits cubes modulaires */}
      {cubes.map((position, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) cubesRef.current[index] = el
          }}
          position={position}
        >
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
            metalness={0.9}
            roughness={0.1}
            transmission={0.5}
            thickness={0.5}
            emissive="#8b5cf6"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Arêtes lumineuses (wireframe) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

