"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/vs2015.css';

export default function MarkdownRenderer({ content, className = "" }) {
  if (!content) {
    return null;
  }

  const components = {
    // Code blocks with syntax highlighting
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (inline) {
        return (
          <code className="bg-[#e8c547]/20 text-[#e8c547] px-1.5 py-0.5 rounded-md text-sm" {...props}>
            {children}
          </code>
        );
      }

      return (
        <div className="relative my-4">
          {language && (
            <div className="absolute top-2 right-2 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded z-10">
              {language}
            </div>
          )}
          <pre className={`${language ? `hljs language-${language}` : ''} p-4 rounded-lg overflow-auto bg-gray-50 dark:bg-gray-900`}>
            <code className={language ? `language-${language}` : ''} {...props}>
              {String(children).replace(/\n$/, '')}
            </code>
          </pre>
        </div>
      );
    },
    
    // Custom responsive table
    table: ({ children }) => (
      <div className="overflow-x-auto my-4 w-full">
        <table className="w-full min-w-full">{children}</table>
      </div>
    ),
    
    // Custom responsive image
    img: ({ src, alt }) => (
      <div className="my-6 w-full overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full max-w-full h-auto rounded-lg border border-[#3e503e]/30"
        />
        {alt && (
          <p className="text-center text-sm text-gray-400 mt-2 italic">
            {alt}
          </p>
        )}
      </div>
    )
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 