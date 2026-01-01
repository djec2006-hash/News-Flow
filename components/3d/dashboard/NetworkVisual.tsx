"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import * as THREE from "three"

// Palette de couleurs néon (bleu cyan, violet)
const COLORS = {
  primary: "#06b6d4",      // Cyan néon
  secondary: "#8b5cf6",    // Violet
  accent: "#6366f1",       // Indigo
  glow: "#a5b4fc",         // Violet clair pour glow
}

// Génère une position aléatoire dans une sphère
function randomSpherePoint(radius: number): THREE.Vector3 {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  const r = radius * Math.cbrt(Math.random())
  
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  )
}

type NetworkNode = {
  position: THREE.Vector3
  pulseOffset: number
  baseScale: number
}

type Connection = {
  start: THREE.Vector3
  end: THREE.Vector3
  distance: number
}

export default function NetworkVisual() {
  const groupRef = useRef<THREE.Group>(null)
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([])

  // Constantes
  const connectionThreshold = 1.0 // Distance max pour créer une connexion

  // Générer le réseau de points et connexions
  const { nodes, connections } = useMemo(() => {
    const nodeCount = 40 // 30-50 points
    const sphereRadius = 1.5

    // Générer les nœuds
    const nodes: NetworkNode[] = []
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        position: randomSpherePoint(sphereRadius),
        pulseOffset: Math.random() * Math.PI * 2,
        baseScale: 0.02 + Math.random() * 0.015,
      })
    }

    // Calculer les connexions basées sur la distance
    const connections: Connection[] = []
    const connectedPairs = new Set<string>()

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position)
        const pairKey = `${i}-${j}`

        // Connecter si la distance est inférieure au seuil
        if (distance < connectionThreshold && !connectedPairs.has(pairKey)) {
          connections.push({
            start: nodes[i].position,
            end: nodes[j].position,
            distance,
          })
          connectedPairs.add(pairKey)
        }
      }
    }

    return { nodes, connections }
  }, [])

  // Animation : rotation lente et pulsation
  useFrame((state) => {
    if (groupRef.current) {
      // Rotation lente sur l'axe Y
      groupRef.current.rotation.y += 0.002
      // Légère oscillation sur l'axe Z
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }

    // Animation de pulsation des points
    const time = state.clock.elapsedTime
    nodeRefs.current.forEach((mesh, i) => {
      if (mesh && nodes[i]) {
        const pulseScale = nodes[i].baseScale + Math.sin(time * 1.5 + nodes[i].pulseOffset) * 0.005
        mesh.scale.setScalar(pulseScale / nodes[i].baseScale)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* Éclairage néon */}
      <ambientLight intensity={0.3} color={COLORS.primary} />
      <pointLight position={[3, 3, 3]} intensity={1.2} color={COLORS.primary} />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color={COLORS.secondary} />

      {/* Rendu des connexions (lignes) */}
      {connections.map((connection, index) => {
        // Calculer l'opacité basée sur la distance (plus proche = plus visible)
        const opacity = THREE.MathUtils.mapLinear(
          connection.distance,
          0.3,
          connectionThreshold,
          0.4,
          0.15
        )

        return (
          <Line
            key={`line-${index}`}
            points={[
              [connection.start.x, connection.start.y, connection.start.z],
              [connection.end.x, connection.end.y, connection.end.z],
            ]}
            color={COLORS.secondary}
            lineWidth={1}
            transparent
            opacity={opacity}
          />
        )
      })}

      {/* Rendu des points */}
      {nodes.map((node, index) => (
        <mesh
          key={`node-${index}`}
          ref={(el) => {
            nodeRefs.current[index] = el
          }}
          position={node.position}
        >
          <sphereGeometry args={[node.baseScale, 8, 8]} />
          <meshBasicMaterial
            color={COLORS.primary}
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

