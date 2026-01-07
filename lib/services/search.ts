import { tavily } from "@tavily/core"

export async function searchProjectNews(topic: string, keywords: string[] = []) {
  console.log(`\n--- 🕵️ DÉBUT DIAGNOSTIC TAVILY ---`)
  console.log(`📌 Sujet demandé : "${topic}"`)

  // 1. Vérification Clé API
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) {
    console.error("❌ ERREUR FATALE : Clé TAVILY_API_KEY introuvable dans process.env")
    return []
  }
  console.log(`🔑 Clé détectée : ${apiKey.substring(0, 5)}... (Longueur: ${apiKey.length})`)

  // 2. Construction Requête
  const query = `${topic} news analysis finance`
  console.log(`📡 Envoi requête : "${query}"`)

  try {
    const tvly = tavily({ apiKey })
    // On élargit la recherche pour être sûr de trouver un truc
    const response = await tvly.search(query, {
      topic: "news",
      days: 5,
      search_depth: "advanced",
      max_results: 3,
    })

    console.log(`✅ Réponse Tavily reçue.`)
    console.log(`📊 Nombre de résultats : ${response.results.length}`)
    if (response.results.length > 0) {
      console.log(`📝 Exemple titre 1 : ${response.results[0].title}`)
      return response.results
    } else {
      console.warn("⚠️ ALERTE : Tavily a renvoyé 0 résultat !")
      return []
    }
  } catch (error) {
    console.error("💥 CRASH TAVILY :", error)
    return []
  } finally {
    console.log(`--- FIN DIAGNOSTIC ---\n`)
  }
}

// Recherche généraliste pour la section "Bon à savoir"
export async function searchGeneralNews() {
  return await searchProjectNews("Actualités importantes France Monde Culture Tech Insolite", [
    "top news",
    "breaking",
    "society",
  ])
}

