
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = "" 
}) => {
  return (
    <div className={`prose prose-sm max-w-none text-gray-800 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-lg font-semibold mb-2 text-gray-800">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-semibold mb-2 text-gray-800">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-gray-800">{children}</h3>,
          p: ({ children }) => <p className="mb-2 text-gray-800 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-gray-800">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-700 mb-2">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono text-gray-800">
                {children}
              </code>
            ) : (
              <code className="block bg-gray-100 p-2 rounded text-sm font-mono text-gray-800 overflow-x-auto">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-100 p-3 rounded-lg mb-2 overflow-x-auto">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
