'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// ANCIEN CODE: Détection si le contenu est du HTML (contient des balises HTML)
// On garde cette logique pour la compatibilité avec l'ancien format markdown
function isHTML(content: string): boolean {
  // Détecte si le contenu contient des balises HTML (h2, h3, ul, li, p, blockquote, etc.)
  const htmlTagPattern = /<\/?(h[1-6]|p|ul|li|blockquote|strong|em|div|span)[^>]*>/i;
  return htmlTagPattern.test(content);
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // NOUVEAU CODE: Si le contenu est du HTML, on l'affiche directement avec dangerouslySetInnerHTML
  if (isHTML(content)) {
    return (
      <div
        className={`prose prose-invert prose-p:text-gray-300 prose-headings:font-bold prose-headings:text-white prose-strong:text-indigo-400 prose-li:text-gray-300 prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-2 prose-ul:my-4 prose-ul:marker:text-indigo-500 prose-blockquote:border-l-indigo-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-zinc-400 max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // ANCIEN CODE: Fallback pour le format Markdown (compatibilité)
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          strong: ({node, ...props}) => <span className="font-bold text-white" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 my-4 marker:text-indigo-500" {...props} />,
          li: ({node, ...props}) => <li className="text-zinc-300 pl-1 text-lg" {...props} />,
          p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-zinc-300 text-lg" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-4 mt-6" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-bold text-indigo-300 mb-3 mt-6" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-white mb-2 mt-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}






