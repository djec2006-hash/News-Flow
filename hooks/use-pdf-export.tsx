"use client"

import { useState } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

// Fonction utilitaire pour convertir du Markdown simple en HTML
function markdownToHtml(markdown: string): string {
  let html = markdown
  
  // Gras : **texte** -> <strong>texte</strong>
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  
  // Italique : *texte* -> <em>texte</em>
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  
  // Listes à puces
  const lines = html.split('\n')
  let inList = false
  const processedLines: string[] = []
  
  lines.forEach((line) => {
    const trimmedLine = line.trim()
    
    if (trimmedLine.startsWith('- ')) {
      if (!inList) {
        processedLines.push('<ul>')
        inList = true
      }
      processedLines.push(`<li>${trimmedLine.substring(2)}</li>`)
    } else {
      if (inList) {
        processedLines.push('</ul>')
        inList = false
      }
      if (trimmedLine.length > 0) {
        processedLines.push(`<p>${trimmedLine}</p>`)
      }
    }
  })
  
  if (inList) {
    processedLines.push('</ul>')
  }
  
  return processedLines.join('\n')
}

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
      // 1️⃣ Créer une div hors-écran avec le Flow mis en forme
      const offScreenDiv = document.createElement("div")
      offScreenDiv.style.position = "absolute"
      offScreenDiv.style.left = "-9999px"
      offScreenDiv.style.top = "0"
      offScreenDiv.style.width = "800px" // Largeur fixe pour A4
      offScreenDiv.style.padding = "40px"
      offScreenDiv.style.backgroundColor = "#ffffff"
      offScreenDiv.style.color = "#000000"
      offScreenDiv.style.fontFamily = "Arial, sans-serif"

      // Parser le JSON pour obtenir les sections
      let parsedJson: any = null
      try {
        parsedJson = flowData.source_json ? JSON.parse(flowData.source_json) : null
      } catch (e) {
        console.error("Failed to parse source_json:", e)
      }

      // 2️⃣ Construire le HTML du Flow
      let htmlContent = `
        <div style="margin-bottom: 30px; border-bottom: 3px solid #6366f1; padding-bottom: 20px;">
          <h1 style="font-size: 28px; font-weight: bold; color: #6366f1; margin-bottom: 10px;">
            ${flowData.summary || "NewsFlow"}
          </h1>
          <p style="font-size: 14px; color: #666; margin: 0;">
            ${new Date(flowData.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      `

      // Si on a des sections structurées
      if (parsedJson?.sections && Array.isArray(parsedJson.sections)) {
        parsedJson.sections.forEach((section: any) => {
          htmlContent += `
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 20px; font-weight: bold; color: #6366f1; margin-bottom: 12px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
                ${section.title}
              </h2>
          `

          // Convertir le Markdown en HTML
          const contentHtml = markdownToHtml(section.content || "")
          
          // Ajouter des styles aux éléments HTML générés
          const styledContent = contentHtml
            .replace(/<p>/g, '<p style="margin: 10px 0; font-size: 14px; line-height: 1.8; color: #333;">')
            .replace(/<strong>/g, '<strong style="color: #000; font-weight: bold;">')
            .replace(/<em>/g, '<em style="font-style: italic;">')
            .replace(/<ul>/g, '<ul style="list-style-type: disc; margin-left: 20px; margin-bottom: 12px;">')
            .replace(/<li>/g, '<li style="margin: 6px 0; font-size: 14px; line-height: 1.6; color: #333;">')

          htmlContent += styledContent
          htmlContent += `</div>`
        })

        // Sources
        if (parsedJson.sources && parsedJson.sources.length > 0) {
          htmlContent += `
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              <h3 style="font-size: 16px; font-weight: bold; color: #6366f1; margin-bottom: 12px;">
                Sources
              </h3>
          `
          parsedJson.sources.forEach((source: any) => {
            htmlContent += `
              <div style="margin-bottom: 8px; font-size: 12px; color: #666;">
                • ${source.name || "Source"} ${source.note ? `- ${source.note}` : ""}
              </div>
            `
          })
          htmlContent += `</div>`
        }
      } else {
        // Fallback : affichage simple du body
        htmlContent += `
          <div style="font-size: 14px; line-height: 1.8; color: #333; white-space: pre-wrap;">
            ${flowData.body}
          </div>
        `
      }

      // Key Events
      if (flowData.key_events) {
        htmlContent += `
          <div style="margin-top: 25px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b;">
            <h3 style="font-size: 16px; font-weight: bold; color: #f59e0b; margin-bottom: 10px;">
              Événements clés
            </h3>
            <div style="font-size: 13px; line-height: 1.6; color: #333; white-space: pre-wrap;">
              ${flowData.key_events}
            </div>
          </div>
        `
      }

      offScreenDiv.innerHTML = htmlContent
      document.body.appendChild(offScreenDiv)

      // 3️⃣ Attendre un peu pour que le DOM se stabilise
      await new Promise((resolve) => setTimeout(resolve, 100))

      // 4️⃣ Capturer avec html2canvas
      const canvas = await html2canvas(offScreenDiv, {
        scale: 2, // Haute qualité
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })

      // 5️⃣ Générer le PDF
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Ajouter la première page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Ajouter des pages supplémentaires si nécessaire
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // 6️⃣ Télécharger le PDF
      const fileName = `NewsFlow - ${flowData.summary.substring(0, 50)} - ${new Date(flowData.created_at).toLocaleDateString("fr-FR")}.pdf`
      pdf.save(fileName)

      // 7️⃣ Nettoyer la div
      document.body.removeChild(offScreenDiv)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.")
    } finally {
      setIsGenerating(false)
    }
  }

  return { downloadFlowAsPDF, isGenerating }
}

