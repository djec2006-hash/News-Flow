"use client"

import { useRef, useMemo } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import * as THREE from "three"

export default function NewsGlobe() {
  const globeGroupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const markersRef = useRef<THREE.Points>(null)

  const radius = 2

  // Charger la texture de masque de la Terre (landmask) pour détection précise terre/océan
  // La texture specular a un meilleur contraste : terre claire, océan sombre
  const earthTexture = useLoader(
    THREE.TextureLoader,
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg"
  )

  // Générer les points du globe par échantillonnage de la texture landmask
  const { globeGeometry, landPositions } = useMemo(() => {
    // Grille légèrement augmentée (~10%) : 277 méridiens x 140 parallèles = 38,780 points candidats
    // Environ 9k-11k points valides sur les terres (30-45% de la surface)
    const widthSegments = 277  // Méridiens (longitude) - Augmenté de 252 à 277 (+10%)
    const heightSegments = 140  // Parallèles (latitude) - Augmenté de 127 à 140 (+10%)

    const positions: number[] = []

    // Créer un canvas temporaire pour lire les pixels de la texture
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    
    if (!ctx || !earthTexture.image) {
      // Fallback si texture pas encore chargée
      const emptyGeometry = new THREE.BufferGeometry()
      emptyGeometry.setAttribute("position", new THREE.Float32BufferAttribute([], 3))
      return { globeGeometry: emptyGeometry, landPositions: [] }
    }

    canvas.width = earthTexture.image.width
    canvas.height = earthTexture.image.height
    ctx.drawImage(earthTexture.image, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    // Échantillonnage de la grille sphérique
    for (let lat = 0; lat < heightSegments; lat++) {
      for (let lon = 0; lon < widthSegments; lon++) {
        // Conversion en latitude/longitude réelles
        // phi : 0 (pôle nord) à π (pôle sud)
        // theta : 0 à 2π (longitude, Greenwich à 0)
        const phi = (lat / heightSegments) * Math.PI
        const theta = (lon / widthSegments) * Math.PI * 2

        // Conversion en coordonnées UV pour la texture équirectangulaire
        // U (longitude) : 0 à 1, correspondant à -180° à +180°
        // V (latitude) : 0 à 1, correspondant à +90° (nord) à -90° (sud)
        const u = theta / (Math.PI * 2)
        const v = phi / Math.PI
        
        // Conversion en coordonnées pixel avec clamping
        const imgX = Math.max(0, Math.min(canvas.width - 1, Math.floor(u * canvas.width)))
        const imgY = Math.max(0, Math.min(canvas.height - 1, Math.floor(v * canvas.height)))
        
        // Lire le pixel (format RGBA, 4 bytes par pixel)
        const pixelIndex = (imgY * canvas.width + imgX) * 4
        const r = imageData.data[pixelIndex]
        const g = imageData.data[pixelIndex + 1]
        const b = imageData.data[pixelIndex + 2]
        
        // Détection terre vs océan basée sur la luminosité
        // Dans cette texture specular : océan = clair (hautes réflexions), terre = sombre (faibles réflexions)
        const brightness = (r + g + b) / 3
        
        // Seuil de luminosité pour distinguer terre (sombre) de océan (clair)
        // On ajoute un point uniquement si la luminosité est INFÉRIEURE au seuil (zones sombres = continents)
        const isLand = brightness < 70
        
        if (isLand) {
          // Calcul de la position 3D sur la sphère (coordonnées cartésiennes)
          const x = radius * Math.sin(phi) * Math.cos(theta)
          const y = radius * Math.cos(phi)
          const z = radius * Math.sin(phi) * Math.sin(theta)
          
          positions.push(x, y, z)
        }
      }
    }

    // Créer la géométrie avec les positions
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))

    // Retourner aussi les positions pour les marqueurs rouges
    return { globeGeometry: geometry, landPositions: positions }
  }, [earthTexture])

  // Générer les marqueurs rouges en piochant parmi les positions des points bleus (continents)
  const markersGeometry = useMemo(() => {
    const markerCount = 25 // Nombre de marqueurs rouges (20-30)
    const markerPositions: number[] = []

    // Si on n'a pas encore de positions de continents, retourner une géométrie vide
    if (!landPositions || landPositions.length === 0) {
      const emptyGeometry = new THREE.BufferGeometry()
      emptyGeometry.setAttribute("position", new THREE.Float32BufferAttribute([], 3))
      return emptyGeometry
    }

    // Convertir le tableau plat en tableau de triplets [x, y, z]
    const positionsArray: [number, number, number][] = []
    for (let i = 0; i < landPositions.length; i += 3) {
      positionsArray.push([landPositions[i], landPositions[i + 1], landPositions[i + 2]])
    }

    // Sélectionner aléatoirement markerCount positions parmi les positions des continents
    const selectedIndices = new Set<number>()
    while (selectedIndices.size < markerCount && selectedIndices.size < positionsArray.length) {
      const randomIndex = Math.floor(Math.random() * positionsArray.length)
      selectedIndices.add(randomIndex)
    }

    // Ajouter les positions sélectionnées au tableau des marqueurs
    selectedIndices.forEach((index) => {
      const [x, y, z] = positionsArray[index]
      markerPositions.push(x, y, z)
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(markerPositions, 3))
    return geometry
  }, [landPositions])


  // Animation : rotation douce et continue du globe
  useFrame(() => {
    if (globeGroupRef.current) {
      // Rotation lente et continue
      globeGroupRef.current.rotation.y += 0.0008
    }
  })

  return (
    <group ref={globeGroupRef} position={[0, 0.15, 0]}>
      {/* Lumières */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#6366f1" />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#4f46e5" />

      {/* Sphère intérieure noire (masque les points de l'autre côté) */}
      <mesh>
        <sphereGeometry args={[radius - 0.05, 64, 64]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.95} side={THREE.BackSide} />
      </mesh>

      {/* Globe principal (points continents basés sur texture landmask) */}
      <points ref={pointsRef} geometry={globeGeometry}>
        <pointsMaterial
          attach="material"
          color="#38bdf8"  // Bleu Ciel (Sky-400)
          size={0.025}
          transparent
          opacity={0.85}
          sizeAttenuation={true}
        />
      </points>

      {/* Marqueurs rouges d'alerte (points aléatoires) */}
      <points ref={markersRef}>
        <bufferGeometry attach="geometry" {...markersGeometry} />
        <pointsMaterial
          attach="material"
          color="#ff3300"  // Rouge vif
          size={0.035}
          transparent
          opacity={1.0}
          sizeAttenuation={true}
        />
      </points>

      {/* Halo atmosphérique (glow externe bleuté) */}
      <mesh scale={1.12}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          color="#4f46e5"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Grille équatoriale subtile (référence visuelle) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.01, radius + 0.01, 64]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
