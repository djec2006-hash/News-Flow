'use client';

import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    // CORRECTION : On met la classe ici, pas dans ReactMarkdown
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          strong: ({node, ...props}) => <span className="font-bold text-white" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 my-4 marker:text-indigo-500" {...props} />,
          li: ({node, ...props}) => <li className="text-zinc-300 pl-1" {...props} />,
          p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-zinc-300" {...props} />,
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



