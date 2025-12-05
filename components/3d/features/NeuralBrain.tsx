"use client"

import { useRef, useMemo, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, Line, Billboard, Text } from "@react-three/drei"
import * as THREE from "three"

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 NEURAL BRAIN - Réseau de neurones 3D style Data Science / IA Avancée
// ═══════════════════════════════════════════════════════════════════════════════

type NeuronNode = {
  position: THREE.Vector3
  label: string
  pulseOffset: number
  baseScale: number
}

type Connection = {
  start: THREE.Vector3
  end: THREE.Vector3
  distance: number
  pulseOffset: number
}

// Palette de couleurs Violet/Indigo
const COLORS = {
  primary: "#8b5cf6",      // Violet principal
  secondary: "#a78bfa",    // Violet clair
  accent: "#6366f1",       // Indigo
  glow: "#c4b5fd",         // Violet très clair pour glow
  text: "#ddd6fe",         // Texte clair
  textDim: "#a78bfa",      // Texte semi-transparent
}

// Génère un code technique aléatoire (N1, X4, A9, etc.)
function generateTechLabel(): string {
  const prefixes = ["N", "X", "A", "B", "C", "D", "E", "K", "M", "R", "T", "Z", "Σ", "Δ", "Ω", "λ"]
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const number = Math.floor(Math.random() * 10)
  return `${prefix}${number}`
}

// Génère une position aléatoire dans un volume sphérique
function randomSpherePoint(radius: number): THREE.Vector3 {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  const r = radius * Math.cbrt(Math.random()) // Distribution uniforme dans le volume
  
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔮 Composant Neurone individuel avec label Billboard
// ═══════════════════════════════════════════════════════════════════════════════

function Neuron({ 
  node, 
  time 
}: { 
  node: NeuronNode
  time: number 
}) {
  // Animation de pulsation
  const pulseScale = node.baseScale + Math.sin(time * 2 + node.pulseOffset) * 0.02
  const pulseEmissive = 0.6 + Math.sin(time * 3 + node.pulseOffset) * 0.3

  return (
    <group position={node.position}>
      {/* Nœud principal (sphère luminescente) */}
      <Sphere args={[pulseScale, 16, 16]}>
        <meshStandardMaterial
          color={COLORS.primary}
          emissive={COLORS.primary}
          emissiveIntensity={pulseEmissive}
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Halo lumineux externe */}
      <Sphere args={[pulseScale * 1.8, 8, 8]}>
        <meshBasicMaterial
          color={COLORS.glow}
          transparent
          opacity={0.08 + Math.sin(time * 2 + node.pulseOffset) * 0.04}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Label Billboard - toujours face à la caméra */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0.15, 0.1, 0]}
          fontSize={0.08}
          color={COLORS.text}
          anchorX="left"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Regular.woff"
          outlineWidth={0.005}
          outlineColor={COLORS.primary}
          outlineOpacity={0.5}
          fillOpacity={0.85}
        >
          {node.label}
        </Text>
      </Billboard>
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🔗 Composant Connexion synaptique avec animation
// ═══════════════════════════════════════════════════════════════════════════════

function Synapse({ 
  connection, 
  time 
}: { 
  connection: Connection
  time: number 
}) {
  // Animation de pulsation de l'opacité basée sur la distance
  const baseOpacity = THREE.MathUtils.mapLinear(connection.distance, 0.3, 1.8, 0.6, 0.15)
  const pulseOpacity = baseOpacity + Math.sin(time * 1.5 + connection.pulseOffset) * 0.1

  // Animation de "flux de données" le long de la connexion
  const flowPosition = (Math.sin(time * 2 + connection.pulseOffset) + 1) / 2
  const midPoint = new THREE.Vector3().lerpVectors(
    connection.start, 
    connection.end, 
    flowPosition
  )

  return (
    <group>
      {/* Ligne de connexion principale */}
      <Line
        points={[
          [connection.start.x, connection.start.y, connection.start.z],
          [connection.end.x, connection.end.y, connection.end.z],
        ]}
        color={COLORS.secondary}
        lineWidth={1}
        transparent
        opacity={pulseOpacity}
      />

      {/* Petit point de "données" qui voyage le long de la connexion */}
      <Sphere args={[0.015, 8, 8]} position={midPoint}>
        <meshBasicMaterial
          color={COLORS.glow}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </group>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 Composant Principal - Neural Brain
// ═══════════════════════════════════════════════════════════════════════════════

export default function NeuralBrain() {
  const groupRef = useRef<THREE.Group>(null)
  const [time, setTime] = useState(0)

  // Générer le réseau de neurones
  const { neurons, connections } = useMemo(() => {
    const nodeCount = 18 // Entre 15 et 20 nœuds
    const connectionThreshold = 1.2 // Distance max pour créer une connexion
    const sphereRadius = 1.8

    // Générer les neurones
    const neurons: NeuronNode[] = []
    for (let i = 0; i < nodeCount; i++) {
      neurons.push({
        position: randomSpherePoint(sphereRadius),
        label: generateTechLabel(),
        pulseOffset: Math.random() * Math.PI * 2,
        baseScale: 0.05 + Math.random() * 0.03,
      })
    }

    // Calculer les connexions basées sur la distance
    const connections: Connection[] = []
    const connectedPairs = new Set<string>()

    for (let i = 0; i < neurons.length; i++) {
      for (let j = i + 1; j < neurons.length; j++) {
        const distance = neurons[i].position.distanceTo(neurons[j].position)
        const pairKey = `${i}-${j}`

        // Connecter si la distance est inférieure au seuil
        if (distance < connectionThreshold && !connectedPairs.has(pairKey)) {
          connections.push({
            start: neurons[i].position,
            end: neurons[j].position,
            distance,
            pulseOffset: Math.random() * Math.PI * 2,
          })
          connectedPairs.add(pairKey)
        }
      }
    }

    // S'assurer qu'il y a assez de connexions (minimum 2 par nœud en moyenne)
    // Ajouter des connexions supplémentaires si nécessaire
    if (connections.length < nodeCount * 1.5) {
      for (let i = 0; i < neurons.length; i++) {
        // Trouver les 2 plus proches voisins non encore connectés
        const distances = neurons
          .map((n, j) => ({ index: j, dist: neurons[i].position.distanceTo(n.position) }))
          .filter((d) => d.index !== i)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3)

        for (const { index: j, dist } of distances) {
          const pairKey = i < j ? `${i}-${j}` : `${j}-${i}`
          if (!connectedPairs.has(pairKey) && dist < connectionThreshold * 1.5) {
            connections.push({
              start: neurons[i].position,
              end: neurons[j].position,
              distance: dist,
              pulseOffset: Math.random() * Math.PI * 2,
            })
            connectedPairs.add(pairKey)
          }
        }
      }
    }

    console.log(`[NeuralBrain] Generated ${neurons.length} neurons with ${connections.length} connections`)

    return { neurons, connections }
  }, [])

  // Animation principale
  useFrame((state, delta) => {
    setTime(state.clock.elapsedTime)

    if (groupRef.current) {
      // Rotation lente et contemplative
      groupRef.current.rotation.y += delta * 0.08
      
      // Oscillation subtile sur l'axe X
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1
      
      // Légère oscillation sur l'axe Z pour plus de dynamisme
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {/* Éclairage ambiant violet */}
      <ambientLight intensity={0.2} color={COLORS.primary} />
      
      {/* Lumière principale - crée les reflets */}
      <pointLight 
        position={[3, 3, 3]} 
        intensity={1.5} 
        color={COLORS.accent} 
        distance={10}
        decay={2}
      />
      
      {/* Lumière secondaire - contre-jour */}
      <pointLight 
        position={[-3, -2, 2]} 
        intensity={0.8} 
        color={COLORS.secondary} 
        distance={8}
        decay={2}
      />

      {/* Lumière de rim pour effet de profondeur */}
      <pointLight 
        position={[0, 0, -4]} 
        intensity={0.5} 
        color={COLORS.glow} 
        distance={6}
        decay={2}
      />

      {/* Rendu des connexions (en premier pour Z-order) */}
      {connections.map((connection, index) => (
        <Synapse 
          key={`synapse-${index}`} 
          connection={connection} 
          time={time} 
        />
      ))}

      {/* Rendu des neurones */}
      {neurons.map((neuron, index) => (
        <Neuron 
          key={`neuron-${index}`} 
          node={neuron} 
          time={time} 
        />
      ))}

      {/* Grille de fond subtile (optionnelle - pour effet tech) */}
      <gridHelper 
        args={[6, 20, COLORS.primary, COLORS.primary]} 
        position={[0, -2.5, 0]}
        rotation={[0, 0, 0]}
      >
        <meshBasicMaterial 
          attach="material" 
          color={COLORS.primary} 
          transparent 
          opacity={0.03} 
        />
      </gridHelper>
    </group>
  )
}
