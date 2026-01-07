'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Détection si le contenu est du HTML (contient des balises HTML)
function isHTML(content: string): boolean {
  const htmlTagPattern = /<\/?(h[1-6]|p|ul|li|blockquote|strong|em|div|span)[^>]*>/i;
  return htmlTagPattern.test(content);
}

// Met en évidence les nombres / pourcentages / montants dans une chaîne HTML ou Markdown
function highlightNumbers(text: string): string {
  // Capture : nombres, pourcentages, montants avec séparateurs, signe +/-
  const numberRegex = /([+\-]?\d[\d\s.,]*(?:%|(?:\s?(?:\$|€)))?)/g
  return text.replace(
    numberRegex,
    (_match, grp) =>
      `<span class="font-mono text-white underline decoration-white/30 decoration-1 underline-offset-2">${grp}</span>`,
  )
}

// Rend les enfants en appliquant le highlight uniquement sur les segments texte
function renderChildrenWithHighlight(children: React.ReactNode) {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return <span dangerouslySetInnerHTML={{ __html: highlightNumbers(child) }} />
    }
    return child
  })
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Sécurité anti-crash
  if (!content) return null;

  // Prétraitement pour surligner les nombres
  const highlightedContent = highlightNumbers(content);

  // Si le contenu est du HTML, on l'affiche avec un style Bloomberg Terminal optimisé
  if (isHTML(content)) {
    return (
      <div
        className={`
          bloomberg-terminal-content
          prose prose-invert max-w-none
          
          /* Titres H2 - Sections principales */
          prose-h2:text-2xl prose-h2:md:text-3xl 
          prose-h2:font-bold prose-h2:text-white 
          prose-h2:mb-4 prose-h2:mt-8
          prose-h2:pb-2 prose-h2:border-b prose-h2:border-indigo-500/30
          
          /* Titres H3 - Sous-sections */
          prose-h3:text-xl prose-h3:md:text-2xl
          prose-h3:font-semibold prose-h3:text-indigo-300
          prose-h3:underline prose-h3:decoration-indigo-500/50 prose-h3:underline-offset-4
          prose-h3:mb-3 prose-h3:mt-6
          
          /* Paragraphes */
          prose-p:text-base prose-p:md:text-lg
          prose-p:leading-relaxed prose-p:md:leading-relaxed
          prose-p:text-zinc-300 prose-p:mb-6
          
          /* Strong/Bold - Marqueurs de section visibles (Violet souligné) */
          prose-strong:font-bold prose-strong:text-indigo-400
          prose-strong:font-mono
          prose-strong:underline prose-strong:decoration-indigo-500/50
          prose-strong:underline-offset-4
          
          /* Listes */
          prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-3 prose-ul:my-5
          prose-ul:marker:text-indigo-500 prose-ul:marker:text-lg
          prose-li:text-base prose-li:md:text-lg
          prose-li:text-zinc-300 prose-li:pl-2
          prose-li:leading-relaxed
          
          /* Listes imbriquées */
          prose-ul:prose-ul:mt-2 prose-ul:prose-ul:mb-2
          
          /* Blockquotes - Notes d'analyste */
          prose-blockquote:border-l-4 prose-blockquote:border-indigo-500
          prose-blockquote:bg-indigo-500/5
          prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4
          prose-blockquote:italic prose-blockquote:text-zinc-400
          prose-blockquote:rounded-r-lg
          prose-blockquote:my-6
          
          /* Links (si présents) */
          prose-a:text-indigo-400 prose-a:underline prose-a:underline-offset-4
          prose-a:decoration-indigo-500/30
          prose-a:transition-colors prose-a:duration-200
          hover:prose-a:text-indigo-300 hover:prose-a:decoration-indigo-400
          
          /* Code inline (si présent) */
          prose-code:text-indigo-400 prose-code:bg-indigo-500/10
          prose-code:px-2 prose-code:py-0.5 prose-code:rounded
          prose-code:font-mono prose-code:text-sm
          prose-code:border prose-code:border-indigo-500/20
          
          ${className}
        `}
        dangerouslySetInnerHTML={{ __html: highlightedContent }}
      />
    );
  }

  // Fallback pour le format Markdown (rétro-compatibilité ou si l'IA sort du markdown pur)
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[]}
        rehypePlugins={[]}
        components={{
          strong: ({node, ...props}) => (
            <span className="font-bold font-mono text-indigo-400 underline decoration-indigo-500/50 underline-offset-4" {...props} />
          ),
          p: ({node, children, ...props}) => {
            return (
              <p
                className="mb-6 leading-relaxed text-zinc-300 text-base md:text-lg"
                {...props}
              >
                {renderChildrenWithHighlight(children)}
              </p>
            );
          },
          ul: ({node, ...props}) => (
            <ul className="list-disc pl-6 space-y-3 my-5 marker:text-indigo-500 marker:text-lg" {...props} />
          ),
          li: ({node, ...props}) => (
            <li className="text-zinc-300 pl-2 text-base md:text-lg leading-relaxed">
              {renderChildrenWithHighlight(props.children)}
            </li>
          ),
          h1: ({node, ...props}) => (
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 mt-6 pb-2 border-b border-indigo-500/30" {...props} />
          ),
          h2: ({node, ...props}) => (
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 mt-8 pb-2 border-b border-indigo-500/30" {...props} />
          ),
          h3: ({node, ...props}) => (
            <h3 className="text-xl md:text-2xl font-semibold text-indigo-300 mb-3 mt-6" {...props} />
          ),
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-indigo-500 bg-indigo-500/5 pl-6 pr-4 py-4 italic text-zinc-400 rounded-r-lg my-6" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}