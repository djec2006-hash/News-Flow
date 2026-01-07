import Groq from "groq-sdk"
import type { FlowSection, Sentiment } from "@/types/flow"

// ==========================================
// CONFIGURATION DES MODÈLES (Cerveaux)
// ==========================================
// On utilise le modèle PUISSANT partout pour garantir le respect des consignes complexes.
// Le modèle "Fast" (8b) faisait trop d'erreurs de formatage.
const SMART_MODEL = "llama-3.3-70b-versatile" 

export interface SectionContentResult extends FlowSection {
  hook?: string
  raw?: string
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
})

// ==========================================
// UTILITAIRES
// ==========================================

// Nettoie les réponses LLM pour extraire un JSON valide même si la sortie est encadrée par du markdown
const cleanResponse = (text: string | null | undefined): string => {
  // Gestion des cas null/undefined/vide
  if (!text || typeof text !== "string") {
    return "{}"
  }
  
  // Supprime les balises markdown (```json et ```)
  let cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim()
  
  // Extrait uniquement le contenu entre la première { et la dernière }
  const firstBrace = cleaned.indexOf("{")
  const lastBrace = cleaned.lastIndexOf("}")
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    let jsonCandidate = cleaned.substring(firstBrace, lastBrace + 1)
    
    // Tentative de réparation agressive du JSON
    try {
      // Test si le JSON est valide
      JSON.parse(jsonCandidate)
      return jsonCandidate
    } catch (parseError) {
      // Réparation 1 : ajoute "}" si manquant à la fin
      if (!jsonCandidate.trim().endsWith("}")) {
        jsonCandidate = jsonCandidate.trim() + "}"
      }
      
      // Réparation 2 : tente de fermer les guillemets non fermés dans "content"
      // Cherche "content": " et trouve où insérer un guillemet fermant avant "sentiment"
      const contentKeyIndex = jsonCandidate.indexOf('"content"')
      const sentimentKeyIndex = jsonCandidate.indexOf('"sentiment"')
      
      if (contentKeyIndex !== -1 && sentimentKeyIndex !== -1 && sentimentKeyIndex > contentKeyIndex) {
        // Trouve le guillemet ouvrant après "content":
        const contentValueStart = jsonCandidate.indexOf('"', contentKeyIndex + 9) + 1
        
        if (contentValueStart > 0) {
          // Vérifie s'il y a un guillemet fermant avant "sentiment"
          const textBeforeSentiment = jsonCandidate.substring(contentValueStart, sentimentKeyIndex)
          const lastQuoteIndex = textBeforeSentiment.lastIndexOf('"')
          
          // Si le dernier guillemet avant sentiment est trop proche du début (c'est le guillemet ouvrant), on ajoute un fermant
          if (lastQuoteIndex < 10 || !textBeforeSentiment.substring(lastQuoteIndex + 1).trim().startsWith(',')) {
            // Insère un guillemet fermant juste avant "sentiment"
            jsonCandidate = jsonCandidate.substring(0, sentimentKeyIndex) + '"' + jsonCandidate.substring(sentimentKeyIndex)
          }
        }
      }
      
      // Réessaye le parsing après réparation
      try {
        JSON.parse(jsonCandidate)
        return jsonCandidate
      } catch (secondParseError) {
        // Si ça échoue encore, retourne quand même le JSON réparé (mieux que rien)
        console.warn("⚠️ [cleanResponse] JSON invalide même après réparation, retour du JSON brut")
        return jsonCandidate
      }
    }
  }
  
  // Fallback : retourne un objet vide si aucun JSON valide n'est trouvé
  return "{}"
}

// ==========================================
// 1. GÉNÉRATION DES SECTIONS (Le corps du Flow)
// ==========================================

export async function generateSectionContent(
  topic: string,
  context: string,
  instructions: string,
  lengthLevel: string,
): Promise<SectionContentResult> {
  const enforcedTopic = topic || "Actualité"
  
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing API Key GROQ_API_KEY")
    }

    // 1. DÉTERMINATION DE LA LONGUEUR (Logique directive avec intention de densité)
    let lengthInstruction = "OBJECTIF : ÉQUILIBRE. Rédige 3 à 4 paragraphes. Couvre le sujet."
    switch ((lengthLevel || "").toLowerCase()) {
      case "short":
      case "very_short":
      case "concise":
        lengthInstruction = "OBSESSION : SYNTHÈSE. Rédige 1 à 2 paragraphes maximum. Va à l'essentiel."
        break
      case "medium":
      case "standard":
        lengthInstruction = "OBJECTIF : ÉQUILIBRE. Rédige 3 à 4 paragraphes. Couvre le sujet."
        break
      case "long":
      case "extralong":
      case "very_detailed":
      case "expert":
      case "max":
        lengthInstruction = "OBSESSION : DÉTAIL. Rédige IMPÉRATIVEMENT 6 à 7 paragraphes. Développe chaque point, donne du contexte, explique les causes et conséquences. Ne sois pas superficiel."
        break
      default:
        lengthInstruction = "OBJECTIF : ÉQUILIBRE. Rédige 3 à 4 paragraphes. Couvre le sujet."
    }

    // 2. PROMPT SIMPLIFIÉ ET OPTIMISÉ pour le modèle 70B
    const truncatedContext = (context || "").slice(0, 10000)
    const systemPrompt = `Tu es un Expert et Journaliste Senior. Sujet : "${enforcedTopic}".
SOURCE DE VÉRITÉ : ${truncatedContext}

COMMANDE DE LONGUEUR (PRIORITÉ ABSOLUE) : 👉 ${lengthInstruction} (Si je demande 6 paragraphes et que tu n'en fais qu'un, la génération est un échec).

RÈGLE DE SURVIE : INTERDICTION FORMELLE DE RÉPONDRE "RIEN À SIGNALER".
Si le contexte ne mentionne pas explicitement le sujet "${enforcedTopic}", tu dois :
1. Chercher des concepts liés (ex: Si sujet="France" et contexte="Zone Euro", parle de la Zone Euro).
2. Analyser les IMPACTS INDIRECTS (ex: Si sujet="Crypto" et contexte="Hausse du Dollar", explique l'impact du Dollar sur la Crypto).
3. Si vraiment aucun lien, fais un résumé général de l'actualité économique mondiale en expliquant que le secteur "${enforcedTopic}" est en attente de direction.

RÈGLES DE STYLE :

Style narratif, fluide, dense (New York Times).

PAS de sous-titres, PAS de listes à puces.

PAS d'indentation.

Double saut de ligne (\\n\\n) entre les paragraphes.

FORMAT JSON : { "title": "Titre Percutant (Max 6 mots)", "content": "Markdown...", "sentiment": "neutral" }

IMPORTANT : Tu dois impérativement échapper les guillemets internes (\\") et FERMER la valeur du champ "content" avec un guillemet avant de passer à "sentiment". Vérifie ta syntaxe JSON.`

    const userPrompt = `
    SUJET : ${enforcedTopic}
    
    INSTRUCTIONS SPÉCIFIQUES UTILISATEUR :
    ${instructions || "Angle : Actualité chaude et analyse de fond."}

    RAPPEL : Base-toi UNIQUEMENT sur la Source de Vérité fournie. 
    Génère le JSON maintenant.
    `

    // APPEL API (Utilisation de SMART_MODEL pour éviter les erreurs de formatage)
    const response = await groq.chat.completions.create({
      model: SMART_MODEL, 
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.1, // Température très basse pour réduire les erreurs de syntaxe JSON
      max_tokens: 3000, // Augmenté pour éviter les coupures sur les textes longs
      response_format: { type: "json_object" },
    })

    const completion = response.choices?.[0]?.message?.content?.trim() || ""
    
    // Filet de sécurité : Si le parsing JSON échoue, on retourne le contenu brut
    try {
      const cleaned = cleanResponse(completion)
      const parsed = JSON.parse(cleaned)

      console.log(`🤖 [Groq Smart] Section générée pour : ${enforcedTopic}`)

      return {
        title: enforcedTopic, // Force le nom du projet au lieu du titre généré par l'IA
        content: parsed.content || "Contenu non disponible.",
        hook: parsed.hook || "",
        sentiment: (parsed.sentiment as Sentiment) || "neutral",
        key_figures: [], // On laisse vide car géré dans le texte
        raw: completion,
      }
    } catch (parseError) {
      // Filet de sécurité : Si le JSON est invalide, on retourne le contenu brut
      console.warn(`⚠️ [Groq Smart] JSON invalide pour "${enforcedTopic}", utilisation du contenu brut`)
      console.warn("📄 RAW CONTENT:", completion)
      
      // Extraction manuelle du contenu si possible
      const contentMatch = completion.match(/"content"\s*:\s*"([^"]+)"/) || 
                           completion.match(/content["\s:]+(.+?)(?:"|,|\n|$)/i)
      const extractedContent = contentMatch ? contentMatch[1] : completion

      return {
        title: enforcedTopic,
        content: extractedContent || completion || "Contenu généré mais non formaté.",
        hook: "",
        sentiment: "neutral" as Sentiment,
        key_figures: [],
        raw: completion,
      }
    }

  } catch (error) {
    console.error("❌ ERREUR CRITIQUE SECTION:", error)
    return {
      title: enforcedTopic,
      content: `Une erreur technique est survenue lors de la génération. Veuillez vérifier que le contenu n'est pas trop long ou réessayer.\n\n_Détail: ${error instanceof Error ? error.message : "Erreur inconnue"}_`,
      sentiment: "neutral",
    }
  }
}

// ==========================================
// 2. GÉNÉRATION DE L'INTRODUCTION (Briefing)
// ==========================================

export async function generateIntro(context: string, topics: string[]): Promise<SectionContentResult> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing API Key GROQ_API_KEY for intro")
  }

  const topicsList = topics.join(", ")
  const safeContext = (context || "").slice(0, 15000)

  // Prompt simplifié et blindé pour éviter les crashs
  const systemPrompt = `Tu es Rédacteur en Chef. Rédige un briefing court.
SUJETS : ${topicsList}.
SOURCE : ${safeContext || "(Pas de données spécifiques)"}.

STRUCTURE MARKDOWN STRICTE :
1. HEADLINE : L'info majeure en 2 phrases directes.
2. SÉPARATEUR : Double saut de ligne (\\n\\n).
3. MENU : La phrase exacte "Au programme de votre édition :" suivie d'une liste à puces.

FORMAT JSON : { "title": "L'Essentiel du Jour", "content": "MARKDOWN_ICI", "sentiment": "neutral" }

Si le JSON échoue, renvoie juste le texte brut.`

  let completion: any = null
  try {
    completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Génère le briefing en JSON maintenant." },
      ],
      model: SMART_MODEL,
      temperature: 0.4,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    })

    const raw = completion.choices?.[0]?.message?.content?.trim() || ""
    
    // Fallback : Si le JSON échoue, renvoie juste le texte brut
    try {
      const cleaned = cleanResponse(raw)
      const parsed = JSON.parse(cleaned)

      return {
        title: parsed.title || "L'Essentiel du Jour",
        content: parsed.content || "Introduction indisponible.",
        sentiment: (parsed.sentiment as Sentiment) || "neutral",
        raw,
      }
    } catch (parseError) {
      // Si le JSON échoue, on retourne le texte brut
      console.warn("⚠️ [Intro] JSON invalide, utilisation du texte brut")
      return {
        title: "L'Essentiel du Jour",
        content: raw || "Introduction indisponible.",
        sentiment: "neutral" as Sentiment,
        raw,
      }
    }
  } catch (error) {
    console.error("❌ ERREUR INTRO:", error)
    // Fallback : Intro de secours générée manuellement à partir des topics
    const fallbackContent = "**Au programme de votre édition :**\n\n" + topics.map(t => "* **" + t + "** : Analyse en cours.").join("\n\n")
    return {
      title: "L'Essentiel du Jour",
      content: fallbackContent,
      sentiment: "neutral" as Sentiment,
    }
  }
}

/**
 * Génère la section "Bon à savoir" (outro) avec formatage strict Sujet/Explication.
 */
export async function generateOutro(context: string): Promise<SectionContentResult> {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing API Key GROQ_API_KEY for outro")
    }
  
    const safeContext = (context || "").slice(0, 12000)
    const systemPrompt = `Tu es un Curateur Curieux.
TA MISSION : Cherche 4 à 6 infos marquantes dans le texte (Drama, Tech, Insolite, ou Gros Chiffres).
SOURCE : ${safeContext}

RÈGLE ABSOLUE : Crée tes propres catégories. Si tu ne trouves que de la finance, transforme-la en fait de société (ex: Argent : Le Bitcoin explose...).

INTERDICTION d'écrire "Rien à signaler". Fouille le texte.

MODE CURIOSITÉ : Si tu ne trouves pas de "Gros Titres", cherche des petites anecdotes, des chiffres insolites ou des citations dans le texte. Tu DOIS remplir 4 puces minimum.

FORMAT VISUEL STRICT : * **[Catégorie]** : [Explication]

Double saut de ligne (\\n\\n) entre chaque puce.

EXEMPLE :
* **Insolite** : Un passager a tenté d'ouvrir la porte de l'avion en plein vol, forçant un atterrissage d'urgence à Denver.

* **Cinéma** : Le dernier film Marvel fait un flop historique au box-office, remettant en cause toute la stratégie de Disney.

JSON ATTENDU : { "title": "Bon à savoir", "content": "TA_LISTE_MARKDOWN", "sentiment": "neutral" }`

    try {
      const response = await groq.chat.completions.create({
        model: SMART_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Génère les brèves avec le format strict : * **[Sujet]** : Explication (sans gras)." },
        ],
        temperature: 0.3,
        max_tokens: 2048,
        response_format: { type: "json_object" },
      })

      const completion = response.choices?.[0]?.message?.content?.trim() || ""
      
      // Fallback : Si le JSON échoue, on extrait le contenu manuellement
      try {
        const cleaned = cleanResponse(completion)
        const parsed = JSON.parse(cleaned)
    
        return {
          title: parsed.title || "Bon à savoir",
          content: parsed.content || "Pas d'informations complémentaires pour le moment.",
          sentiment: (parsed.sentiment as Sentiment) || "neutral",
          raw: completion,
        }
      } catch (parseError) {
        // Extraction manuelle du contenu si JSON invalide
        console.warn("⚠️ [Outro] JSON invalide, extraction manuelle")
        const contentMatch = completion.match(/"content"\s*:\s*"([^"]+)"/) || 
                             completion.match(/content["\s:]+(.+?)(?:"|,|\n|$)/i)
        const extractedContent = contentMatch ? contentMatch[1] : completion
        
        return {
          title: "Bon à savoir",
          content: extractedContent || completion || "Section indisponible.",
          sentiment: "neutral" as Sentiment,
          raw: completion,
        }
      }
    } catch (error) {
      console.error("❌ ERREUR OUTRO:", error)
      return {
        title: "Bon à savoir",
        content: "Section indisponible.",
        sentiment: "neutral",
      }
    }
  }