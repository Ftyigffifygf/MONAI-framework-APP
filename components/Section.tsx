
import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4 border-b-2 border-gray-700 pb-2">{title}</h2>
      <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
        {children}
      </div>
    </section>
  );
};
