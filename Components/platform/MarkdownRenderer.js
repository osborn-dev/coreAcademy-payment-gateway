"use client";
import ReactMarkdown from "react-markdown";

// Renders a Markdown string with dark-theme styling. Tailwind v4 has no
// typography plugin, so each element is styled via the components map.
export default function MarkdownRenderer({ content }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1.5 mb-4 pl-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-1.5 mb-4 pl-2">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500/50 bg-black/[0.03] dark:bg-white/5 pl-4 py-2 my-4 text-gray-600 dark:text-gray-300 italic rounded-r-lg">
              {children}
            </blockquote>
          ),
          code: ({ inline, className, children }) => {
            if (inline) {
              return (
                <code className="bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className ?? ""} font-mono text-sm`}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl p-4 overflow-x-auto my-4 text-gray-800 dark:text-gray-200">
              {children}
            </pre>
          ),
          hr: () => <hr className="border-gray-200 dark:border-white/10 my-8" />,
          strong: ({ children }) => (
            <strong className="text-gray-900 dark:text-white font-semibold">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
