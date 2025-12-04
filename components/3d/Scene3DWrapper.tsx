"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera } from "@react-three/drei"

type Scene3DWrapperProps = {
  children: React.ReactNode
  cameraPosition?: [number, number, number]
}

// Composant de fallback pendant le chargement
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#4338ca" wireframe />
    </mesh>
  )
}

export default function Scene3DWrapper({
  children,
  cameraPosition = [0, 0, 5],
}: Scene3DWrapperProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{
        background: "transparent",
        pointerEvents: "none", // CRUCIAL : souris passe à travers
      }}
      className="pointer-events-none"
    >
      <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />

      {/* Contenu 3D avec Suspense - AUCUN contrôle utilisateur */}
      <Suspense fallback={<LoadingFallback />}>{children}</Suspense>

      {/* Fog pour la profondeur */}
      <fog attach="fog" args={["#09090b", 8, 25]} />
    </Canvas>
  )
}

