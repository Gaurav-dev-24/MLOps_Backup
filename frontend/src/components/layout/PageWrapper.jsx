import React from 'react';
import { Navbar } from './Navbar';

export function PageWrapper({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
          {children}
        </div>
      </main>
    </div>
  );
}
