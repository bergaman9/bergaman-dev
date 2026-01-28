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

  // Custom component renderers
  const components = {
    // Handle code blocks and inline code
    code({ node, inline, className: codeClassName, children, ...props }) {
      const match = /language-(\w+)/.exec(codeClassName || '');
      const isInline = inline || (!match && !codeClassName);

      if (isInline) {
        // Inline code - rendered as simple span-like element
        return (
          <code
            style={{
              backgroundColor: '#1a2e1a',
              color: '#e8c547',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.9em',
              fontFamily: "'Fira Code', 'Courier New', monospace",
              border: '1px solid #3e503e',
            }}
            {...props}
          >
            {children}
          </code>
        );
      }

      // Code block
      return (
        <code className={codeClassName} {...props}>
          {children}
        </code>
      );
    },

    // Pre element wrapper for code blocks
    pre({ children, ...props }) {
      return (
        <pre
          style={{
            backgroundColor: '#0e1b12',
            border: '1px solid #3e503e',
            borderRadius: '8px',
            padding: '1rem',
            margin: '1rem 0',
            overflowX: 'auto',
          }}
          {...props}
        >
          {children}
        </pre>
      );
    },

    // Headings
    h1({ children, ...props }) {
      return <h1 style={{ color: '#e8c547', fontSize: '2rem', fontWeight: 'bold', margin: '1.5rem 0 1rem' }} {...props}>{children}</h1>;
    },
    h2({ children, ...props }) {
      return <h2 style={{ color: '#e8c547', fontSize: '1.5rem', fontWeight: 'bold', margin: '1.25rem 0 0.75rem' }} {...props}>{children}</h2>;
    },
    h3({ children, ...props }) {
      return <h3 style={{ color: '#e8c547', fontSize: '1.25rem', fontWeight: 'bold', margin: '1rem 0 0.5rem' }} {...props}>{children}</h3>;
    },
    h4({ children, ...props }) {
      return <h4 style={{ color: '#e8c547', fontSize: '1.1rem', fontWeight: 'bold', margin: '0.75rem 0 0.5rem' }} {...props}>{children}</h4>;
    },

    // Paragraph
    p({ children, ...props }) {
      return <p style={{ margin: '1rem 0', lineHeight: '1.7', color: '#d1d5db' }} {...props}>{children}</p>;
    },

    // Links
    a({ children, href, ...props }) {
      return (
        <a
          href={href}
          style={{ color: '#e8c547', textDecoration: 'none' }}
          onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },

    // Lists
    ul({ children, ...props }) {
      return <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem', listStyleType: 'disc', color: '#d1d5db' }} {...props}>{children}</ul>;
    },
    ol({ children, ...props }) {
      return <ol style={{ margin: '1rem 0', paddingLeft: '1.5rem', listStyleType: 'decimal', color: '#d1d5db' }} {...props}>{children}</ol>;
    },
    li({ children, ...props }) {
      return <li style={{ margin: '0.5rem 0', lineHeight: '1.6' }} {...props}>{children}</li>;
    },

    // Blockquote
    blockquote({ children, ...props }) {
      return (
        <blockquote
          style={{
            borderLeft: '4px solid #e8c547',
            margin: '1rem 0',
            fontStyle: 'normal',
            color: '#d1d5db',
            backgroundColor: '#2e3d29',
            padding: '0.75rem 1rem',
            borderRadius: '0 8px 8px 0',
            maxWidth: '100%',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
          {...props}
        >
          {children}
        </blockquote>
      );
    },

    table({ children, ...props }) {
      return (
        <div style={{ overflowX: 'auto', margin: '1rem 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }} {...props}>
            {children}
          </table>
        </div>
      );
    },
    thead({ children, ...props }) {
      return <thead style={{ backgroundColor: '#2e3d29' }} {...props}>{children}</thead>;
    },
    tbody({ children, ...props }) {
      return <tbody {...props}>{children}</tbody>;
    },
    th({ children, ...props }) {
      return <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#e8c547', fontWeight: '600', borderBottom: '2px solid #3e503e', backgroundColor: '#2e3d29' }} {...props}>{children}</th>;
    },
    td({ children, ...props }) {
      return <td style={{ padding: '0.75rem 1rem', color: '#d1d5db', borderBottom: '1px solid #3e503e30' }} {...props}>{children}</td>;
    },
    tr({ children, ...props }) {
      return <tr style={{ backgroundColor: 'transparent', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3e503e20'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'} {...props}>{children}</tr>;
    },

    // Horizontal rule
    hr({ ...props }) {
      return <hr style={{ border: 'none', borderTop: '1px solid #3e503e', margin: '2rem 0' }} {...props} />;
    },

    // Strong and emphasis
    strong({ children, ...props }) {
      return <strong style={{ fontWeight: '700', color: '#ffffff' }} {...props}>{children}</strong>;
    },
    em({ children, ...props }) {
      return <em style={{ fontStyle: 'italic', color: '#9ca3af' }} {...props}>{children}</em>;
    },

    // Images
    img({ src, alt, ...props }) {
      return (
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            margin: '1.5rem 0',
            border: '1px solid #3e503e',
          }}
          {...props}
        />
      );
    },
  };

  return (
    <div className={`markdown-rendered ${className}`}>
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