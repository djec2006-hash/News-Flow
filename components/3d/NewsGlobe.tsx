"use client"

import { useRef, useMemo, useState, useEffect } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import * as THREE from "three"

type NewsAlert = {
  id: number
  city: string
  lat: number
  lon: number
  position: THREE.Vector3
  birthTime: number
  lifetime: number
}

// Grandes villes mondiales avec leurs coordonnées réelles
const WORLD_CITIES = [
  { city: "New York", lat: 40.7128, lon: -74.0060 },
  { city: "London", lat: 51.5074, lon: -0.1278 },
  { city: "Paris", lat: 48.8566, lon: 2.3522 },
  { city: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { city: "Hong Kong", lat: 22.3193, lon: 114.1694 },
  { city: "Singapore", lat: 1.3521, lon: 103.8198 },
  { city: "Dubai", lat: 25.2048, lon: 55.2708 },
  { city: "Sydney", lat: -33.8688, lon: 151.2093 },
  { city: "São Paulo", lat: -23.5505, lon: -46.6333 },
  { city: "Mexico City", lat: 19.4326, lon: -99.1332 },
  { city: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { city: "San Francisco", lat: 37.7749, lon: -122.4194 },
  { city: "Chicago", lat: 41.8781, lon: -87.6298 },
  { city: "Toronto", lat: 43.6532, lon: -79.3832 },
  { city: "Berlin", lat: 52.5200, lon: 13.4050 },
  { city: "Moscow", lat: 55.7558, lon: 37.6173 },
  { city: "Mumbai", lat: 19.0760, lon: 72.8777 },
  { city: "Beijing", lat: 39.9042, lon: 116.4074 },
  { city: "Seoul", lat: 37.5665, lon: 126.9780 },
  { city: "Istanbul", lat: 41.0082, lon: 28.9784 },
  { city: "Lagos", lat: 6.5244, lon: 3.3792 },
  { city: "Cairo", lat: 30.0444, lon: 31.2357 },
  { city: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
  { city: "Bangkok", lat: 13.7563, lon: 100.5018 },
  { city: "Jakarta", lat: -6.2088, lon: 106.8456 },
]

// Convertir coordonnées géographiques (lat, lon) en position 3D sur sphère
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

export default function NewsGlobe() {
  const globeGroupRef = useRef<THREE.Group>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const alertPointsRef = useRef<THREE.Points>(null)
  const [alerts, setAlerts] = useState<NewsAlert[]>([])
  const nextAlertId = useRef(0)

  const radius = 2

  // Charger la texture de la Terre (land/ocean mask)
  const earthTexture = useLoader(
    THREE.TextureLoader,
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"
  )

  // Générer les points du globe basés sur la texture
  const globeGeometry = useMemo(() => {
    // Ultra-haute résolution pour densité maximale de points
    const widthSegments = 360  // Doublé : 180 → 360
    const heightSegments = 180 // Doublé : 90 → 180
    const totalPoints = widthSegments * heightSegments // 64,800 points candidats

    const positions: number[] = []
    const colors: number[] = []

    // Créer un canvas pour lire les pixels de la texture
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    
    if (!ctx || !earthTexture.image) {
      // Fallback si texture pas encore chargée
      return new THREE.BufferGeometry()
    }

    canvas.width = earthTexture.image.width
    canvas.height = earthTexture.image.height
    ctx.drawImage(earthTexture.image, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (let lat = 0; lat < heightSegments; lat++) {
      for (let lon = 0; lon < widthSegments; lon++) {
        // Coordonnées sphériques
        const phi = (lat / heightSegments) * Math.PI
        const theta = (lon / widthSegments) * Math.PI * 2

        // Position 3D
        const x = radius * Math.sin(phi) * Math.cos(theta)
        const y = radius * Math.cos(phi)
        const z = radius * Math.sin(phi) * Math.sin(theta)

        // Lire la texture pour déterminer si c'est terre ou océan
        const u = lon / widthSegments
        const v = lat / heightSegments
        const imgX = Math.floor(u * canvas.width)
        const imgY = Math.floor(v * canvas.height)
        const pixelIndex = (imgY * canvas.width + imgX) * 4

        // Lire les canaux RGB
        const r = imageData.data[pixelIndex]
        const g = imageData.data[pixelIndex + 1]
        const b = imageData.data[pixelIndex + 2]
        
        // Calculer luminosité moyenne
        const brightness = (r + g + b) / 3
        
        // Détection terre vs océan :
        // Les océans sont généralement très sombres (noir/bleu foncé) dans les textures atmosphériques
        // Les terres sont claires (vert, brun, blanc pour neige)
        
        // Méthode 1 : Détection par luminosité (terres plus claires)
        const isLand = brightness > 50  // Seuil ajusté : terres > 50, océans < 50
        
        // Méthode 2 (alternative) : Détection par ratio couleur
        // Les océans ont souvent plus de bleu (b) que de rouge/vert
        // const isLand = (r + g) > b * 1.5
        
        if (isLand) {
          positions.push(x, y, z)
          
          // Couleur Cyan Électrique (#38bdf8 - Sky-400) avec variation selon luminosité
          const intensity = Math.max(0.7, brightness / 255) // 🔥 Intensité minimum augmentée : 0.6 → 0.7 pour plus de luminosité
          colors.push(0.22 * intensity, 0.74 * intensity, 0.97 * intensity) // #38bdf8 normalized
        }
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

    return geometry
  }, [earthTexture])

  // Système d'alertes géolocalisées
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now()

      // Nettoyer les alertes expirées
      setAlerts((prev) => prev.filter((alert) => currentTime - alert.birthTime < alert.lifetime))

      // Ajouter de nouvelles alertes si on en a moins de 8
      setAlerts((prev) => {
        if (prev.length < 8) {
          const newAlerts = []
          const alertsToAdd = Math.min(2, 8 - prev.length)

          for (let i = 0; i < alertsToAdd; i++) {
            // Choisir une ville aléatoire
            const city = WORLD_CITIES[Math.floor(Math.random() * WORLD_CITIES.length)]
            const position = latLonToVector3(city.lat, city.lon, radius) // 🔥 Exactement au niveau de la surface (pas au-dessus)

            newAlerts.push({
              id: nextAlertId.current++,
              city: city.city,
              lat: city.lat,
              lon: city.lon,
              position,
              birthTime: currentTime,
              lifetime: 3000 + Math.random() * 2000, // 3-5 secondes
            })
          }

          return [...prev, ...newAlerts]
        }
        return prev
      })
    }, 1200) // Nouvelle alerte toutes les 1.2s

    return () => clearInterval(interval)
  }, [])

  // Géométrie des alertes (mise à jour dynamique)
  const alertGeometry = useMemo(() => {
    const positions = new Float32Array(alerts.length * 3)
    alerts.forEach((alert, i) => {
      positions[i * 3] = alert.position.x
      positions[i * 3 + 1] = alert.position.y
      positions[i * 3 + 2] = alert.position.z
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [alerts])

  // Animation : rotation du globe et clignotement des alertes
  useFrame((state) => {
    if (globeGroupRef.current) {
      // Rotation lente et continue
      globeGroupRef.current.rotation.y += 0.0008
    }

    // Clignotement rapide des alertes (pulse accéléré)
    if (alertPointsRef.current && alertPointsRef.current.material instanceof THREE.PointsMaterial) {
      const time = state.clock.elapsedTime
      alertPointsRef.current.material.opacity = 0.7 + Math.sin(time * 5) * 0.3 // 🔥 Pulse plus rapide : time * 3 → time * 5 (0.4 - 1.0)
    }
  })

  return (
    <group ref={globeGroupRef}>
      {/* Lumières */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#6366f1" />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#4f46e5" />

      {/* Sphère intérieure noire (masque les points de l'autre côté) */}
      <mesh>
        <sphereGeometry args={[radius - 0.05, 64, 64]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.95} side={THREE.BackSide} />
      </mesh>

      {/* Globe principal (points continents basés sur texture) */}
      <points ref={pointsRef}>
        <bufferGeometry attach="geometry" {...globeGeometry} />
        <pointsMaterial
          attach="material"
          size={0.018}           // Augmenté : 0.015 → 0.018 (+20%)
          vertexColors
          transparent
          opacity={0.85}         // Légèrement plus opaque : 0.8 → 0.85
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Alertes news géolocalisées (micro-points rouges néon pulsants) */}
      {alerts.length > 0 && (
        <points ref={alertPointsRef}>
          <bufferGeometry attach="geometry" {...alertGeometry} />
          <pointsMaterial
            attach="material"
            color="#ef4444"        // Rouge néon
            size={0.015}           // 🔥 Drastiquement réduit : 0.04 → 0.015 (même taille que points bleus)
            transparent
            opacity={1.0}          // Opacité max pour briller fort
            sizeAttenuation={true}
            blending={THREE.AdditiveBlending}
            toneMapped={false}     // 🔥 Désactive tone mapping pour briller plus fort
          />
        </points>
      )}

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
