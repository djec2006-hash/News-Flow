"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/layout/navbar"
import { Copy, Check, BookOpen, Key, Terminal, Database, Webhook } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Composant CodeBlock simple avec syntax highlighting
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

  // Syntax highlighting simple avec Tailwind
  const highlightCode = (code: string, lang: string) => {
    if (lang === "bash" || lang === "curl") {
      return code.split("\n").map((line, i) => {
        const elements: JSX.Element[] = []
        let remaining = line
        
        // curl command en cyan
        if (remaining.includes("curl")) {
          const curlIndex = remaining.indexOf("curl")
          if (curlIndex > 0) {
            elements.push(<span key="before-curl">{remaining.substring(0, curlIndex)}</span>)
          }
          elements.push(<span key="curl" className="text-cyan-400">curl</span>)
          remaining = remaining.substring(curlIndex + 4)
        }
        
        // -X GET/POST en purple
        const methodMatch = remaining.match(/^\s*(-X\s+\w+)/)
        if (methodMatch) {
          elements.push(<span key="method">{methodMatch[0]}</span>)
          remaining = remaining.substring(methodMatch[0].length)
        }
        
        // URL en vert
        const urlMatch = remaining.match(/(https?:\/\/[^\s\\]+)/)
        if (urlMatch) {
          const beforeUrl = remaining.substring(0, urlMatch.index || 0)
          if (beforeUrl) elements.push(<span key="before-url">{beforeUrl}</span>)
          elements.push(<span key="url" className="text-green-400">{urlMatch[0]}</span>)
          remaining = remaining.substring((urlMatch.index || 0) + urlMatch[0].length)
        }
        
        // -H headers
        if (remaining.includes("-H") || remaining.includes("Authorization")) {
          const headerMatch = remaining.match(/(-H\s+['"])([^'"]+)(['"])/)
          if (headerMatch) {
            const beforeHeader = remaining.substring(0, headerMatch.index || 0)
            if (beforeHeader) elements.push(<span key="before-header">{beforeHeader}</span>)
            elements.push(<span key="header-flag" className="text-purple-400">{headerMatch[1]}</span>)
            
            // Highlight Authorization et Bearer
            const headerValue = headerMatch[2]
            if (headerValue.includes("Authorization")) {
              const authParts = headerValue.split(/(Authorization:\s*Bearer\s+)(.+)/)
              if (authParts.length > 1) {
                elements.push(<span key="auth-key" className="text-cyan-400">{authParts[1]}</span>)
                elements.push(<span key="auth-value" className="text-yellow-400">{authParts[2] || ""}</span>)
              } else {
                elements.push(<span key="header-value" className="text-yellow-400">{headerValue}</span>)
              }
            } else {
              elements.push(<span key="header-value" className="text-yellow-400">{headerValue}</span>)
            }
            
            elements.push(<span key="header-quote">{headerMatch[3]}</span>)
            remaining = remaining.substring((headerMatch.index || 0) + headerMatch[0].length)
          }
        }
        
        if (remaining) elements.push(<span key="rest">{remaining}</span>)
        
        return <span key={i}>{elements.length > 0 ? elements : <span className="text-zinc-300">{line}</span>}</span>
      })
    }

    if (lang === "json") {
      return code.split("\n").map((line, i) => {
        // Échapper les caractères HTML
        const escaped = line
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
        
        // Keys en cyan
        let highlighted = escaped.replace(/"([^"]+)":/g, '<span class="text-cyan-400">"$1"</span>:')
        // Strings en vert
        highlighted = highlighted.replace(/:\s*"([^"]+)"/g, ': <span class="text-green-400">"$1"</span>')
        // Numbers en orange
        highlighted = highlighted.replace(/:\s*(\d+)/g, ': <span class="text-orange-400">$1</span>')
        // Braces en blanc
        highlighted = highlighted.replace(/([{}])/g, '<span class="text-white">$1</span>')
        // Brackets en blanc
        highlighted = highlighted.replace(/([\[\]])/g, '<span class="text-white">$1</span>')
        
        return <span key={i} dangerouslySetInnerHTML={{ __html: highlighted }} />
      })
    }

    return <span className="text-zinc-300">{code}</span>
  }

  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 px-3 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800"
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
      <pre className="overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-900 p-6 font-mono text-sm text-zinc-300 leading-relaxed">
        <code className="block whitespace-pre">{highlightCode(code, language)}</code>
      </pre>
    </div>
  )
}

export default function APIPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 font-mono text-white">
              NewsFlow API Documentation
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
              Intégrez nos flux financiers en quelques lignes de code.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-100 border-0 rounded-full px-8 py-6 text-lg font-medium"
            >
              <Link href="/docs">
                <BookOpen className="mr-2 h-5 w-5" />
                Lire la documentation
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gray-600 text-gray-200 hover:bg-gray-900 hover:text-white rounded-full px-8 py-6 text-lg font-medium"
            >
              <Link href="/dashboard/settings">
                <Key className="mr-2 h-5 w-5" />
                Obtenir ma clé API
              </Link>
            </Button>
          </div>

          {/* Section 1 : Authentification */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Colonne gauche - Explication */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                    <Key className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white font-mono">Authentification</h2>
                </div>
                <p className="text-lg text-gray-200 leading-relaxed">
                  Toutes les requêtes doivent inclure votre clé API dans le header <code className="px-2 py-1 rounded bg-zinc-900 text-cyan-400 font-mono text-sm">Authorization</code>.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Votre clé API est disponible dans les paramètres de votre compte. Elle commence par <code className="px-2 py-1 rounded bg-zinc-900 text-cyan-400 font-mono text-sm">nf_live_</code> pour les clés de production.
                </p>
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <p className="text-sm text-cyan-200">
                    <strong className="font-semibold text-white">Sécurité :</strong> Ne partagez jamais votre clé API publiquement. 
                    Utilisez des variables d'environnement pour la stocker en toute sécurité.
                  </p>
                </div>
              </div>

              {/* Colonne droite - Code */}
              <div className="sticky top-24">
                <CodeBlock
                  code={`curl -X GET https://api.newsflow.dev/v1/ping \\
  -H "Authorization: Bearer nf_live_sk_..."`}
                  language="bash"
                />
              </div>
            </div>
          </section>

          {/* Section 2 : Récupérer les Flows */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Colonne gauche - Explication */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <Database className="h-6 w-6 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white font-mono">Récupérer les Flows</h2>
                </div>
                <p className="text-lg text-gray-200 leading-relaxed">
                  Récupérez la liste de vos flux actifs avec leur score de pertinence.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  L'endpoint <code className="px-2 py-1 rounded bg-zinc-900 text-cyan-400 font-mono text-sm">GET /flows</code> retourne tous vos Flows avec leurs métadonnées complètes.
                </p>
                <div className="space-y-2 text-sm text-gray-300">
                  <p><strong className="text-white">Paramètres optionnels :</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><code className="text-cyan-400">?limit=10</code> - Limite le nombre de résultats</li>
                    <li><code className="text-cyan-400">?status=active</code> - Filtre par statut</li>
                    <li><code className="text-cyan-400">?category=Tech</code> - Filtre par catégorie</li>
                  </ul>
                </div>
              </div>

              {/* Colonne droite - Code */}
              <div className="sticky top-24">
                <CodeBlock
                  code={`{
  "data": [
    {
      "id": "flow_btc_2025",
      "name": "Crypto Watch",
      "status": "active",
      "last_updated": "2025-01-14T10:00:00Z"
    }
  ]
}`}
                  language="json"
                />
              </div>
            </div>
          </section>

          {/* Section 3 : Features */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-white font-mono">
              Ce que vous pouvez faire
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 hover:border-zinc-700 transition-colors">
                <div className="inline-flex p-3 rounded-lg bg-cyan-500/20 border border-cyan-500/30 mb-4">
                  <Database className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white font-mono">Flows structurés</h3>
                <p className="text-gray-300 leading-relaxed">
                  Accédez à vos Flows générés au format JSON. Chaque Flow contient un résumé structuré, 
                  les sources citées et les métadonnées complètes.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 hover:border-zinc-700 transition-colors">
                <div className="inline-flex p-3 rounded-lg bg-purple-500/20 border border-purple-500/30 mb-4">
                  <Terminal className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white font-mono">Deep Search</h3>
                <p className="text-gray-300 leading-relaxed">
                  Déclenchez des analyses approfondies par programme. Notre IA fouille des milliers de sources 
                  et génère des rapports complets sur demande.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 hover:border-zinc-700 transition-colors">
                <div className="inline-flex p-3 rounded-lg bg-pink-500/20 border border-pink-500/30 mb-4">
                  <Webhook className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white font-mono">Webhooks temps réel</h3>
                <p className="text-gray-300 leading-relaxed">
                  Recevez des notifications instantanées lorsque vos Flows sont générés. 
                  Intégrez NewsFlow dans vos workflows automatisés.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className="text-center">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-12">
              <h3 className="text-3xl font-bold mb-4 text-white font-mono">
                Prêt à intégrer ?
              </h3>
              <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
                Obtenez votre clé API et commencez à intégrer l'intelligence financière dans vos applications dès aujourd'hui.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-gray-100 border-0 rounded-full px-8 py-6 text-lg font-medium"
              >
                <Link href="/dashboard/settings">
                  <Key className="mr-2 h-5 w-5" />
                  Obtenir ma clé API
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
