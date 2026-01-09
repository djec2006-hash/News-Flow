"use client"

import GuideLayout from "@/components/help/GuideLayout"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ComprendrePlansPage() {
  return (
    <GuideLayout title="Comprendre les plans">
      <div className="space-y-8">
        {/* Introduction */}
        <div className="text-lg text-zinc-300 leading-relaxed">
          <p>
            NewsFlow propose trois plans adaptés à vos besoins. Choisissez celui qui correspond le mieux 
            à votre utilisation et à vos objectifs. Vous pouvez changer de plan à tout moment.
          </p>
        </div>

        {/* Plan Free */}
        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-zinc-800">
                <TrendingUp className="h-6 w-6 text-zinc-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">Plan Free</h3>
              <span className="ml-auto text-2xl font-bold text-zinc-300">0€</span>
            </div>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Parfait pour découvrir NewsFlow et tester les fonctionnalités de base.
            </p>
            <ul className="space-y-2 text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-zinc-500 mt-0.5 shrink-0" />
                <span>2 Flows par semaine</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-zinc-500 mt-0.5 shrink-0" />
                <span>2 projets actifs maximum</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-zinc-500 mt-0.5 shrink-0" />
                <span>Accès Dashboard web</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-zinc-500 mt-0.5 shrink-0" />
                <span>Lecture en ligne uniquement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-5 w-5 mt-0.5 shrink-0 text-zinc-600">❌</span>
                <span>Pas d'envoi par email</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Plan Basic */}
        <Card className="border-cyan-500/30 bg-cyan-500/5 backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Plan Basic</h3>
              <span className="ml-auto text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">9,90€</span>
            </div>
            <p className="text-zinc-300 leading-relaxed mb-4">
              L'essentiel pour rester informé avec les fonctionnalités de base.
            </p>
            <ul className="space-y-2 text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                <span>5 Flows par semaine</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                <span>5 projets actifs maximum</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                <span>✅ Envoi par email (PDF/HTML)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                <span>Export PDF basique</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                <span>Support standard</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Plan Pro */}
        <Card className="border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-purple-500/10 backdrop-blur-xl">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-purple-500">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Plan Pro</h3>
              <span className="ml-auto text-2xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-purple-400 bg-clip-text text-transparent">16,90€</span>
            </div>
            <p className="text-zinc-300 leading-relaxed mb-4">
              Pour les power users exigeants qui veulent le maximum de fonctionnalités.
            </p>
            <ul className="space-y-2 text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                <span>15 Flows par semaine</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                <span>15 projets actifs maximum</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                <span>✅ Envoi par email (PDF/HTML)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                <span>🚀 Modèles IA avancés (Deep Search)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                <span>Export PDF illimité</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                <span>🎯 Support prioritaire</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                <span>Génération multiple par jour</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="border-white/10 bg-zinc-900/50 backdrop-blur-xl">
          <CardContent className="p-6 text-center space-y-4">
            <h3 className="text-xl font-bold text-white">Prêt à upgrader ?</h3>
            <p className="text-zinc-300">
              Changez de plan à tout moment. Les modifications prennent effet immédiatement.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            >
              <Link href="/pricing">Voir les tarifs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </GuideLayout>
  )
}








