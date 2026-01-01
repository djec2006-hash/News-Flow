"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { type MotionValue } from "framer-motion"

type TheUntanglingProps = {
  scrollProgress?: MotionValue<number>
}

export default function TheUntangling({ scrollProgress }: TheUntanglingProps) {
  const linesRef = useRef<THREE.Group>(null)

  // Générer les câbles (nœud complexe → ligne droite)
  const cables = useMemo(() => {
    const cableCount = 12
    const cableData = []

    for (let i = 0; i < cableCount; i++) {
      const points = []
      const segments = 20

      for (let j = 0; j <= segments; j++) {
        const t = j / segments

        // Position de début (nœud complexe)
        const knotRadius = 0.5
        const knotAngle = (i / cableCount) * Math.PI * 2 + t * Math.PI * 4
        const knotX = Math.cos(knotAngle) * knotRadius * (1 - t * 0.5)
        const knotY = Math.sin(knotAngle) * knotRadius * (1 - t * 0.5)
        const knotZ = Math.sin(t * Math.PI * 6) * 0.3

        // Position finale (ligne droite)
        const lineX = (i - cableCount / 2) * 0.15
        const lineY = 0
        const lineZ = 0

        points.push(new THREE.Vector3(knotX, knotY, knotZ))
        cableData.push({ startPos: new THREE.Vector3(knotX, knotY, knotZ), endPos: new THREE.Vector3(lineX, lineY, lineZ), points })
      }
    }

    return cableData
  }, [])

  // Animation : dénouage selon scroll
  useFrame(() => {
    if (linesRef.current && scrollProgress) {
      const progress = Math.min(1, Math.max(0, scrollProgress.get()))

      linesRef.current.children.forEach((line, index) => {
        const cableInfo = cables[index]
        if (line instanceof THREE.Line && cableInfo) {
          const positions = line.geometry.attributes.position.array as Float32Array

          for (let i = 0; i < cableInfo.points.length; i++) {
            const start = cableInfo.startPos
            const end = cableInfo.endPos

            // Interpolation smooth (easeInOut)
            const smoothProgress = progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2

            positions[i * 3] = start.x + (end.x - start.x) * smoothProgress
            positions[i * 3 + 1] = start.y + (end.y - start.y) * smoothProgress
            positions[i * 3 + 2] = start.z + (end.z - start.z) * smoothProgress
          }

          line.geometry.attributes.position.needsUpdate = true
        }
      })
    }

    // Rotation lente du groupe
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={linesRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[3, 3, 3]} intensity={2} color="#ec4899" />
      <pointLight position={[-3, -3, 3]} intensity={1.5} color="#a855f7" />

      {cables.map((cable, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={cable.points.length}
              array={new Float32Array(cable.points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={index % 3 === 0 ? "#ec4899" : index % 3 === 1 ? "#a855f7" : "#6366f1"}
            linewidth={2}
            transparent
            opacity={0.8}
          />
        </line>
      ))}
    </group>
  )
}











