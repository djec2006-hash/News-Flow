import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { PromoRedeemer } from "@/components/logic/PromoRedeemer"
import OnboardingManager from "@/components/onboarding/OnboardingManager"
import { LiveFeedProvider } from "@/contexts/LiveFeedContext"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LiveFeedProvider>
      <div className="flex min-h-screen bg-zinc-950 text-white">
        <DashboardNav />
        <main className="flex-1 overflow-y-auto bg-zinc-950">
          {/* Composant invisible qui applique automatiquement les codes promo après connexion */}
          <PromoRedeemer />
          {/* Gestionnaire d'onboarding interactif */}
          <OnboardingManager />
          {children}
        </main>
      </div>
    </LiveFeedProvider>
  )
}
