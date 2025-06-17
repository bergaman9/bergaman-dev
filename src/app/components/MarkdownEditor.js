"use client";

import { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';

export default function MarkdownEditor({ 
  value = "", 
  onChange, 
  placeholder = "Write your content in Markdown...",
  className = "" 
}) {
  const [activeTab, setActiveTab] = useState('write');

  const handleInputChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const insertMarkdown = (syntax) => {
    const textarea = document.getElementById('markdown-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    const newCursorPos = start + syntax.before.length;

    switch (syntax.type) {
      case 'bold':
        newText = `${value.substring(0, start)}**${selectedText || 'bold text'}**${value.substring(end)}`;
        break;
      case 'italic':
        newText = `${value.substring(0, start)}_${selectedText || 'italic text'}_${value.substring(end)}`;
        break;
      case 'link':
        newText = `${value.substring(0, start)}[${selectedText || 'link text'}](url)${value.substring(end)}`;
        break;
      case 'image':
        newText = `${value.substring(0, start)}![${selectedText || 'alt text'}](image-url)${value.substring(end)}`;
        break;
      case 'code':
        if (selectedText.includes('\n')) {
          newText = `${value.substring(0, start)}\`\`\`\n${selectedText || 'code'}\n\`\`\`${value.substring(end)}`;
        } else {
          newText = `${value.substring(0, start)}\`${selectedText || 'code'}\`${value.substring(end)}`;
        }
        break;
      case 'heading':
        const lines = value.split('\n');
        const lineIndex = value.substring(0, start).split('\n').length - 1;
        lines[lineIndex] = `# ${lines[lineIndex] || 'Heading'}`;
        newText = lines.join('\n');
        break;
      case 'list':
        const listLines = value.split('\n');
        const listLineIndex = value.substring(0, start).split('\n').length - 1;
        listLines[listLineIndex] = `- ${listLines[listLineIndex] || 'List item'}`;
        newText = listLines.join('\n');
        break;
      case 'quote':
        const quoteLines = value.split('\n');
        const quoteLineIndex = value.substring(0, start).split('\n').length - 1;
        quoteLines[quoteLineIndex] = `> ${quoteLines[quoteLineIndex] || 'Quote'}`;
        newText = quoteLines.join('\n');
        break;
      default:
        newText = `${value.substring(0, start)}${syntax.before}${selectedText}${syntax.after}${value.substring(end)}`;
    }

    if (onChange) {
      onChange(newText);
    }

    // Set cursor position after a brief delay to allow state update
    setTimeout(() => {
      textarea.focus();
      if (syntax.type === 'bold' || syntax.type === 'italic') {
        textarea.setSelectionRange(newCursorPos, newCursorPos + (selectedText || syntax.type + ' text').length);
      }
    }, 10);
  };

  const toolbarButtons = [
    { icon: 'fas fa-bold', title: 'Bold', action: () => insertMarkdown({ type: 'bold' }) },
    { icon: 'fas fa-italic', title: 'Italic', action: () => insertMarkdown({ type: 'italic' }) },
    { icon: 'fas fa-heading', title: 'Heading', action: () => insertMarkdown({ type: 'heading' }) },
    { icon: 'fas fa-link', title: 'Link', action: () => insertMarkdown({ type: 'link' }) },
    { icon: 'fas fa-image', title: 'Image', action: () => insertMarkdown({ type: 'image' }) },
    { icon: 'fas fa-code', title: 'Code', action: () => insertMarkdown({ type: 'code' }) },
    { icon: 'fas fa-list-ul', title: 'List', action: () => insertMarkdown({ type: 'list' }) },
    { icon: 'fas fa-quote-right', title: 'Quote', action: () => insertMarkdown({ type: 'quote' }) },
  ];

  return (
    <div className={`border border-[#3e503e] rounded-lg overflow-hidden ${className}`}>
      {/* Tabs */}
      <div className="flex border-b border-[#3e503e] bg-[#1f2922]">
        <button
          type="button"
          onClick={() => setActiveTab('write')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'write'
              ? 'bg-[#2e3d29] text-[#e8c547] border-b-2 border-[#e8c547]'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <i className="fas fa-edit mr-2"></i>
          Write
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'preview'
              ? 'bg-[#2e3d29] text-[#e8c547] border-b-2 border-[#e8c547]'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <i className="fas fa-eye mr-2"></i>
          Preview
        </button>
      </div>

      {activeTab === 'write' ? (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-2 p-3 bg-[#1f2922] border-b border-[#3e503e] overflow-x-auto">
            {toolbarButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                onClick={button.action}
                className="p-2 text-gray-400 hover:text-[#e8c547] hover:bg-[#2e3d29] rounded transition-colors"
                title={button.title}
              >
                <i className={button.icon}></i>
              </button>
            ))}
          </div>

          {/* Editor */}
          <div className="relative">
            <textarea
              id="markdown-textarea"
              value={value}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="w-full h-96 p-4 bg-[#1a1f1c] text-gray-300 border-none resize-none focus:outline-none font-mono text-sm leading-relaxed"
              style={{ 
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' 
              }}
            />
          </div>
        </>
      ) : (
        // Preview
        <div className="h-96 overflow-y-auto p-4 bg-[#1a1f1c]">
          {value.trim() ? (
            <MarkdownRenderer content={value} />
          ) : (
            <div className="text-gray-500 text-center py-20">
              <i className="fas fa-eye-slash text-4xl mb-4"></i>
              <p>Nothing to preview yet</p>
              <p className="text-sm">Write some markdown to see the preview</p>
            </div>
          )}
        </div>
      )}

      {/* Footer with quick tips */}
      <div className="px-4 py-2 bg-[#1f2922] border-t border-[#3e503e] text-xs text-gray-500">
        <span className="inline-block mr-4">
          <i className="fas fa-info-circle mr-1"></i>
          Supports GitHub Flavored Markdown
        </span>
        <span className="inline-block mr-4">**bold**</span>
        <span className="inline-block mr-4">_italic_</span>
        <span className="inline-block mr-4">`code`</span>
        <span className="inline-block">[link](url)</span>
      </div>
    </div>
  );
} 