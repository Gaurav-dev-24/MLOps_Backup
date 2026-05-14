import React from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { UploadZone } from '../features/upload/UploadZone';

export default function Home() {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 text-center">
        
        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        
        <div className="space-y-6 max-w-3xl mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-4 border border-primary-100 dark:border-primary-800">
            AWS Serverless Powered
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Extract Data with <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-accent-400">
              AI Precision
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Transform unstructured documents into actionable data with enterprise-grade accuracy. 
            Leverage AWS Textract for automated, high-fidelity extraction within a secure, highly scalable serverless architecture.
          </p>
        </div>

        <UploadZone />
        
      </div>
    </PageWrapper>
  );
}
