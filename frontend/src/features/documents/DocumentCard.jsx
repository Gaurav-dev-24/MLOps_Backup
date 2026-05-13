import React from 'react';
import { FileText, CheckCircle2, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export function DocumentCard({ document }) {
  const isCompleted = document.status === 'COMPLETED';
  const isProcessing = document.status === 'PROCESSING';
  const isFailed = document.status === 'FAILED';

  const statusColors = {
    COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20',
    PROCESSING: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    FAILED: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20'
  };

  const StatusIcon = isCompleted ? CheckCircle2 : (isFailed ? AlertCircle : Clock);

  return (
    <Link 
      to={`/documents/${document.id}`}
      className="block group relative glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10 border-slate-200 dark:border-dark-800"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex justify-between items-start mb-4">
        <div className="p-3 bg-primary-50 dark:bg-dark-800 rounded-xl text-primary-600 dark:text-primary-400">
          <FileText className="h-6 w-6" />
        </div>
        <div className={cn("px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border", statusColors[document.status])}>
          <StatusIcon className={cn("h-3 w-3", isProcessing && "animate-spin")} />
          {document.status}
        </div>
      </div>

      <div className="relative">
        <h3 className="font-semibold text-lg text-slate-900 dark:text-white truncate mb-1" title={document.filename}>
          {document.filename}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {new Date(document.upload_time).toLocaleString()}
        </p>

        {isCompleted && document.extracted_fields && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(document.extracted_fields).slice(0, 2).map((key) => (
              <span key={key} className="text-xs bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-dark-700 truncate max-w-full">
                {key}
              </span>
            ))}
            {Object.keys(document.extracted_fields).length > 2 && (
              <span className="text-xs bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-dark-700">
                +{Object.keys(document.extracted_fields).length - 2} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="relative flex items-center justify-between pt-4 border-t border-slate-100 dark:border-dark-800 mt-auto">
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300">
          View Details
        </span>
        <div className="h-8 w-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
