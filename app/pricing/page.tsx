"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, TrendingUp, Shield, MousePointerClick } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import Navbar from "@/components/layout/navbar"

// Variants pour animations
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
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
      delayChildren: 0.3,
    },
  },
}

const plans = [
  {
    name: "Free",
    tagline: "Pour découvrir",
    price: "0",
    period: "Gratuit",
    description: "Testez NewsFlow gratuitement",
    features: [
      "2 Flows par semaine",
      "2 projets actifs maximum",
      "Accès Dashboard web",
      "Lecture en ligne uniquement",
      "❌ Pas d'envoi par email",
    ],
    cta: "Commencer gratuitement",
    href: "/signup",
    highlighted: false,
    planId: "free",
    badgeText: null,
    cardStyle: "border-white/5 bg-zinc-900/30", // Sobre, grise
  },
  {
    name: "Basic",
    tagline: "L'essentiel",
    price: "9,90",
    period: "par mois",
    description: "Parfait pour rester informé",
    features: [
      "5 Flows par semaine",
      "5 projets actifs maximum",
      "Accès Dashboard web",
      "✅ Envoi par email (PDF/HTML)",
      "Export PDF basique",
      "Support standard",
    ],
    cta: "Passer à Basic",
    href: "/signup?plan=basic",
    highlighted: true,
    planId: "basic",
    badgeText: "Populaire",
    cardStyle: "border-cyan-500/30 bg-cyan-500/5", // Bleu/Cyan
  },
  {
    name: "Pro",
    tagline: "Power User",
    price: "16,90",
    period: "par mois",
    description: "Pour les utilisateurs exigeants",
    features: [
      "15 Flows par semaine",
      "15 projets actifs maximum",
      "Accès Dashboard web",
      "✅ Envoi par email (PDF/HTML)",
      "🚀 Modèles IA avancés (Deep Search)",
      "Export PDF illimité",
      "🎯 Support prioritaire",
      "Génération multiple par jour",
    ],
    cta: "Passer à Pro",
    href: "/signup?plan=pro",
    highlighted: false,
    planId: "pro",
    badgeText: "Best Value",
    cardStyle: "border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-purple-500/10", // Or/Violet brillant
  },
]

const faqs = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer: "Absolument. Vous pouvez upgrader, downgrader ou annuler votre abonnement à tout instant. Les changements prennent effet immédiatement.",
  },
  {
    question: "Quelle est votre politique de remboursement ?",
    answer: "Nous offrons une garantie satisfait ou remboursé de 14 jours, sans condition. Si NewsFlow ne vous convient pas, contactez-nous pour un remboursement intégral.",
  },
  {
    question: "Comment fonctionne la personnalisation ?",
    answer: "Lors de votre onboarding, vous définissez vos centres d'intérêt, votre niveau de complexité préféré et votre langue. Notre IA adapte ensuite chaque Flow à votre profil.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Vos données sont chiffrées de bout en bout. Nous ne vendons jamais vos informations et respectons strictement le RGPD. Vous pouvez exporter ou supprimer vos données à tout moment.",
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* SECTION 1 : HERO - L'INVESTISSEMENT */}
      <section className="relative pt-32 pb-32 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Titre principal */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight tracking-tight">
              Un investissement sur votre
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                atout le plus précieux
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto font-light">
              Des briefings de qualité institutionnelle, pour le prix d'un déjeuner par mois.
            </p>

            {/* Arguments de vente (badges) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-zinc-300">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                <span>Rentabilité immédiate</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-zinc-300">
                <Shield className="h-4 w-4 text-indigo-400" />
                <span>Garantie Satisfait ou Remboursé</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-zinc-300">
                <MousePointerClick className="h-4 w-4 text-indigo-400" />
                <span>Annulation en 1 clic</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 : LES PLANS - L'ÉLÉGANCE */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 items-center"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                variants={fadeInUp}
                className={`relative group ${plan.highlighted ? "md:scale-105" : ""}`}
              >
                {/* Carte */}
                <div
                  className={`relative h-full rounded-3xl p-8 backdrop-blur-xl border ${plan.cardStyle} transition-all duration-500 hover:border-white/20`}
                >
                  {/* Badge dynamique */}
                  {plan.badgeText && (
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-medium ${
                      plan.planId === 'basic' 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}>
                      {plan.badgeText}
                    </div>
                  )}

                  {/* Glow effect pour carte Pro */}
                  {plan.planId === 'pro' && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500 rounded-3xl blur-xl opacity-15 group-hover:opacity-25 transition-opacity duration-500" />
                  )}
                  
                  {/* Glow effect pour carte Basic */}
                  {plan.planId === 'basic' && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
                  )}

                  {/* Contenu */}
                  <div className="relative z-10 space-y-6">
                    {/* Header */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                      <p className="text-sm text-zinc-500 uppercase tracking-wider">{plan.tagline}</p>
                    </div>

                    {/* Prix */}
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold text-white">{plan.price}€</span>
                        <span className="text-lg text-zinc-400">{plan.period}</span>
                      </div>
                      <p className="text-sm text-zinc-500">{plan.description}</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 py-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-zinc-300">
                          <Check className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button
                      asChild
                      className={`w-full py-6 text-base font-semibold rounded-xl transition-all duration-300 ${
                        plan.planId === 'basic'
                          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/50"
                          : plan.planId === 'pro'
                          ? "bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500 text-white hover:shadow-lg hover:shadow-amber-500/50"
                          : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <Link href={plan.href}>{plan.cta}</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 : VALEUR AJOUTÉE - POURQUOI NOUS ? */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">L'avantage NewsFlow</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">La clarté cognitive au service de vos décisions</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-12"
          >
            {/* Col 1 : Zéro Bruit */}
            <motion.div variants={fadeInUp} className="text-center space-y-6">
              <div className="relative h-32 flex items-center justify-center">
                <div className="relative">
                  {/* Sphère lisse centrale */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30" />
                  {/* Particules repoussées */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-zinc-600 opacity-30"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `translate(-50%, -50%) translate(${Math.cos((angle * Math.PI) / 180) * 60}px, ${Math.sin((angle * Math.PI) / 180) * 60}px)`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">Zéro Bruit</h3>
              <p className="text-zinc-400 leading-relaxed">
                Nous filtrons 99% du bruit informationnel pour ne garder que le signal essentiel à vos décisions.
              </p>
            </motion.div>

            {/* Col 2 : Vitesse Institutionnelle */}
            <motion.div variants={fadeInUp} className="text-center space-y-6">
              <div className="relative h-32 flex items-center justify-center">
                {/* Éclair stylisé */}
                <svg viewBox="0 0 100 100" className="w-20 h-20">
                  <defs>
                    <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M50 10 L30 45 L45 45 L35 90 L70 50 L55 50 Z"
                    fill="url(#lightning-gradient)"
                    stroke="#6366f1"
                    strokeWidth="1"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Vitesse Institutionnelle</h3>
              <p className="text-zinc-400 leading-relaxed">
                L'information avant qu'elle ne devienne mainstream. Soyez en avance, toujours.
              </p>
            </motion.div>

            {/* Col 3 : Synthèse Intelligente */}
            <motion.div variants={fadeInUp} className="text-center space-y-6">
              <div className="relative h-32 flex items-center justify-center">
                {/* Blocs qui fusionnent */}
                <div className="relative">
                  <div className="absolute top-0 left-0 w-8 h-8 bg-zinc-700/50 border border-zinc-600 rounded-sm opacity-60" />
                  <div className="absolute top-0 right-0 w-8 h-8 bg-zinc-700/50 border border-zinc-600 rounded-sm opacity-60" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 bg-zinc-700/50 border border-zinc-600 rounded-sm opacity-60" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-zinc-700/50 border border-zinc-600 rounded-sm opacity-60" />
                  {/* Diamant central */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rotate-45 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 backdrop-blur-sm border border-indigo-500/50" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">Synthèse Intelligente</h3>
              <p className="text-zinc-400 leading-relaxed">
                Des heures de lecture condensées en minutes. L'essentiel, rien que l'essentiel.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 : FAQ & CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          {/* FAQ */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Questions fréquentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-zinc-900/30 backdrop-blur-sm border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span className="text-lg font-medium text-white pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-zinc-400 shrink-0 transition-transform duration-300 ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? "max-h-48" : "max-h-0"
                    }`}
                  >
                    <p className="px-6 pb-5 text-zinc-400 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Final */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInUp}
            className="text-center space-y-6 py-12"
          >
            <h3 className="text-2xl font-bold text-white">Prêt à reprendre le contrôle de votre veille ?</h3>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Rejoignez les professionnels qui ont choisi la clarté plutôt que le chaos.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-300 px-8 py-6 text-lg rounded-xl"
            >
              <Link href="/signup">Commencer gratuitement</Link>
            </Button>
            <p className="text-sm text-zinc-500">Sans carte bancaire • Annulation à tout moment</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
