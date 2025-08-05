
import React from 'react';

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.23c.32.13.63.29.93.47.62.37 1.2.8 1.7 1.3.5.5.93 1.08 1.3 1.7.18.3.34.61.47.93h1.1a2.5 2.5 0 0 1 2.5 2.5v1.38c-.23.95-.57 1.84-1.03 2.65-.45.8-.98 1.5-1.58 2.1l-2.07 2.07a1.5 1.5 0 0 1-2.12 0l-1.07-1.06-1.06-1.07a1.5 1.5 0 0 1 0-2.12l2.07-2.07c.6-.6 1.13-1.3 1.58-2.1.46-.8.8-1.7 1.03-2.65V12a2.5 2.5 0 0 1-2.5-2.5h-1.1a4.34 4.34 0 0 0-.47.93c-.37.62-.8 1.2-1.3 1.7-.5.5-1.08.93-1.7 1.3a4.34 4.34 0 0 0-.93.47V15a2.5 2.5 0 0 1-2.5 2.5h-1.38c-.95-.23-1.84-.57-2.65-1.03-.8-.45-1.5-.98-2.1-1.58l-2.07-2.07a1.5 1.5 0 0 1 0-2.12l1.06-1.07 1.07-1.06a1.5 1.5 0 0 1 2.12 0l2.07 2.07c.6.6 1.3 1.13 2.1 1.58.8.46 1.7.8 2.65 1.03H9.5A2.5 2.5 0 0 1 7 9.5V8.4c.95.23 1.84.57 2.65 1.03.8.45 1.5.98 2.1 1.58l2.07 2.07a1.5 1.5 0 0 1 0 2.12l-1.06 1.07-1.07 1.06a1.5 1.5 0 0 1-2.12 0L7.4 14.5c-.6-.6-1.13-1.3-1.58-2.1-.46-.8-.8-1.7-1.03-2.65H3.5A2.5 2.5 0 0 1 1 7.25V5.5A2.5 2.5 0 0 1 3.5 3h1.23c.13-.32.29-.63.47-.93.37-.62.8-1.2 1.3-1.7.5-.5 1.08-.93 1.7-1.3.3-.18.61-.34.93-.47V2Z"/>
    </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-4">
        <BrainIcon />
        <div>
          <h1 className="text-3xl font-bold text-white">From <span className="text-cyan-400">.pth</span> to <span className="text-cyan-400">.exe</span></h1>
          <p className="text-md text-gray-400 mt-1">Your MONAI Deployment Guide for MLOps Engineers</p>
        </div>
      </div>
    </header>
  );
};
