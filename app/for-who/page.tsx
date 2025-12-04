"use client"

import { useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform, useSpring, useVelocity, type Variants } from "framer-motion"
import Navbar from "@/components/layout/navbar"
import dynamic from "next/dynamic"

const Scene3DWrapper = dynamic(() => import("@/components/3d/Scene3DWrapper"), { ssr: false })
const TheNexus = dynamic(() => import("@/components/3d/TheNexus"), { ssr: false })
const ChaosToOrder = dynamic(() => import("@/components/3d/ChaosToOrder"), { ssr: false })
const MorphingCompass = dynamic(() => import("@/components/3d/MorphingCompass"), { ssr: false })
const TheUntangling = dynamic(() => import("@/components/3d/TheUntangling"), { ssr: false })

// Variants pour animations
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

export default function ForWhoPage() {
  // Refs pour sections
  const section2Ref = useRef<HTMLElement>(null)
  const section3Ref = useRef<HTMLElement>(null)
  const section4Ref = useRef<HTMLElement>(null)

  // Scroll progress pour chaque section
  const { scrollYProgress: scroll2 } = useScroll({
    target: section2Ref,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: scroll3 } = useScroll({
    target: section3Ref,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: scroll4 } = useScroll({
    target: section4Ref,
    offset: ["start end", "end end"],
  })

  // Velocity pour section 3
  const scrollYVelocity = useVelocity(scroll3)
  const smoothVelocity = useSpring(scrollYVelocity, { damping: 50, stiffness: 400 })

  // Transform scroll progress (0-1) pour animations
  const chaos2OrderProgress = useTransform(scroll2, [0.2, 0.8], [0, 1])
  const untanglingProgress = useTransform(scroll4, [0.1, 0.9], [0, 1])

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Texture de bruit subtile */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <Navbar />

      {/* SECTION 1 : HERO - L'UNIVERSALITÉ */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center space-y-8 mb-16"
          >
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Conçu pour l'expert.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Accessible à tous.
              </span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-zinc-400 max-w-4xl mx-auto font-light">
              La puissance d'une salle de marché, la clarté nécessaire pour comprendre le monde dès 14 ans.
            </motion.p>
          </motion.div>

          {/* The Nexus 3D - S'ouvre au scroll */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[500px] pointer-events-none"
          >
            {/* Spot lumineux de fond */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
            </div>
            <Scene3DWrapper cameraPosition={[0, 0, 3.5]}>
              <TheNexus scrollProgress={scroll2} />
            </Scene3DWrapper>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 : L'EXPERT FINANCIER - CHAOS → ORDRE */}
      <section ref={section2Ref} className="relative py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Texte à gauche */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.div variants={fadeInUp} className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
                Pour le Professionnel Exigeant
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white">
                Dompter le chaos
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-zinc-400 leading-relaxed">
                Transformez le bruit des marchés en signaux faibles exploitables avant l'ouverture. Gain de temps critique.
              </motion.p>
              <motion.ul variants={staggerContainer} className="space-y-4 pt-4">
                <motion.li variants={fadeInUp} className="flex items-start gap-3 text-zinc-300">
                  <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                  </div>
                  <span>Information avant le marché, quand ça compte</span>
                </motion.li>
                <motion.li variants={fadeInUp} className="flex items-start gap-3 text-zinc-300">
                  <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                  </div>
                  <span>Détection de signaux faibles avant vos concurrents</span>
                </motion.li>
                <motion.li variants={fadeInUp} className="flex items-start gap-3 text-zinc-300">
                  <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                  </div>
                  <span>Économisez 2-3 heures de veille par jour</span>
                </motion.li>
              </motion.ul>
            </motion.div>

            {/* Chaos → Ordre 3D à droite */}
            <div className="relative h-[500px] pointer-events-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
              </div>
              <Scene3DWrapper cameraPosition={[0, 0, 4]}>
                <ChaosToOrder scrollProgress={chaos2OrderProgress} />
              </Scene3DWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 : LE STRATÈGE - MORPHING COMPASS */}
      <section ref={section3Ref} className="relative py-32 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Morphing Compass 3D à gauche */}
            <div className="relative h-[500px] pointer-events-none order-2 md:order-1">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
              </div>
              <Scene3DWrapper cameraPosition={[0, 0, 3]}>
                <MorphingCompass scrollProgress={scroll3} scrollVelocity={smoothVelocity} />
              </Scene3DWrapper>
            </div>

            {/* Texte à droite */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
              className="space-y-6 order-1 md:order-2"
            >
              <motion.div variants={fadeInUp} className="inline-block px-4 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
                Pour le Visionnaire
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white">
                La vue d'ensemble
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-xl text-zinc-400 leading-relaxed">
                Connectez les points entre géopolitique, tech et énergie. Une veille transversale pour anticiper les shifts majeurs.
              </motion.p>
              <motion.ul variants={staggerContainer} className="space-y-4 pt-4">
                <motion.li variants={fadeInUp} className="flex items-start gap-3 text-zinc-300">
                  <div className="h-6 w-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                  </div>
                  <span>Vision macro sur tous les secteurs stratégiques</span>
                </motion.li>
                <motion.li variants={fadeInUp} className="flex items-start gap-3 text-zinc-300">
                  <div className="h-6 w-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                  </div>
                  <span>Identifiez les inflexions avant qu'elles ne deviennent évidentes</span>
                </motion.li>
                <motion.li variants={fadeInUp} className="flex items-start gap-3 text-zinc-300">
                  <div className="h-6 w-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                  </div>
                  <span>Prenez des décisions stratégiques éclairées, rapidement</span>
                </motion.li>
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 4 : L'ÉTUDIANT - THE UNTANGLING (WOW FINAL) */}
      <section ref={section4Ref} className="relative py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center space-y-8 mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-block px-4 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium">
              Pour le Curieux & l'Étudiant
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-white">
              Si clair, même à 14 ans
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light">
              Notre IA ne "dumb down" pas, elle clarifie. Comprendre les vrais enjeux mondiaux sans le jargon inaccessible.
            </motion.p>
          </motion.div>

          {/* The Untangling 3D - Le nœud se dénoue */}
          <div className="relative h-[600px] pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-3xl" />
            </div>
            <Scene3DWrapper cameraPosition={[0, 0, 3]}>
              <TheUntangling scrollProgress={untanglingProgress} />
            </Scene3DWrapper>
          </div>

          {/* Texte explicatif */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center space-y-6 mt-16"
          >
            <motion.p variants={fadeInUp} className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              NewsFlow adapte sa complexité à votre niveau. Du collégien qui découvre l'économie au doctorant en géopolitique.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-lg text-zinc-500 max-w-xl mx-auto italic">
              "Scrollez pour voir le nœud se dénouer — c'est exactement ce que fait NewsFlow avec l'information."
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-white">
              Quel que soit votre profil,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                NewsFlow s'adapte à vous
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Rejoignez des milliers de professionnels et de curieux qui ont repris le contrôle de leur veille.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-300 px-8 py-6 text-lg rounded-xl"
              >
                <Link href="/signup">Commencer gratuitement</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
              >
                <Link href="/features">Découvrir les fonctionnalités</Link>
              </Button>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-sm text-zinc-500">
              Sans carte bancaire • Personnalisation en 2 minutes
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
