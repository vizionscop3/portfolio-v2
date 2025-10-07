import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string): string => {
    let html = text;

    // Headers
    html = html.replace(
      /^### (.*$)/gim,
      '<h3 class="text-xl font-semibold mb-4 mt-6">$1</h3>'
    );
    html = html.replace(
      /^## (.*$)/gim,
      '<h2 class="text-2xl font-bold mb-6 mt-8">$1</h2>'
    );
    html = html.replace(
      /^# (.*$)/gim,
      '<h1 class="text-3xl font-bold mb-8 mt-8">$1</h1>'
    );

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
      const language = lang || 'text';
      return `<div class="bg-gray-900 rounded-lg p-4 my-6 overflow-x-auto">
        <div class="text-gray-400 text-sm mb-2">${language}</div>
        <pre class="text-green-400 font-mono text-sm"><code>${escapeHtml(code.trim())}</code></pre>
      </div>`;
    });

    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>'
    );

    // Bold
    html = html.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold">$1</strong>'
    );

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-4">');
    html = '<p class="mb-4">' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p class="mb-4"><\/p>/g, '');

    return html;
  };

  const escapeHtml = (text: string): string => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  return (
    <div
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{
        __html: parseMarkdown(content),
      }}
    />
  );
};
