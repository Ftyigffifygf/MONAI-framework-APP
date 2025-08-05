
import React from 'react';

interface DirectoryTreeProps {
  structure: string;
}

export const DirectoryTree: React.FC<DirectoryTreeProps> = ({ structure }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
      <pre className="text-sm text-gray-300 font-mono">
        <code>
          {structure.trim()}
        </code>
      </pre>
    </div>
  );
};
