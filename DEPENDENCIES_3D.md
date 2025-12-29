# Dépendances 3D pour NewsFlow

## Installation requise

Pour que les composants 3D fonctionnent correctement, vous devez installer les packages suivants :

```bash
npm install three @react-three/fiber @react-three/drei
```

ou avec yarn :

```bash
yarn add three @react-three/fiber @react-three/drei
```

ou avec pnpm :

```bash
pnpm add three @react-three/fiber @react-three/drei
```

## Packages installés

- **three** (^0.160.0+) : Bibliothèque WebGL pour créer des scènes 3D
- **@react-three/fiber** (^8.15.0+) : Renderer React pour Three.js
- **@react-three/drei** (^9.95.0+) : Helpers et abstractions utiles pour R3F

## Composants 3D créés

### 1. NeuralBrain (Section IA)
- **Fichier** : `components/3d/features/NeuralBrain.tsx`
- **Description** : Réseau neuronal 3D avec 20 nœuds interconnectés
- **Animations** : Rotation automatique + pulse des connexions
- **Métaphore** : Le cerveau de NewsFlow qui traite l'information

### 2. ModularCube (Section Personnalisation)
- **Fichier** : `components/3d/features/ModularCube.tsx`
- **Description** : Grille de 125 petits cubes (5x5x5) en verre dépoli
- **Animations** : Rotation globale + oscillation individuelle + effet de détachement/reformation
- **Métaphore** : L'utilisateur qui construit son Flow sur mesure

### 3. SpeedStream (Section Lecture/Gain de Temps)
- **Fichier** : `components/3d/features/SpeedStream.tsx`
- **Description** : 200 particules filant vers la caméra (effet lightspeed)
- **Animations** : Particules qui accélèrent + tunnel rotatif + trails lumineux
- **Métaphore** : L'information qui arrive vite et épurée

### 4. TrustShield (Section Sources & Fiabilité)
- **Fichier** : `components/3d/features/TrustShield.tsx`
- **Description** : Bouclier hexagonal en verre + cadenas métallique
- **Animations** : Rotation lente + flottement + orbites de sécurité
- **Métaphore** : La sécurité et la vérification des sources

### 5. Scene3DWrapper (Composant utilitaire)
- **Fichier** : `components/3d/Scene3DWrapper.tsx`
- **Description** : Wrapper configuré pour Canvas Three.js
- **Features** : DPR adaptatif, antialiasing, OrbitControls, Suspense, Fog

## Configuration

Tous les composants sont configurés avec :
- `"use client"` pour le rendu côté client
- Chargement dynamique (`next/dynamic`) avec `ssr: false`
- Optimisation des performances (dpr, antialiasing, powerPreference)
- Fond transparent pour s'intégrer au design existant

## Performances

- **Mobile** : DPR 1x pour économiser les ressources
- **Desktop** : DPR 2x pour une netteté maximale
- **Anti-aliasing** : Activé pour des bords lisses
- **Fog** : Ajouté pour la profondeur visuelle

## Intégration

Les scènes 3D sont intégrées dans `app/features/page.tsx` :
- Section 1 (IA) : NeuralBrain
- Section 2 (Personnalisation) : ModularCube
- Section 3 (Lecture) : SpeedStream
- Section 4 (Fiabilité) : TrustShield

Chaque scène est enveloppée dans un conteneur de 400px de hauteur avec des gradients de fond assortis aux couleurs de la marque.










