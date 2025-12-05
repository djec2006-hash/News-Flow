import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Groq from "groq-sdk"
import { tavily } from "@tavily/core"
import { checkFlowLimit } from "@/lib/usage-limits"

// 🔢 Config des longueurs de sections pour chaque projet
const lengthConfigs: Record<string, { label: string; minWords: number; maxWords: number }> = {
  very_short: {
    label: "Très court",
    minWords: 80,
    maxWords: 160,
  },
  short: {
    label: "Court",
    minWords: 180,
    maxWords: 260,
  },
  standard: {
    label: "Standard",
    minWords: 350,
    maxWords: 650,
  },
  very_detailed: {
    label: "Très détaillé",
    minWords: 900,
    maxWords: 1500,
  },
}

const domainLabels: Record<string, string> = {
  finance: "Finance & marchés",
  economics: "Économie & macro",
  geopolitics: "Géopolitique & conflits",
  politics_society: "Politique & société",
  tech_innovation: "Technologie & innovation",
  environment_climate: "Environnement & climat",
  health_science: "Santé & sciences",
  culture_media_sport: "Culture, médias & sport",
  other: "Autre",
}

// 🌐 Client Tavily (search web temps réel)
const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY || "",
})

// 🔑 Client Groq (initialisé une seule fois)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" })

// ═══════════════════════════════════════════════════════════════════════════════
// 🧠 AGENT D'ENRICHISSEMENT DES INSTRUCTIONS (Prompt Engineering Automatique)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Transforme une consigne utilisateur simple en prompt d'expert détaillé
 * Utilise Llama-3.1-8b-instant (modèle rapide) pour l'enrichissement
 * 
 * @param rawInstructions - La consigne brute de l'utilisateur (ex: "actus crypto")
 * @returns La version enrichie et professionnelle de la consigne
 */
async function enhanceUserInstructions(rawInstructions: string): Promise<string> {
  if (!rawInstructions || rawInstructions.trim().length === 0) {
    return ""
  }

  console.log("============================================")
  console.log("[NewsFlow] 🧠 INSTRUCTION ENHANCER - START")
  console.log("[NewsFlow] 📝 Input brut:", rawInstructions)
  console.log("============================================")

  try {
    const enhancementPrompt = `
Tu es un expert en Prompt Engineering spécialisé dans l'analyse d'actualité et financière de niveau Bloomberg Terminal.

Ta mission UNIQUE : Transformer la demande de l'utilisateur en une consigne d'analyse professionnelle et détaillée.

=== DEMANDE ORIGINALE DE L'UTILISATEUR ===
"${rawInstructions}"

=== TA TRANSFORMATION ===
Tu dois enrichir cette demande en ajoutant :

1. **Angles d'attaque précis** : Quels aspects spécifiques analyser ?
2. **Demandes de chiffres** : Quelles données quantifiées inclure ?
3. **Contexte temporel** : Quelle période couvrir ? (dernières 24-48h par défaut)
4. **Impacts à identifier** : Sur qui/quoi les événements ont-ils un impact ?
5. **Perspectives** : Quels scénarios à court terme envisager ?

=== RÈGLES STRICTES ===
- Réponds UNIQUEMENT par la consigne reformulée
- Pas d'introduction, pas de "Voici la consigne enrichie", pas de blabla
- Commence directement par le contenu de l'instruction enrichie
- Maximum 150 mots
- Garde un ton professionnel et direct style terminal financier
- Si la demande originale est vague (ex: "crypto"), transforme-la en analyse multi-facettes

=== EXEMPLE ===
Input : "actus crypto"
Output : "Analyse les mouvements majeurs des dernières 48h sur le marché crypto. Focus sur : (1) BTC et ETH avec prix exacts et variations %, (2) catalyseurs identifiés (ETF, régulation, adoption institutionnelle), (3) altcoins en breakout avec volumes anormaux, (4) sentiment du marché (Fear & Greed Index), (5) événements à venir cette semaine pouvant impacter les cours. Inclus les réactions des principaux acteurs (Saylor, Blackrock, Ark Invest) si pertinent."

=== MAINTENANT, TRANSFORME ===
`.trim()

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // Modèle rapide pour l'enrichissement
      messages: [
        {
          role: "system",
          content: "Tu es un expert en Prompt Engineering. Tu reformules les demandes utilisateur en instructions d'analyse professionnelle. Réponds UNIQUEMENT avec l'instruction enrichie, sans introduction ni commentaire.",
        },
        {
          role: "user",
          content: enhancementPrompt,
        },
      ],
      temperature: 0.3, // Un peu de créativité mais reste cohérent
      max_tokens: 300,
    })

    const enhancedInstructions = response.choices?.[0]?.message?.content?.trim() || ""

    if (!enhancedInstructions) {
      console.log("[NewsFlow] ⚠️ Enhancement returned empty, using original")
      return rawInstructions
    }

    console.log("============================================")
    console.log("[NewsFlow] ✨ INSTRUCTION ENRICHIE:")
    console.log(enhancedInstructions)
    console.log("============================================")

    return enhancedInstructions
  } catch (error) {
    console.error("[NewsFlow] ❌ Instruction enhancement failed:", error)
    // En cas d'erreur, on utilise les instructions originales
    return rawInstructions
  }
}

// 🔎 Va chercher du contexte web récent pour un projet - MODE BREAKING NEWS
async function fetchProjectContextFromWeb(project: any): Promise<string> {
  if (!process.env.TAVILY_API_KEY) {
    return ""
  }

  try {
    const baseQueryParts: string[] = []
    if (project.title) baseQueryParts.push(project.title)
    if (project.description) baseQueryParts.push(project.description)
    if (project.domain) baseQueryParts.push(project.domain)

    // On adapte la recherche selon la longueur voulue
    const isDetailed = project.length_level === "very_detailed" || project.length_level === "standard"

    // 🚨 QUERY OPTIMISÉE POUR BREAKING NEWS - Pas de contenu éducatif
    const query = baseQueryParts.join(" ") + " breaking news latest updates today analysis prices"

    const response = await tvly.search(query, {
      search_depth: "advanced",
      max_results: isDetailed ? 7 : 3,
      include_answer: false,
      include_images: true, // 🖼️ NOUVEAU : Récupération des images
      topic: "news", // 🔥 CRUCIAL : Force le focus sur l'actualité, pas les tutos
      days: 2, // 🔥 SEULEMENT les 48 dernières heures
    })

    if (!response || !response.results || response.results.length === 0) {
      return ""
    }

    const snippets = response.results.map((r: any, index: number) => {
      // Inclure la date de publication si disponible
      const dateInfo = r.published_date ? ` [${r.published_date}]` : ""
      // 🖼️ Inclure l'URL de l'image si disponible
      const imageUrl = r.image_url ? `\n[IMAGE_URL: ${r.image_url}]` : ""
      return `SOURCE ${index + 1}${dateInfo} (${r.title}):\n${r.content}${imageUrl}`
    })

    return snippets.join("\n\n")
  } catch (e) {
    console.error("[NewsFlow] Tavily search error for project:", project?.title, e)
    return ""
  }
}

// 🤖 AGENT PROJET - Traite un projet individuellement
async function processProject(
  project: any,
  userProfile: any,
  extraInstructions: string,
): Promise<{ title: string; content: string; sources: any[] }> {
  console.log(`[NewsFlow] 🤖 Agent processing project: "${project.title}"`)

  try {
    // 1️⃣ Recherche Tavily spécifique
    const webContext = await fetchProjectContextFromWeb(project)

    // 2️⃣ Construction du prompt focalisé
    const lengthLevel: string = project.length_level || "standard"
    const lengthConfig = lengthConfigs[lengthLevel] ?? lengthConfigs["standard"]
    const domainLabel = domainLabels[project.domain] || project.domain

    // 🎯 Instructions spécifiques selon le niveau de détail demandé
    let lengthStyleInstruction = ""
    let depthGuidance = ""
    
    if (lengthLevel === "very_short") {
      lengthStyleInstruction = "Format FLASH INFO : Ultra concis, télégraphique, 3-4 phrases max. Faits bruts uniquement."
      depthGuidance = "Style AFP dépêche urgente. Un seul fait marquant avec son chiffre clé."
    } else if (lengthLevel === "short") {
      lengthStyleInstruction = "Format COURT : Fait principal + contexte minimal. 1-2 paragraphes."
      depthGuidance = "L'essentiel en 30 secondes de lecture. Prix + raison principale."
    } else if (lengthLevel === "standard") {
      lengthStyleInstruction = "Format STANDARD : Développe le contexte et les conséquences immédiates pour chaque fait cité."
      depthGuidance = `
Pour chaque news/mouvement mentionné, tu dois donner :
- Le fait brut (prix/chiffre/événement)
- Le contexte direct (pourquoi ça bouge MAINTENANT)
- Les conséquences immédiates (qui est impacté)

Structure avec des paragraphes distincts. Utilise des sous-titres en gras (**Contexte**, **Impact**) pour aérer.`
    } else if (lengthLevel === "very_detailed") {
      lengthStyleInstruction = "Format ANALYSE EXHAUSTIVE : Deep dive complet style Bloomberg Terminal."
      depthGuidance = `
🔬 ANALYSE EXHAUSTIVE - Pour chaque news de moins de 48h, tu DOIS développer selon cette structure :

**1. Le Fait Brut** :
   - Chiffres précis, citations, données
   - Prix/cotations en liste dédiée
   
**2. Le Contexte** :
   - Pourquoi maintenant ? Qu'est-ce qui a déclenché ça ?
   - Historique récent (dernières semaines)
   - Comparaison avec les attentes du marché

**3. L'Impact** :
   - Qui gagne ? (Secteurs/entreprises/actifs)
   - Qui perd ? (Impacts négatifs identifiés)
   - Réactions du marché observées

**4. La Projection** :
   - Et demain ? Scénarios probables
   - Catalyseurs à surveiller
   - Consensus d'analystes si disponible

⚠️ NE T'ARRÊTE PAS À LA SURFACE. Chaque news mérite 3-4 paragraphes minimum.
Utilise des sous-titres en gras pour structurer : **Analyse**, **Contexte**, **Impact**, **Perspectives**.`
    } else {
      lengthStyleInstruction = "Format Standard : Article équilibré."
      depthGuidance = "Développe le contexte pour chaque fait mentionné."
    }

    // 👤 Extraction du profil métier de l'utilisateur
    const userActivity = userProfile?.current_activity || "Non spécifié"
    const isFinancialProfile = ["Trader", "Investisseur", "Analyste financier", "Gestionnaire de patrimoine"].includes(userActivity)

    const projectPrompt = `
Tu es un analyste Bloomberg Terminal pour NewsFlow. Tu rédiges des dépêches factuelles style Reuters/AFP.

👤 PROFIL DU LECTEUR : ${userActivity}
${isFinancialProfile ? "→ Lecteur avec expertise financière. Privilégie les données chiffrées et prix." : "→ Lecteur grand public. Privilégie la compréhension des faits et des enjeux."}

🔴 RÈGLES DE CONTENU ADAPTATIF 🔴

RÈGLE N°1 - IDENTIFIE L'INTENTION DU SUJET :

📊 Si le sujet est FINANCIER (Forex, Crypto, Bourse, Marchés) :
   → TON BUT : La rentabilité et l'analyse technique
   → TU DOIS inclure les prix, les variations (%), les niveaux techniques
   → Format : - **Actif** : Prix (Variation %)
   → Exemple : "**BTC** : 95 400 $ (+2,3% sur 24h)"

🌍 Si le sujet est GÉNÉRAL (Géopolitique, Société, Tech, Sport, Environnement) :
   → TON BUT : La compréhension factuelle des événements
   → TU DOIS te concentrer sur les FAITS, les DATES, les DÉCLARATIONS, les MOUVEMENTS STRATÉGIQUES
   → Format : - **Lieu/Acteur** : Événement clé (Date/Heure)
   → Exemple : "**Bakhmout** : 30 chars envoyés par l'OTAN (3 déc, 14h)"

⚠️ INTERDICTION ABSOLUE de citer des prix d'actifs (Pétrole, Blé, Gaz, Or) sur un sujet géopolitique,
   SAUF si le profil du lecteur est explicitement "${userActivity}" ET que celui-ci est identifié comme Trader/Investisseur.
   
   ❌ Exemple INTERDIT pour un lecteur grand public sur "Conflit Ukraine-Russie" :
      "Le prix du gaz naturel grimpe de 4% à 45 €/MWh"
   
   ✅ Exemple ATTENDU pour un lecteur grand public sur "Conflit Ukraine-Russie" :
      "**Bakhmout** : 30 chars Leopard envoyés par l'Allemagne (3 déc). **Crimée** : Frappes ukrainiennes sur la base navale de Sébastopol."

RÈGLE N°2 - ANTI-WIKIPEDIA (ZÉRO DÉFINITION) :
INTERDICTION FORMELLE de définir les termes ou d'expliquer les concepts de base.
❌ INTERDIT : "Le Forex est le marché des changes...", "L'OTAN est une alliance militaire..."
✅ ATTENDU : Tu considères que le lecteur connaît le contexte général.

RÈGLE N°3 - FRAÎCHEUR & PRÉCISION (< 48H) :
Concentre-toi sur les événements des dernières 48 heures.
✅ Sois PRÉCIS : "30 chars envoyés" (pas "envoi de matériel"), "185K emplois créés" (pas "emplois en hausse")
✅ Mentionne toujours QUAND : "Ce matin à 9h", "Hier soir", "3 déc à 14h"
⚠️ REMPLISSAGE INTELLIGENT : Si peu de news < 24h pour un format détaillé, élargis à 72h en PRÉCISANT LES DATES.
❌ Ne rends JAMAIS une section vide ou de 3 lignes pour un format détaillé.

=== MISSION PRÉCISE ===
Sujet : "${project.title}"
Domaine : ${domainLabel}
${project.description ? `Description : ${project.description}` : ""}
${project.instructions ? `Instructions : ${project.instructions}` : ""}

📏 NIVEAU DE DÉTAIL : ${lengthConfig.label}
Longueur cible : ${lengthConfig.minWords}-${lengthConfig.maxWords} mots
Style : ${lengthStyleInstruction}

${depthGuidance}

${extraInstructions ? `\n🔥 CONSIGNE PRIORITAIRE : "${extraInstructions}"\n` : ""}

=== SOURCES WEB (ACTUALITÉ FRAÎCHE) ===
${webContext || "⚠️ AUCUNE SOURCE RÉCENTE DISPONIBLE - Si vraiment pas de news fraîche, écris 'R.A.S' mais essaie d'élargir à 72h avant d'abandonner."}

=== FORMAT DE RÉPONSE (JSON STRICT) ===
Réponds UNIQUEMENT avec ce JSON :
{
  "title": "${project.title}",
  "content": "Ton analyse complète ici. Paragraphes fluides (3-5 phrases par paragraphe). Sépare les paragraphes par \\n\\n.",
  "sources": [
    { "name": "Nom de la source", "type": "media", "note": "Info pertinente" }
  ]
}

=== STYLE BLOOMBERG TERMINAL (MISE EN FORME) ===

1. **TON DÉPÊCHE AFP** :
   - Style direct, brutal, factuel
   - Pas de transition littéraire ("Par ailleurs...", "En effet...")
   - Pas de formules creuses ("Il convient de noter...", "Force est de constater...")
   
2. **TIMESTAMPS SYSTÉMATIQUES** :
   - Mentionne toujours QUAND l'événement s'est produit
   - Exemples : "Ce matin à 9h", "Hier soir", "Jeudi dernier", "À l'ouverture européenne"

3. **CHIFFRES PRÉCIS** :
   - Pas de "environ", "autour de", "proche de"
   - Format exact : "1,0520" pas "1.05", "95 400 $" pas "95K$"
   
4. **FORMATAGE SELON LE CONTEXTE** :
   
   📊 Pour les sujets FINANCIERS (prix/cotations) :
   Format : - **[Actif]** : [Prix exact] ([Variation %])
   Exemples :
   - **BTC** : 95 400 $ (+2,3% sur 24h)
   - **EUR/USD** : 1,0520 (-0,3% post-NFP)
   - **Tesla** : 245 $ (-5% après résultats)
   
   🌍 Pour les sujets GÉNÉRAUX (géopolitique, société, etc.) :
   Format : - **[Lieu/Acteur]** : [Événement précis] ([Date/Heure])
   Exemples :
   - **Bakhmout** : 30 chars Leopard envoyés (3 déc, 14h)
   - **Gaza** : Cessez-le-feu proposé par l'Égypte (hier soir)
   - **Bruxelles** : Sommet UE sur l'IA (ce matin)

5. **MARKDOWN MILITANT** :
   - **GRAS** : Tous les actifs, toutes les entreprises, tous les chiffres clés
   - Listes à puces dès que 2+ éléments à énumérer
   - Double saut de ligne (\\n\\n) entre chaque bloc d'info

6. **SOUS-TITRES POUR DENSIFIER (CRUCIAL POUR FORMATS LONGS)** :
   Pour les formats Standard et Very Detailed, utilise des sous-titres en gras DANS les paragraphes pour structurer visuellement :
   - **Analyse** : [développement]
   - **Contexte** : [explication]
   - **Impact** : [conséquences]
   - **Perspectives** : [projections]
   
   Cela densifie la lecture sans faire de murs de texte indigestes.
   Exemple : "La **Fed** maintient ses taux à **5,25%**.\\n\\n**Contexte** : Cette décision fait suite à...\\n\\n**Impact** : Les marchés obligataires réagissent..."

7. **STRUCTURE TYPE DÉPÊCHE** :
   a) Hook factuel (prix/mouvement principal)
   b) Liste des prix actuels si pertinent
   c) Causes identifiées (liste à puces avec sous-titres si détaillé)
   d) Impact/Conséquences (avec sous-titres si détaillé)

=== LONGUEUR ===
Respecte ${lengthConfig.minWords}-${lengthConfig.maxWords} mots. Pas un mot de remplissage.

=== EXEMPLES DE BON FORMATAGE ===

📊 SUJET FINANCIER (ex: "Marchés Crypto") :
"**Bitcoin** grimpe de **2,3%** à **95 400 $** ce matin après l'annonce de BlackRock.

Prix actuels Crypto :

- **BTC** : 95 400 $ (+2,3%)
- **ETH** : 2 150 $ (+1,8%)

Catalyseurs :

- BlackRock dépose une demande d'ETF Bitcoin spot
- Volume de trading en hausse de **40%** sur 24h
- **Michael Saylor** annonce un achat de **500 BTC**"

🌍 SUJET GÉOPOLITIQUE (ex: "Conflit Ukraine-Russie") - POUR LECTEUR GRAND PUBLIC :
"L'offensive ukrainienne s'intensifie sur le front Est avec l'arrivée de matériel occidental.

Mouvements clés :

- **Bakhmout** : 30 chars Leopard envoyés par l'Allemagne (3 déc)
- **Crimée** : Frappes ukrainiennes sur Sébastopol (hier soir)
- **Varsovie** : Sommet OTAN pour coordination des livraisons (ce matin)

**Contexte** : Cette escalade intervient après 3 semaines de calme relatif. L'Allemagne rompt avec sa doctrine de prudence en envoyant des chars lourds."

❌ CE QUE JE NE VEUX PAS (Sujet géopolitique pollué par des prix) :
"Le conflit Ukraine-Russie impacte les marchés énergétiques. Le gaz naturel grimpe de 4% à 45 €/MWh..."
`.trim()

    // 3️⃣ Appel à Groq - TEMPÉRATURE MINIMALE pour faits bruts uniquement
    const groqResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Tu es un journaliste financier Bloomberg Terminal. Réponds STRICTEMENT en JSON valide. FAITS BRUTS uniquement, zéro créativité.",
        },
        {
          role: "user",
          content: projectPrompt,
        },
      ],
      temperature: 0.1, // 🔥 TEMPÉRATURE MINIMALE - Élimine le brodage et la créativité
      max_tokens: 3000,
      response_format: { type: "json_object" },
    })

    const rawContent = groqResponse.choices?.[0]?.message?.content

    if (!rawContent) {
      throw new Error("Réponse vide de Groq")
    }

    // 4️⃣ Parse JSON
    let cleaned = rawContent.trim()
    if (cleaned.startsWith("```json")) cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "")
    else if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```/, "").replace(/```$/, "")

    const parsedJson = JSON.parse(cleaned)

    console.log(`[NewsFlow] ✅ Agent completed project: "${project.title}" (${parsedJson.content?.split(" ").length || 0} words)`)

    return {
      title: parsedJson.title || project.title,
      content: parsedJson.content || "",
      sources: parsedJson.sources || [],
    }
  } catch (error) {
    console.error(`[NewsFlow] ❌ Agent failed for project "${project.title}":`, error)
    // Retourne un fallback
    return {
      title: project.title,
      content: `Erreur lors de la génération de cette section. Veuillez réessayer.`,
      sources: [],
    }
  }
}

// 🎭 AGENT SYNTHÈSE - Crée l'introduction et le résumé global
async function generateSynthesis(
  projectTitles: string[], 
  userProfile: any,
  webContext: string
): Promise<{
  summary: string
  introduction: string
  menu: string
  keyEvents: string[]
  mainImageUrl: string
}> {
  console.log("[NewsFlow] 🎭 Agent Synthèse generating global intro...")

  try {
    const synthesisPrompt = `
Tu es le rédacteur en chef de NewsFlow.

=== MISSION ===
Les analystes ont préparé des sections sur ces sujets :
${projectTitles.map((title, i) => `${i + 1}. ${title}`).join("\n")}

Génère UNIQUEMENT la partie ÉDITORIALE globale du Flow.

=== SOURCES WEB AVEC IMAGES ===
${webContext || "Aucune source disponible"}

🖼️ **SÉLECTION D'IMAGE** :
Tu dois choisir UNE SEULE image pertinente parmi celles fournies dans le contexte (marquées [IMAGE_URL:...]).
Choisis celle qui illustre le mieux le sujet principal ou l'événement le plus important du jour.
Si plusieurs images sont disponibles, privilégie celle qui provient de la source la plus crédible.

=== FORMAT DE RÉPONSE (JSON STRICT) ===
{
  "summary": "Titre accrocheur du Flow (max 140 caractères)",
  "introduction": "2 paragraphes fluides (100-150 mots) qui plantent l'ambiance générale du jour. Pas de liste.",
  "menu": "Liste à puces des projets couverts. Format : - Titre Projet 1\\n- Titre Projet 2\\n...",
  "key_events": ["Date - Événement clé 1", "Date - Événement clé 2", "..."],
  "main_image_url": "Copie-colle EXACTEMENT l'URL de l'image choisie. Si aucune image trouvée, laisse cette chaîne vide."
}

RÈGLES DE STYLE :
- Le summary doit être percutant et éveiller la curiosité (max 140 caractères)
- L'introduction doit utiliser du **gras** pour les concepts clés et tendances principales
- L'introduction doit être AÉRÉE avec des doubles sauts de ligne (\\n\\n) entre les paragraphes
- Le menu doit être une liste à puces simple : - Titre 1\\n- Titre 2
- Pas d'émojis
- JSON valide uniquement
`.trim()

    const groqResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Tu es un rédacteur en chef expert qui répond STRICTEMENT en JSON valide.",
        },
        {
          role: "user",
          content: synthesisPrompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 1000,
      response_format: { type: "json_object" },
    })

    const rawContent = groqResponse.choices?.[0]?.message?.content

    if (!rawContent) {
      throw new Error("Réponse vide de Groq")
    }

    let cleaned = rawContent.trim()
    if (cleaned.startsWith("```json")) cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "")
    else if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```/, "").replace(/```$/, "")

    const parsedJson = JSON.parse(cleaned)

    console.log("[NewsFlow] ✅ Agent Synthèse completed")

    return {
      summary: parsedJson.summary || "NewsFlow du jour",
      introduction: parsedJson.introduction || "",
      menu: parsedJson.menu || "",
      keyEvents: parsedJson.key_events || [],
      mainImageUrl: parsedJson.main_image_url || "",
    }
  } catch (error) {
    console.error("[NewsFlow] ❌ Agent Synthèse failed:", error)
    // Fallback
    return {
      summary: "NewsFlow du jour",
      introduction: "Votre briefing d'actualité personnalisé.",
      menu: projectTitles.map((t) => `- ${t}`).join("\n"),
      keyEvents: [],
      mainImageUrl: "",
    }
  }
}

// 🎯 ORCHESTRATEUR PRINCIPAL - Architecture "Un Projet = Un Agent"
export async function POST(request: Request) {
  try {
    console.log("[NewsFlow] 🚀 Starting Flow generation with parallel agents...")

    // Récupération du body
    const body = await request.json().catch(() => null)
    
    // Support des deux noms de paramètres (legacy + nouveau)
    const rawInstructions = (
      body?.extraInstructions || 
      body?.daily_instruction || 
      ""
    )?.toString().trim()

    // ═══════════════════════════════════════════════════════════════════════════
    // 🧠 ÉTAPE 1 : ENRICHISSEMENT AUTOMATIQUE DES INSTRUCTIONS
    // ═══════════════════════════════════════════════════════════════════════════
    let extraInstructions = ""
    
    if (rawInstructions && rawInstructions.length > 0) {
      console.log("[NewsFlow] 🧠 User provided instructions, enhancing...")
      
      // Appel à l'agent d'enrichissement
      const enhancedInstructions = await enhanceUserInstructions(rawInstructions)
      
      // Combiner les versions pour le contexte complet
      extraInstructions = `
📋 DEMANDE ORIGINALE : "${rawInstructions}"

🎯 VERSION EXPERT (enrichie par l'IA) :
${enhancedInstructions}
`.trim()

      console.log("[NewsFlow] ✅ Instructions enhanced successfully")
    }

    const supabase = await createClient()

    // 🔐 Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("[NewsFlow] Auth error:", authError)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    console.log("[NewsFlow] ✅ User authenticated:", user.id)

    // 📄 Profil utilisateur
    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    
    const userPlanType = profileData?.plan_type ?? "free"

    // 🔒 VÉRIFICATION DES LIMITES D'USAGE
    console.log("[NewsFlow] 🔒 Checking usage limits...")
    const flowLimitCheck = await checkFlowLimit(user.id, userPlanType)
    
    if (!flowLimitCheck.allowed) {
      console.log(`[NewsFlow] ❌ Flow limit reached: ${flowLimitCheck.count}/${flowLimitCheck.limit}`)
      return NextResponse.json(
        {
          error: "LIMIT_REACHED",
          message: `Vous avez atteint votre quota de ${flowLimitCheck.limit} Flows cette semaine. Passez au plan supérieur pour continuer.`,
          usage: {
            count: flowLimitCheck.count,
            limit: flowLimitCheck.limit,
          },
        },
        { status: 403 }
      )
    }
    
    console.log(`[NewsFlow] ✅ Usage limit OK: ${flowLimitCheck.count}/${flowLimitCheck.limit}`)

    const profile = {
      full_name: profileData?.full_name ?? null,
      age: profileData?.age ?? null,
      education_level: profileData?.education_level ?? null,
      current_activity: profileData?.current_activity ?? null,
      complexity_level: profileData?.complexity_level ?? "standard",
      language: profileData?.language ?? "fr",
      plan_type: profileData?.plan_type ?? "free",
    }

    // 📁 Projets personnalisés actifs
    const { data: activeProjects } = await supabase
      .from("custom_topics")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("position", { ascending: true })

    console.log("[NewsFlow] 📦 Active projects:", activeProjects?.length || 0)

    if (!activeProjects || activeProjects.length === 0) {
      return NextResponse.json({ error: "Aucun projet actif. Veuillez créer au moins un projet." }, { status: 400 })
    }

    // 🔑 Vérification Groq
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ API Key manquante" }, { status: 503 })
    }

    // ⚡ PHASE 1 : TRAITEMENT PARALLÈLE DES PROJETS (Agents Projet)
    console.log("[NewsFlow] ⚡ Launching parallel agents for all projects...")

    const projectSections = await Promise.all(
      activeProjects.map((project: any) => processProject(project, profile, extraInstructions)),
    )

    console.log("[NewsFlow] ✅ All project agents completed")

    // 🎭 PHASE 2 : SYNTHÈSE GLOBALE (Agent Synthèse)
    const projectTitles = projectSections.map((section) => section.title)
    
    // Récupérer le contexte web du premier projet pour les images
    const firstProjectContext = activeProjects[0] ? await fetchProjectContextFromWeb(activeProjects[0]) : ""
    
    const synthesis = await generateSynthesis(projectTitles, profile, firstProjectContext)

    console.log("[NewsFlow] ✅ Synthesis agent completed")

    // 🔨 PHASE 3 : ASSEMBLAGE FINAL
    console.log("[NewsFlow] 🔨 Assembling final Flow...")

    // Construire le tableau de sections final
    const finalSections = [
      {
        title: "Introduction",
        content: synthesis.introduction,
      },
      {
        title: "Menu du jour",
        content: synthesis.menu,
      },
      ...projectSections.map((section) => ({
        title: section.title,
        content: section.content,
      })),
    ]

    // Collecter toutes les sources
    const allSources = projectSections.flatMap((section) => section.sources || [])

    // Générer topics_covered
    const topicsCovered = projectTitles.join(", ")

    // Créer le JSON complet pour source_json
    const fullFlowJson = {
      summary: synthesis.summary,
      main_image_url: synthesis.mainImageUrl, // 🖼️ URL de l'image principale
      sections: finalSections,
      key_events: synthesis.keyEvents,
      topics_covered: topicsCovered,
      sources: allSources,
    }

    // Formatter pour la colonne body (legacy)
    const bodyText = finalSections.map((s) => `${s.title}\n\n${s.content}`).join("\n\n")

    // 💾 PHASE 4 : SAUVEGARDE EN BASE
    console.log("[NewsFlow] 💾 Saving Flow to database...")

    const { data: newFlow, error: insertError } = await supabase
      .from("recaps")
      .insert({
        user_id: user.id,
        type: "on_demand",
        channels: ["app"],
        complexity_level: profile.complexity_level || "standard",
        summary: synthesis.summary,
        body: bodyText,
        key_events: synthesis.keyEvents.join("\n"),
        topics_covered: topicsCovered,
        source_json: JSON.stringify(fullFlowJson),
      })
      .select()
      .single()

    if (insertError) {
      console.error("[NewsFlow] ❌ Insert error:", insertError)
      return NextResponse.json({ error: "Erreur BDD" }, { status: 500 })
    }

    console.log("[NewsFlow] 🎉 Flow generated successfully! ID:", newFlow.id)

    return NextResponse.json({
      id: newFlow.id,
      summary: newFlow.summary,
      body: newFlow.body,
    })
  } catch (error) {
    console.error("[NewsFlow] 💥 Critical error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 },
    )
  }
}