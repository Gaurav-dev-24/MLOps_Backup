import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { documentService } from '../services/documentService';
import { Loader2, ArrowLeft, Download, FileJson, Table, Type, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';

export default function DocumentDetails() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fields'); // fields, json, tables

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        console.error("Failed to fetch document", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchDoc();
  }, [id]);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500 mb-4" />
          <p className="text-lg">Loading document details...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!document) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Document not found</h2>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const tabs = [
    { id: 'fields', label: 'Extracted Fields', icon: Type },
    { id: 'tables', label: 'Tables', icon: Table },
    { id: 'json', label: 'Raw JSON', icon: FileJson },
  ];

  return (
    <PageWrapper>
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-dark-800">
          <div>
            <h1 className="text-3xl font-bold mb-2 break-all">{document.filename}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-dark-800 px-3 py-1 rounded-full border border-slate-200 dark:border-dark-700">
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  document.status === 'COMPLETED' ? "bg-green-500" :
                  document.status === 'PROCESSING' ? "bg-blue-500 animate-pulse" : "bg-red-500"
                )} />
                {document.status}
              </span>
              <span>Uploaded: {new Date(document.upload_time).toLocaleString()}</span>
              <span className="font-mono text-xs bg-slate-100 dark:bg-dark-800 px-2 py-1 rounded-md border border-slate-200 dark:border-dark-700">ID: {document.id}</span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1 md:flex-none">
              <ExternalLink className="h-4 w-4 mr-2" />
              Original
            </Button>
            <Button className="flex-1 md:flex-none">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {document.status === 'COMPLETED' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Tabs Navigation */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left",
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800/50 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-dark-800 hover:text-slate-900 dark:hover:text-white border border-transparent"
                )}
              >
                <tab.icon className={cn("h-5 w-5", activeTab === tab.id ? "text-primary-500" : "text-slate-400")} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="glass rounded-3xl p-6 sm:p-8 min-h-[500px] border border-slate-200 dark:border-dark-800 animate-in fade-in slide-in-from-right-8 duration-300">
              
              {activeTab === 'fields' && (
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Type className="h-5 w-5 text-primary-500" />
                    Key-Value Pairs
                  </h3>
                  {document.extracted_fields ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(document.extracted_fields).map(([key, value]) => (
                        <div key={key} className="p-4 rounded-xl bg-slate-50 dark:bg-dark-900 border border-slate-100 dark:border-dark-800 hover:border-primary-200 dark:hover:border-primary-800/50 transition-colors">
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{key}</p>
                          <p className="text-base font-semibold text-slate-900 dark:text-white break-words">{value}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500">No fields extracted.</p>
                  )}
                </div>
              )}

              {activeTab === 'tables' && (
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Table className="h-5 w-5 text-primary-500" />
                    Extracted Tables
                  </h3>
                  {document.table_data && document.table_data.length > 0 ? (
                    <div className="text-slate-500">Table rendering would go here...</div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-slate-50 dark:bg-dark-900 rounded-2xl border border-dashed border-slate-200 dark:border-dark-800">
                      <Table className="h-10 w-10 mb-3 opacity-20" />
                      <p>No tables detected in this document.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'json' && (
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <FileJson className="h-5 w-5 text-primary-500" />
                    Raw Textract Output
                  </h3>
                  <div className="flex-1 bg-[#1e1e1e] rounded-xl p-4 overflow-auto border border-dark-800 shadow-inner max-h-[600px]">
                    <pre className="text-sm font-mono text-green-400">
                      {JSON.stringify(document, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-3xl p-12 text-center border border-slate-200 dark:border-dark-800 max-w-2xl mx-auto mt-12">
          {document.status === 'PROCESSING' ? (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Processing Document</h3>
              <p className="text-slate-500 dark:text-slate-400">
                We are currently extracting data from this document using AWS Textract. 
                This usually takes less than 30 seconds.
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-red-600 dark:text-red-400">Extraction Failed</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                There was an error processing this document. This could be due to an unsupported format, 
                poor image quality, or a system timeout.
              </p>
              <Button variant="danger">Retry Extraction</Button>
            </>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
