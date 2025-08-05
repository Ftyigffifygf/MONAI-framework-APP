
import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);


export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden relative border border-gray-700">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-semibold text-gray-400 uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center text-xs text-gray-400 hover:text-white transition-colors duration-200"
        >
          {isCopied ? (
            <>
              <CheckIcon className="w-4 h-4 mr-1 text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-4 h-4 mr-1" />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className={`language-${language}`}>
          {code.trim()}
        </code>
      </pre>
    </div>
  );
};
