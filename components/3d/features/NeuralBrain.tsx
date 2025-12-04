"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Line, Text } from "@react-three/drei"
import * as THREE from "three"

type NodeType = {
  position: [number, number, number]
  connections: number[]
  label: string
}

export default function NeuralBrain() {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.LineSegments[]>([])

  // Générer un réseau de neurones 3D simplifié (moins de nœuds)
  const network = useMemo(() => {
    const nodes: NodeType[] = []
    const nodeCount = 12 // Réduit de 20 à 12 pour simplicité
    
    // Étiquettes alphanumériques prédéfinies pour un aspect cohérent
    const labels = ["A1", "B7", "C3", "N9", "X5", "Z2", "E8", "D4", "K6", "M2", "R4", "T1"]

    // Créer les nœuds dans une sphère
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount)
      const theta = Math.sqrt(nodeCount * Math.PI) * phi

      const x = 2 * Math.cos(theta) * Math.sin(phi)
      const y = 2 * Math.sin(theta) * Math.sin(phi)
      const z = 2 * Math.cos(phi)

      // Chaque nœud se connecte à 2 autres nœuds (simplifié)
      const connections: number[] = []
      const connectionCount = 2

      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodeCount)
        if (targetIndex !== i && !connections.includes(targetIndex)) {
          connections.push(targetIndex)
        }
      }

      nodes.push({ 
        position: [x, y, z], 
        connections,
        label: labels[i]
      })
    }

    return nodes
  }, [])

  // Animation autonome ultra-lente (contemplative)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001 // Rotation très lente
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05 // Oscillation subtile
    }

    // Animation pulse très douce des connexions
    linesRef.current.forEach((line, index) => {
      if (line && line.material) {
        const material = line.material as THREE.LineBasicMaterial
        const pulseSpeed = 1 + (index % 3) * 0.3
        material.opacity = 0.25 + Math.sin(state.clock.elapsedTime * pulseSpeed + index) * 0.15
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* Lumières */}
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#6366f1" />
      <pointLight position={[-5, -5, 5]} intensity={1} color="#a855f7" />
      <ambientLight intensity={0.3} />

      {/* Nœuds (neurones) avec étiquettes */}
      {network.map((node, index) => {
        // Calculer la position de l'étiquette (légèrement décalée du nœud)
        const labelOffset = 0.25
        const direction = new THREE.Vector3(...node.position).normalize()
        const labelPosition: [number, number, number] = [
          node.position[0] + direction.x * labelOffset,
          node.position[1] + direction.y * labelOffset,
          node.position[2] + direction.z * labelOffset,
        ]

        return (
          <group key={`node-${index}`}>
            {/* Nœud lumineux */}
            <Sphere args={[0.08, 16, 16]} position={node.position}>
              <meshStandardMaterial
                color="#ffffff"
                emissive="#6366f1"
                emissiveIntensity={0.5}
                metalness={0.8}
                roughness={0.2}
              />
            </Sphere>

            {/* Étiquette alphanumérique */}
            <Text
              position={labelPosition}
              fontSize={0.15}
              color="#a855f7"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.01}
              outlineColor="#6366f1"
              outlineOpacity={0.5}
            >
              {node.label}
            </Text>
          </group>
        )
      })}

      {/* Connexions (synapses) */}
      {network.map((node, nodeIndex) =>
        node.connections.map((targetIndex, connIndex) => {
          if (targetIndex < network.length) {
            const target = network[targetIndex]
            return (
              <Line
                key={`line-${nodeIndex}-${connIndex}`}
                ref={(el) => {
                  if (el) linesRef.current[nodeIndex * 10 + connIndex] = el as unknown as THREE.LineSegments
                }}
                points={[node.position, target.position]}
                color="#a855f7"
                lineWidth={1}
                transparent
                opacity={0.4}
              />
            )
          }
          return null
        })
      )}
    </group>
  )
}

