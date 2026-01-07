export const dynamic = 'force-dynamic'; // <--- AJOUTE ÇA TOUT EN HAUT

import { NextResponse } from 'next/server';
// ... le reste de ton code
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assure-toi que le chemin vers ton prisma est bon
// import { auth } from "@/auth"; // Décommente si tu utilises NextAuth/Auth.js pour récupérer la session réelle

export async function PATCH(req: Request) {
  try {
    // 1. Récupérer les données envoyées par le bouton "Sauvegarder"
    const body = await req.json();
    const { 
      feedAutoRefresh, 
      feedRefreshRate, 
      emailNotifications, 
      emailFrequency,
      alertKeywords
    } = body;

    // --- ZONE AUTHENTIFICATION ---
    // Ici, normalement on récupère l'ID de l'utilisateur connecté via la session.
    // Pour l'instant, si tu es en dev, on va utiliser une méthode pour trouver ton user.
    // Si tu as un système d'auth, remplace la ligne ci-dessous par : const session = await auth(); const userId = session?.user?.id;
    
    // EXEMPLE TEMPORAIRE : On cherche le premier utilisateur ou un ID fixe pour tester
    // Remplace cet ID par le tien si tu le connais, ou laisse la logique de session si elle est prête.
    // Pour simplifier, on va chercher l'utilisateur via son email si tu l'envoies, sinon on prend le premier (DANGEREUX EN PROD, OK POUR TEST LOCAL)
    const user = await prisma.user.findFirst(); 

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 401 });
    }

    // 2. Mise à jour dans la Base de Données
    const updatedUser = await prisma.user.update({
      where: { 
        id: user.id 
      },
      data: {
        // On ne met à jour que si la valeur est présente dans la requête (undefined check)
        ...(feedAutoRefresh !== undefined && { feedAutoRefresh }),
        ...(feedRefreshRate !== undefined && { feedRefreshRate }),
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(emailFrequency !== undefined && { emailFrequency }),
        ...(alertKeywords !== undefined && { alertKeywords }),
      },
    });

    console.log("✅ Paramètres sauvegardés pour :", user.email);

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("❌ Erreur lors de la sauvegarde des settings:", error);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}