"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import dynamic from "next/dynamic"

const CrystalPrism = dynamic(() => import("./CrystalPrism"), { ssr: false })
const SparklesShape = dynamic(() => import("./SparklesShape"), { ssr: false })

type ShapeType = "sphere" | "cube" | "diamond" | "crystal" | "sparkles"

export default function StatShape({ type }: { type: ShapeType }) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Animation autonome ultra-lente
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003
      meshRef.current.rotation.x += 0.002
    }
  })

  return (
    <group>
      {/* Éclairage renforcé pour faire briller les arêtes */}
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={1.5} color="#6366f1" />
      <pointLight position={[-2, -2, 2]} intensity={0.8} color="#8b5cf6" />
      <spotLight position={[0, 5, 0]} intensity={1.2} angle={0.3} penumbra={1} color="#ffffff" />

      {type === "sphere" && (
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshPhysicalMaterial
            color="#6366f1"
            transparent
            opacity={0.85}
            metalness={0.1}
            roughness={0.2}
            transmission={0.6}
            thickness={0.8}
            emissive="#6366f1"
            emissiveIntensity={0.3}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      )}

      {type === "cube" && (
        <mesh ref={meshRef}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color="#8b5cf6"
            transparent
            opacity={0.9}
            metalness={0.1}
            roughness={0.15}
            transmission={0.7}
            thickness={1}
            emissive="#8b5cf6"
            emissiveIntensity={0.35}
            clearcoat={1}
            clearcoatRoughness={0.05}
            ior={2.4}
          />
        </mesh>
      )}

      {type === "diamond" && (
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshPhysicalMaterial
            color="#a855f7"
            transparent
            opacity={0.95}
            metalness={0.2}
            roughness={0.1}
            transmission={0.5}
            thickness={0.6}
            emissive="#a855f7"
            emissiveIntensity={0.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
            reflectivity={1}
            ior={2.5}
          />
        </mesh>
      )}

      {/* 💎 Nouveau : Prisme de Cristal Violet/Rose */}
      {type === "crystal" && <CrystalPrism />}

      {/* ✨ Nouveau : Étincelles Cyan/Indigo */}
      {type === "sparkles" && <SparklesShape />}
    </group>
  )
}

