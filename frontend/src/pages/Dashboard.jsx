import React, { useEffect, useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { DocumentCard } from '../features/documents/DocumentCard';
import { documentService } from '../services/documentService';
import { Loader2, Search, Filter } from 'lucide-react';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await documentService.getDocuments();
        setDocuments(data);
      } catch (error) {
        console.error("Failed to fetch documents", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleDeleteDocument = async (id) => {
    try {
      await documentService.deleteDocument(id);
      setDocuments(docs => docs.filter(doc => doc.id !== id));
    } catch (error) {
      console.error("Failed to delete document", error);
      alert("Failed to delete document. Please try again.");
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageWrapper>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-slate-500 dark:text-slate-400">
            View and manage your extracted documents.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative glass rounded-xl border border-slate-200 dark:border-dark-700">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search files..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
            />
          </div>
          <button className="p-2.5 glass rounded-xl border border-slate-200 dark:border-dark-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 className="h-10 w-10 animate-spin text-primary-500 mb-4" />
          <p>Loading documents...</p>
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDocs.map(doc => (
            <DocumentCard key={doc.id} document={doc} onDelete={handleDeleteDocument} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl p-12 text-center border border-slate-200 dark:border-dark-800">
          <div className="w-20 h-20 bg-slate-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <Search className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No documents found</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            We couldn't find any documents matching your search.
          </p>
        </div>
      )}
    </PageWrapper>
  );
}
