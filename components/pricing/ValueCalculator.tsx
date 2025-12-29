"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Clock, DollarSign } from "lucide-react"

export default function ValueCalculator() {
  const [hourlyRate, setHourlyRate] = useState(50)
  const [savedHours, setSavedHours] = useState(4)
  const [monthlySavings, setMonthlySavings] = useState(0)

  useEffect(() => {
    const weeksPerMonth = 4
    const savings = hourlyRate * savedHours * weeksPerMonth
    setMonthlySavings(savings)
  }, [hourlyRate, savedHours])

  const roi = Math.round((monthlySavings / 29) * 100) // ROI basé sur le plan Pro à 29€

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-900/20 via-zinc-900/50 to-indigo-900/20 p-8 md:p-12">
      {/* Effet de glow */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 blur-3xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />

      <div className="space-y-8">
        {/* Titre */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-sm font-medium text-amber-300">
            <TrendingUp className="h-4 w-4" />
            Calculateur de ROI
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white">Calculez votre gain réel</h3>
          <p className="text-zinc-400">Ajustez les curseurs selon votre situation</p>
        </div>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Taux horaire */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-400" />
                Valeur de votre heure
              </label>
              <span className="text-2xl font-bold text-amber-400">{hourlyRate}€</span>
            </div>
            <input
              type="range"
              min="20"
              max="200"
              step="10"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>20€</span>
              <span>200€</span>
            </div>
          </div>

          {/* Heures économisées */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" />
                Heures gagnées / semaine
              </label>
              <span className="text-2xl font-bold text-indigo-400">{savedHours}h</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={savedHours}
              onChange={(e) => setSavedHours(Number(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-zinc-500">
              <span>1h</span>
              <span>20h</span>
            </div>
          </div>
        </div>

        {/* Résultat */}
        <motion.div
          key={monthlySavings}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-amber-500/50 bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-8 text-center"
        >
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-wider text-amber-200/80">Votre économie mensuelle</p>
            <motion.div
              key={`value-${monthlySavings}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent"
            >
              {monthlySavings.toLocaleString()}€
            </motion.div>
            <p className="text-sm text-zinc-300">
              NewsFlow coûte <span className="font-bold text-white">29€/mois</span>
            </p>
          </div>

          {/* ROI Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 px-6 py-3"
          >
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            <span className="text-lg font-bold text-emerald-400">ROI : +{roi}%</span>
          </motion.div>
        </motion.div>

        {/* Message de conclusion */}
        <p className="text-center text-sm text-zinc-400">
          Avec ces chiffres, NewsFlow se rembourse{" "}
          <span className="font-bold text-amber-400">{Math.round(monthlySavings / 29)}× par mois</span>. C'est un
          investissement, pas une dépense.
        </p>
      </div>
    </div>
  )
}










