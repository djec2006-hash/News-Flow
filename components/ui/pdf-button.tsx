"use client"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { usePDFExport } from "@/hooks/use-pdf-export"

interface PDFButtonProps {
  flowData: {
    id: string
    summary: string
    created_at: string
    body: string
    source_json: string | null
    key_events?: string | null
    topics_covered?: string | null
  }
  variant?: "ghost" | "outline" | "default"
  size?: "sm" | "default" | "lg"
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export function PDFButton({ flowData, variant = "ghost", size = "sm", className = "", onClick }: PDFButtonProps) {
  const { downloadFlowAsPDF, isGenerating } = usePDFExport()

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation() // Empêcher la propagation du clic (important pour les cartes cliquables)
    
    if (onClick) {
      onClick(e)
    }

    await downloadFlowAsPDF(flowData)
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isGenerating}
      className={`text-zinc-500 hover:text-white transition-colors ${className}`}
      title="Télécharger en PDF"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2 hidden sm:inline">Génération...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">PDF</span>
        </>
      )}
    </Button>
  )
}





