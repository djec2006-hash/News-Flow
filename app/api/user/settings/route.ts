export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    // Note: En production, utilise l'auth réelle (session).
    // Ici, on prend le premier utilisateur trouvé pour que ça marche en démo.
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
        // On ne met à jour que si la valeur est présente dans la requête
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