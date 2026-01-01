"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, type Variants } from "framer-motion"
import Navbar from "@/components/layout/navbar"
import { Copy, Check, Key, Code, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Variants pour animations
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// Composant CodeBlock avec bouton copier
function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast({
        title: "Copié !",
        description: "Le code a été copié dans le presse-papiers",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="relative group">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-3 text-xs text-zinc-400 hover:text-white hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Copié
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              Copier
            </>
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-white/10 bg-zinc-900 p-6 font-mono text-sm text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// Composant EndpointCard
function EndpointCard({
  method,
  path,
  description,
  exampleCode,
  exampleResponse,
}: {
  method: string
  path: string
  description: string
  exampleCode: string
  exampleResponse?: string
}) {
  const methodColors: Record<string, string> = {
    GET: "bg-green-500/20 text-green-400 border-green-500/30",
    POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <motion.div
      variants={fadeInUp}
      className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-6"
    >
      <div className="flex items-start gap-4">
        <span
          className={`px-3 py-1 rounded-md text-xs font-bold font-mono border ${methodColors[method] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"}`}
        >
          {method}
        </span>
        <code className="flex-1 font-mono text-lg text-white">{path}</code>
      </div>
      
      <p className="text-zinc-400 leading-relaxed">{description}</p>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Exemple de requête</h4>
        <CodeBlock code={exampleCode} language="bash" />
      </div>

      {exampleResponse && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Exemple de réponse</h4>
          <CodeBlock code={exampleResponse} language="json" />
        </div>
      )}
    </motion.div>
  )
}

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      
      <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background gradient subtle */}
        <div className="fixed inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950 to-indigo-950/20 pointer-events-none" />

        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                NewsFlow API
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-zinc-400 max-w-2xl mx-auto mb-8"
            >
              Intégrez nos flux d'intelligence financière directement dans vos applications.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 hover:shadow-lg hover:shadow-purple-500/50 transition-all rounded-full px-8 py-6 text-lg"
              >
                <Link href="/dashboard/settings">
                  <Key className="mr-2 h-5 w-5" />
                  Obtenir une clé API
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Section Authentication */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30">
                <Key className="h-5 w-5 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Authentication</h2>
            </motion.div>
            
            <motion.p
              variants={fadeInUp}
              className="text-zinc-400 mb-6 leading-relaxed text-lg"
            >
              L'API utilise des clés API Bearer pour l'authentification. Incluez votre clé API dans l'en-tête <code className="px-1.5 py-0.5 rounded bg-zinc-900 text-indigo-400 font-mono text-sm">Authorization</code> de chaque requête.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <CodeBlock
                code={`curl -X GET https://api.newsflow.io/v1/flows \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                language="bash"
              />
            </motion.div>
          </motion.section>

          {/* Section Endpoints */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <Code className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Endpoints</h2>
            </motion.div>

            <div className="space-y-8">
              {/* Endpoint 1: GET /v1/flows */}
              <EndpointCard
                method="GET"
                path="/v1/flows"
                description="Récupère les derniers flows générés par votre compte. Les flows sont triés par date de création (plus récents en premier)."
                exampleCode={`curl -X GET https://api.newsflow.io/v1/flows \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
                exampleResponse={`{
  "data": [
    {
      "id": "flow_123abc",
      "title": "Marchés Asiatiques - Analyse Matinale",
      "summary": "Tendance haussière sur le Nikkei 225 avec une hausse de 2.3% en séance. Le yen se stabilise face au dollar après les déclarations de la BoJ.",
      "sentiment": "bullish",
      "created_at": "2024-02-15T08:30:00Z",
      "sources_count": 12,
      "topics": ["Forex", "Actions", "Asie"]
    },
    {
      "id": "flow_456def",
      "title": "Crypto - Volatilité Bitcoin",
      "summary": "Bitcoin franchit la barre des 45,000$ avec un volume de trading en hausse de 15%. Les analystes anticipent une consolidation.",
      "sentiment": "neutral",
      "created_at": "2024-02-15T07:15:00Z",
      "sources_count": 8,
      "topics": ["Crypto", "Bitcoin"]
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "per_page": 10
  }
}`}
              />

              {/* Endpoint 2: POST /v1/analyze */}
              <EndpointCard
                method="POST"
                path="/v1/analyze"
                description="Lance une analyse en temps réel sur un sujet spécifique. L'API collecte les informations les plus récentes, les analyse et génère un rapport structuré."
                exampleCode={`curl -X POST https://api.newsflow.io/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "Impact de la Fed sur les marchés crypto",
    "sources": ["news", "analysis", "social"],
    "depth": "standard"
  }'`}
                exampleResponse={`{
  "id": "analysis_789ghi",
  "status": "processing",
  "query": "Impact de la Fed sur les marchés crypto",
  "created_at": "2024-02-15T09:00:00Z",
  "estimated_completion": "2024-02-15T09:05:00Z"
}

// Une fois l'analyse terminée, récupérez le résultat avec GET /v1/analyze/{id}`}
              />

              {/* Endpoint 3: GET /v1/analyze/{id} */}
              <EndpointCard
                method="GET"
                path="/v1/analyze/{id}"
                description="Récupère le résultat d'une analyse précédemment lancée. Utilisez cet endpoint pour vérifier le statut et obtenir le rapport final."
                exampleCode={`curl -X GET https://api.newsflow.io/v1/analyze/analysis_789ghi \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                exampleResponse={`{
  "id": "analysis_789ghi",
  "status": "completed",
  "query": "Impact de la Fed sur les marchés crypto",
  "created_at": "2024-02-15T09:00:00Z",
  "completed_at": "2024-02-15T09:04:32Z",
  "result": {
    "summary": "Les déclarations de la Fed concernant les taux d'intérêt ont un impact significatif sur les cryptomonnaies...",
    "key_points": [
      "Corrélation négative entre hausse des taux et prix Bitcoin",
      "Volatilité accrue dans les 24h suivant les annonces",
      "Impact différencié selon les altcoins"
    ],
    "sentiment": "bearish",
    "sources_analyzed": 45,
    "confidence_score": 0.87
  }
}`}
              />
            </div>
          </motion.section>

          {/* Section Rate Limits */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-lg bg-pink-500/20 border border-pink-500/30">
                <Zap className="h-5 w-5 text-pink-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Rate Limits</h2>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              className="text-zinc-400 mb-6 leading-relaxed text-lg"
            >
              Les limites de taux varient selon votre plan. Les limites sont appliquées par jour calendaire (UTC) et se réinitialisent à minuit.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                        Plan
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                        Requêtes par jour
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-300 uppercase tracking-wide">
                        Requêtes par minute
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-white font-semibold">Free</span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 font-mono">10</td>
                      <td className="px-6 py-4 text-zinc-400 font-mono">2</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-white font-semibold">Pro</span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 font-mono">1,000</td>
                      <td className="px-6 py-4 text-zinc-400 font-mono">60</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-white font-semibold">Enterprise</span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 font-mono">Illimité</td>
                      <td className="px-6 py-4 text-zinc-400 font-mono">300</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-6 p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/10"
            >
              <p className="text-sm text-yellow-300">
                <strong className="font-semibold">Note :</strong> Si vous dépassez votre limite, vous recevrez une réponse <code className="px-1.5 py-0.5 rounded bg-zinc-900 text-yellow-300 font-mono text-xs">429 Too Many Requests</code>. Les limites se réinitialisent automatiquement à minuit UTC.
              </p>
            </motion.div>
          </motion.section>

          {/* CTA Final */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center"
          >
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-12 backdrop-blur-sm">
              <h3 className="text-3xl font-bold mb-4 text-white">
                Prêt à intégrer NewsFlow ?
              </h3>
              <p className="text-zinc-400 mb-8 text-lg max-w-2xl mx-auto">
                Obtenez votre clé API et commencez à intégrer l'intelligence financière dans vos applications dès aujourd'hui.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 hover:shadow-lg hover:shadow-purple-500/50 transition-all rounded-full px-8 py-6 text-lg"
              >
                <Link href="/dashboard/settings">
                  <Key className="mr-2 h-5 w-5" />
                  Obtenir une clé API
                </Link>
              </Button>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}


