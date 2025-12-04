import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Newspaper } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Newspaper className="h-8 w-8 text-primary" />
            <span className="text-2xl font-semibold">NewsFlow</span>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">Vérifiez votre email</CardTitle>
            <CardDescription className="text-center">
              Nous avons envoyé un lien de confirmation à votre adresse email
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-sm text-muted-foreground">
              Cliquez sur le lien dans l'email pour activer votre compte et commencer à personnaliser votre actualité.
            </p>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/auth/login">Retour à la connexion</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
