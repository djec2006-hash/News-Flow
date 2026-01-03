"use client"

import { useState } from "react"
import { jsPDF } from "jspdf"

interface FlowData {
  id: string
  summary: string
  created_at: string
  body: string
  source_json: string | null
  key_events?: string | null
  topics_covered?: string | null
}

export function usePDFExport() {
  const [isGenerating, setIsGenerating] = useState(false)

  const downloadFlowAsPDF = async (flowData: FlowData) => {
    setIsGenerating(true)

    try {
      // Initialiser le document PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pageWidth = 210 // Largeur A4 en mm
      const pageHeight = 297 // Hauteur A4 en mm
      const margin = 20 // Marges en mm
      const maxWidth = pageWidth - 2 * margin // Largeur maximale du texte (170mm)
      let yPosition = margin // Position Y actuelle

      // Fonction pour ajouter une nouvelle page si nécessaire
      const checkPageBreak = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          doc.addPage()
          yPosition = margin
          return true
        }
        return false
      }

      // En-tête : Titre "NewsFlow - Rapport"
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("NewsFlow - Rapport de Veille", margin, yPosition)
      yPosition += 10

      // Date de génération
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      const dateStr = new Date(flowData.created_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      doc.text(`Généré le : ${dateStr}`, margin, yPosition)
      yPosition += 10

      // Ligne de séparation
      doc.setLineWidth(0.5)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 8

      // Parser le JSON pour obtenir les sections
      let parsedJson: any = null
      try {
        parsedJson = flowData.source_json ? JSON.parse(flowData.source_json) : null
      } catch (e) {
        console.error("Failed to parse source_json:", e)
      }

      // Titre du Flow (Summary)
      if (flowData.summary) {
        checkPageBreak(15)
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        const titleLines = doc.splitTextToSize(flowData.summary, maxWidth)
        doc.text(titleLines, margin, yPosition)
        yPosition += titleLines.length * 7 + 5
      }

      // Contenu : Sections structurées ou body simple
      if (parsedJson?.sections && Array.isArray(parsedJson.sections)) {
        parsedJson.sections.forEach((section: any) => {
          checkPageBreak(20)
          
          // Titre de section
          doc.setFontSize(14)
          doc.setFont("helvetica", "bold")
          const sectionTitleLines = doc.splitTextToSize(section.title || "", maxWidth)
          doc.text(sectionTitleLines, margin, yPosition)
          yPosition += sectionTitleLines.length * 6 + 5

          // Contenu de la section
          if (section.content) {
            checkPageBreak(15)
            doc.setFontSize(11)
            doc.setFont("helvetica", "normal")
            // Nettoyer le markdown basique (enlever ** et *)
            let cleanContent = section.content
              .replace(/\*\*\*([^*]+)\*\*\*/g, "$1") // Gras + Italique
              .replace(/\*\*([^*]+)\*\*/g, "$1") // Gras
              .replace(/\*([^*]+)\*/g, "$1") // Italique
              .replace(/^- /gm, "• ") // Listes à puces
            
            const contentLines = doc.splitTextToSize(cleanContent, maxWidth)
            doc.text(contentLines, margin, yPosition)
            yPosition += contentLines.length * 5 + 8
          }
        })

        // Sources
        if (parsedJson.sources && parsedJson.sources.length > 0) {
          checkPageBreak(20)
          yPosition += 5
          doc.setFontSize(12)
          doc.setFont("helvetica", "bold")
          doc.text("Sources", margin, yPosition)
          yPosition += 8

          doc.setFontSize(10)
          doc.setFont("helvetica", "normal")
          parsedJson.sources.forEach((source: any) => {
            checkPageBreak(8)
            const sourceText = `• ${source.name || "Source"}${source.note ? ` - ${source.note}` : ""}`
            const sourceLines = doc.splitTextToSize(sourceText, maxWidth)
            doc.text(sourceLines, margin, yPosition)
            yPosition += sourceLines.length * 5 + 3
          })
        }
      } else {
        // Fallback : affichage simple du body
        checkPageBreak(15)
        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")
        // Nettoyer le markdown basique
        let cleanBody = flowData.body
          .replace(/\*\*\*([^*]+)\*\*\*/g, "$1")
          .replace(/\*\*([^*]+)\*\*/g, "$1")
          .replace(/\*([^*]+)\*/g, "$1")
          .replace(/^- /gm, "• ")
        
        const bodyLines = doc.splitTextToSize(cleanBody, maxWidth)
        doc.text(bodyLines, margin, yPosition)
        yPosition += bodyLines.length * 5
      }

      // Key Events (si présent)
      if (flowData.key_events) {
        checkPageBreak(20)
        yPosition += 8
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("Événements clés", margin, yPosition)
        yPosition += 8

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        let cleanKeyEvents = flowData.key_events
          .replace(/\*\*\*([^*]+)\*\*\*/g, "$1")
          .replace(/\*\*([^*]+)\*\*/g, "$1")
          .replace(/\*([^*]+)\*/g, "$1")
        
        const keyEventsLines = doc.splitTextToSize(cleanKeyEvents, maxWidth)
        doc.text(keyEventsLines, margin, yPosition)
      }

      // Nom du fichier avec date
      const dateForFileName = new Date(flowData.created_at).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, "-")
      const fileName = `NewsFlow_Rapport_${dateForFileName}.pdf`

      // Télécharger le PDF
      doc.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.")
    } finally {
      setIsGenerating(false)
    }
  }

  return { downloadFlowAsPDF, isGenerating }
}

