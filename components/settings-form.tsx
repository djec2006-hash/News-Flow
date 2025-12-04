"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const GENERAL_DOMAINS = [
  "macro",
  "finance",
  "crypto",
  "tech",
  "politique",
  "géopolitique",
  "société",
  "sport",
  "culture/médias",
]

const FINANCIAL_MARKETS = ["forex", "indices", "crypto", "actions US", "actions EU", "matières premières"]

const REGIONS = ["US", "Europe", "France", "Chine", "Russie", "Moyen-Orient", "Afrique", "Amérique Latine", "Asie"]

interface SettingsFormProps {
  profile: {
    full_name?: string
    age?: number
    education_level?: string
    current_activity?: string
    complexity_level?: string
    language?: string
  } | null
  preferences: {
    general_domains?: string[]
    financial_markets?: string[]
    regions?: string[]
    receive_daily_email?: boolean
    email_time_local?: string
    allow_on_demand_recaps?: boolean
    max_on_demand_per_week?: number
  } | null
  userId: string
}

export function SettingsForm({ profile, preferences, userId }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const supabase = createClient()

  // Profile state
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [age, setAge] = useState(profile?.age?.toString() || "")
  const [educationLevel, setEducationLevel] = useState(profile?.education_level || "")
  const [currentActivity, setCurrentActivity] = useState(profile?.current_activity || "")
  const [complexityLevel, setComplexityLevel] = useState(profile?.complexity_level || "standard")
  const [language, setLanguage] = useState(profile?.language || "FR")

  // Preferences state
  const [generalDomains, setGeneralDomains] = useState<string[]>(preferences?.general_domains || [])
  const [financialMarkets, setFinancialMarkets] = useState<string[]>(preferences?.financial_markets || [])
  const [regions, setRegions] = useState<string[]>(preferences?.regions || [])
  const [receiveDailyEmail, setReceiveDailyEmail] = useState(preferences?.receive_daily_email ?? true)
  const [emailTimeLocal, setEmailTimeLocal] = useState(preferences?.email_time_local || "08:00")
  const [allowOnDemandRecaps, setAllowOnDemandRecaps] = useState(preferences?.allow_on_demand_recaps ?? true)
  const [maxOnDemandPerWeek, setMaxOnDemandPerWeek] = useState(preferences?.max_on_demand_per_week || 5)

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item))
    } else {
      setter([...array, item])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          age: Number.parseInt(age),
          education_level: educationLevel,
          current_activity: currentActivity,
          complexity_level: complexityLevel,
          language: language,
        })
        .eq("id", userId)

      if (profileError) throw profileError

      // Update preferences
      const { error: preferencesError } = await supabase.from("content_preferences").upsert({
        user_id: userId,
        general_domains: generalDomains,
        financial_markets: financialMarkets,
        regions: regions,
        receive_daily_email: receiveDailyEmail,
        email_time_local: emailTimeLocal,
        allow_on_demand_recaps: allowOnDemandRecaps,
        max_on_demand_per_week: maxOnDemandPerWeek,
        updated_at: new Date().toISOString(),
      })

      if (preferencesError) throw preferencesError

      setMessage("Paramètres mis à jour avec succès")
      router.refresh()
    } catch (error) {
      console.error("Settings update error:", error)
      setMessage("Une erreur est survenue lors de la mise à jour")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`rounded-md p-4 ${message.includes("succès") ? "bg-green-500/10 border border-green-500/20 text-green-600" : "bg-destructive/10 border border-destructive/20 text-destructive"}`}
        >
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Mettez à jour vos informations de profil</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Âge</Label>
              <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="educationLevel">Niveau d'études</Label>
            <Select value={educationLevel} onValueChange={setEducationLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lycée">Lycée</SelectItem>
                <SelectItem value="bac">Baccalauréat</SelectItem>
                <SelectItem value="bac+2">Bac+2</SelectItem>
                <SelectItem value="bac+3">Bac+3 (Licence)</SelectItem>
                <SelectItem value="bac+5">Bac+5 (Master)</SelectItem>
                <SelectItem value="doctorat">Doctorat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentActivity">Activité actuelle</Label>
            <Textarea
              id="currentActivity"
              value={currentActivity}
              onChange={(e) => setCurrentActivity(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="complexityLevel">Niveau de complexité</Label>
              <Select value={complexityLevel} onValueChange={setComplexityLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple (vulgarisé)</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="expert">Expert (technique)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FR">Français</SelectItem>
                  <SelectItem value="EN">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Préférences de contenu</CardTitle>
          <CardDescription>Personnalisez les thématiques qui vous intéressent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Domaines généraux</Label>
            <div className="grid grid-cols-2 gap-3">
              {GENERAL_DOMAINS.map((domain) => (
                <div key={domain} className="flex items-center space-x-2">
                  <Checkbox
                    id={`settings-${domain}`}
                    checked={generalDomains.includes(domain)}
                    onCheckedChange={() => toggleArrayItem(generalDomains, domain, setGeneralDomains)}
                  />
                  <Label htmlFor={`settings-${domain}`} className="font-normal cursor-pointer">
                    {domain}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Marchés financiers</Label>
            <div className="grid grid-cols-2 gap-3">
              {FINANCIAL_MARKETS.map((market) => (
                <div key={market} className="flex items-center space-x-2">
                  <Checkbox
                    id={`settings-${market}`}
                    checked={financialMarkets.includes(market)}
                    onCheckedChange={() => toggleArrayItem(financialMarkets, market, setFinancialMarkets)}
                  />
                  <Label htmlFor={`settings-${market}`} className="font-normal cursor-pointer">
                    {market}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Régions géographiques</Label>
            <div className="grid grid-cols-2 gap-3">
              {REGIONS.map((region) => (
                <div key={region} className="flex items-center space-x-2">
                  <Checkbox
                    id={`settings-${region}`}
                    checked={regions.includes(region)}
                    onCheckedChange={() => toggleArrayItem(regions, region, setRegions)}
                  />
                  <Label htmlFor={`settings-${region}`} className="font-normal cursor-pointer">
                    {region}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Préférences d'envoi</CardTitle>
          <CardDescription>Gérez vos notifications et emails</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="receiveDailyEmail" className="text-base">
                  Recevoir un email quotidien
                </Label>
                <p className="text-sm text-muted-foreground">Recevez votre recap directement dans votre boîte mail</p>
              </div>
              <Switch id="receiveDailyEmail" checked={receiveDailyEmail} onCheckedChange={setReceiveDailyEmail} />
            </div>

            {receiveDailyEmail && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                <Label htmlFor="emailTimeLocal">Heure d'envoi</Label>
                <Input
                  id="emailTimeLocal"
                  type="time"
                  value={emailTimeLocal}
                  onChange={(e) => setEmailTimeLocal(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-4 p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowOnDemandRecaps" className="text-base">
                  Recaps à la demande
                </Label>
                <p className="text-sm text-muted-foreground">Générez des recaps quand vous le souhaitez</p>
              </div>
              <Switch id="allowOnDemandRecaps" checked={allowOnDemandRecaps} onCheckedChange={setAllowOnDemandRecaps} />
            </div>

            {allowOnDemandRecaps && (
              <div className="space-y-2 pl-4 border-l-2 border-accent/20">
                <Label htmlFor="maxOnDemandPerWeek">Nombre maximum par semaine</Label>
                <Input
                  id="maxOnDemandPerWeek"
                  type="number"
                  min="1"
                  max="50"
                  value={maxOnDemandPerWeek}
                  onChange={(e) => setMaxOnDemandPerWeek(Number.parseInt(e.target.value))}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          "Enregistrer les modifications"
        )}
      </Button>
    </form>
  )
}
