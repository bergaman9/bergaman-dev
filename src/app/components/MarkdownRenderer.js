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
    code({ inline, className, children, ...props }) {
      if (inline) {
        return (
          <code className="not-prose bg-[#0e1b12] text-[#e8c547] px-2 py-1 rounded text-sm font-mono border border-[#3e503e] inline-block" {...props}>
            {children}
          </code>
        );
      }
      return (
        <pre>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      );
    }

  };

  return (
    <article className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
      <style jsx global>{`
        .prose {
          max-width: 100%;
          color: #fff;
        }
        
        ${codeStyles}
        
        .prose img {
          margin: 2em 0;
          border-radius: 0.5rem;
        }
        .prose a {
          color: #e8c547;
          text-decoration: none;
        }
        .prose a:hover {
          text-decoration: underline;
        }
        .prose blockquote {
          border-left-color: #3e503e;
          background-color: #1f293750;
        }
        .prose h1, .prose h2, .prose h3, .prose h4 {
          color: #fff;
        }
        .prose ul, .prose ol {
          padding-left: 1.5em;
        }
      `}</style>
    </article>
  );
}

// Global styles for code blocks
const codeStyles = `
  .prose pre {
    margin: 1em 0;
    padding: 1em;
    border-radius: 0.5em;
    background-color: #0e1b12 !important;
    border: 1px solid #3e503e30;
    overflow-x: auto;
  }
  
  .prose pre code {
    background: none !important;
    color: inherit !important;
    padding: 0 !important;
    font-size: inherit !important;
  }
  
  .prose *:not(pre) > code {
    background-color: #0e1b12 !important;
    color: #e8c547 !important;
    padding: 0.25rem 0.5rem !important;
    border-radius: 0.375rem !important;
    font-size: 0.875em !important;
    font-family: 'Courier New', monospace !important;
    white-space: nowrap !important;
    border: 1px solid #3e503e !important;
    display: inline-block !important;
  }

  .prose > *:first-child {
    margin-top: 0 !important;
  }

  .prose > *:last-child {
    margin-bottom: 0 !important;
  }

  .prose p {
    margin: 1.5em 0;
  }
`; 