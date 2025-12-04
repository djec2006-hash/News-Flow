import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Row,
  Column,
} from "@react-email/components"
import * as React from "react"

interface FlowEmailProps {
  userName: string
  flowSummary: string
  flowDate: string
  sections: Array<{ title: string; content: string }>
  sources?: Array<{ name: string; type?: string }>
  topicsCovered?: string
}

export default function FlowEmail({
  userName = "Cher utilisateur",
  flowSummary = "Votre Flow du jour",
  flowDate = new Date().toLocaleDateString("fr-FR"),
  sections = [],
  sources = [],
  topicsCovered = "",
}: FlowEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{flowSummary}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header avec Logo/Branding */}
          <Section style={header}>
            <Heading style={logo}>📰 NewsFlow</Heading>
            <Text style={subtitle}>Votre briefing d'actualité personnalisé</Text>
          </Section>

          {/* Greeting */}
          <Section style={greetingSection}>
            <Text style={greeting}>Bonjour {userName},</Text>
            <Text style={intro}>
              Voici votre Flow du <strong>{flowDate}</strong>.
            </Text>
          </Section>

          {/* Titre Principal (Summary) */}
          <Section style={summarySection}>
            <Heading style={summaryTitle}>{flowSummary}</Heading>
            {topicsCovered && (
              <Text style={topicsText}>
                <strong>Sujets couverts :</strong> {topicsCovered}
              </Text>
            )}
          </Section>

          <Hr style={divider} />

          {/* Sections du Flow */}
          {sections.map((section, index) => (
            <Section key={index} style={sectionBlock}>
              <Heading style={sectionTitle}>{section.title}</Heading>
              <Text style={sectionContent}>{formatContent(section.content)}</Text>
            </Section>
          ))}

          {/* Sources */}
          {sources && sources.length > 0 && (
            <>
              <Hr style={divider} />
              <Section style={sourcesSection}>
                <Heading style={sourcesTitle}>📚 Sources</Heading>
                {sources.map((source, index) => (
                  <Text key={index} style={sourceItem}>
                    • <strong>{source.name}</strong> {source.type && `(${source.type})`}
                  </Text>
                ))}
              </Section>
            </>
          )}

          {/* Footer */}
          <Hr style={divider} />
          <Section style={footer}>
            <Text style={footerText}>
              Ce Flow a été généré spécialement pour vous par NewsFlow.
              <br />
              <Link href="https://votredomaine.com/dashboard" style={link}>
                Accéder au Dashboard
              </Link>
            </Text>
            <Text style={footerCopyright}>© 2024 NewsFlow. Tous droits réservés.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Fonction pour formater le contenu (convertir \n\n en paragraphes, etc.)
function formatContent(content: string): React.ReactNode {
  if (!content) return null

  // Séparer par double saut de ligne pour créer des paragraphes
  const paragraphs = content.split("\n\n").filter((p) => p.trim())

  return paragraphs.map((paragraph, index) => (
    <Text key={index} style={paragraph.startsWith("-") ? listItem : sectionContent}>
      {paragraph}
    </Text>
  ))
}

// 🎨 Styles (inspirés du Dashboard dark)
const main = {
  backgroundColor: "#09090b", // zinc-950
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
}

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
  paddingBottom: "24px",
  borderBottom: "1px solid #27272a", // zinc-800
}

const logo = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0 0 8px 0",
  background: "linear-gradient(to right, #818cf8, #a78bfa, #f0abfc)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}

const subtitle = {
  fontSize: "14px",
  color: "#a1a1aa", // zinc-400
  margin: 0,
}

const greetingSection = {
  marginBottom: "24px",
}

const greeting = {
  fontSize: "18px",
  color: "#ffffff",
  margin: "0 0 12px 0",
  fontWeight: "600",
}

const intro = {
  fontSize: "14px",
  color: "#d4d4d8", // zinc-300
  margin: 0,
}

const summarySection = {
  backgroundColor: "#18181b", // zinc-900
  padding: "24px",
  borderRadius: "12px",
  border: "1px solid #27272a",
  marginBottom: "32px",
}

const summaryTitle = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0 0 12px 0",
  lineHeight: "1.3",
}

const topicsText = {
  fontSize: "13px",
  color: "#a1a1aa",
  margin: 0,
}

const divider = {
  borderColor: "#27272a",
  margin: "32px 0",
}

const sectionBlock = {
  marginBottom: "32px",
}

const sectionTitle = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#a78bfa", // purple-400
  margin: "0 0 16px 0",
}

const sectionContent = {
  fontSize: "15px",
  color: "#e4e4e7", // zinc-200
  lineHeight: "1.6",
  margin: "0 0 12px 0",
}

const listItem = {
  fontSize: "14px",
  color: "#d4d4d8",
  lineHeight: "1.5",
  margin: "4px 0",
  paddingLeft: "8px",
}

const sourcesSection = {
  backgroundColor: "#18181b",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #27272a",
}

const sourcesTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#ffffff",
  margin: "0 0 12px 0",
}

const sourceItem = {
  fontSize: "13px",
  color: "#d4d4d8",
  margin: "6px 0",
}

const footer = {
  marginTop: "48px",
  textAlign: "center" as const,
}

const footerText = {
  fontSize: "13px",
  color: "#71717a", // zinc-500
  lineHeight: "1.5",
  margin: "0 0 12px 0",
}

const link = {
  color: "#818cf8", // indigo-400
  textDecoration: "underline",
}

const footerCopyright = {
  fontSize: "12px",
  color: "#52525b", // zinc-600
  margin: 0,
}



