import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { documentService } from '../services/documentService';
import { Loader2, ArrowLeft, Download, FileJson, Type, Copy, CheckCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';

// ─── Parse extracted_text → structured JSON ───────────────────────────────────
function extractToJson(text) {
  if (!text) return {};

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Known field labels to look for (in order)
  const KNOWN_FIELDS = [
    'Invoice Number',
    'Order Number',
    'Invoice Date',
    'Due Date',
    'Total Due',
    'Sub Total',
    'Tax',
    'Total',
  ];

  const result = {};

  // 1️⃣ Extract known key-value pairs: label appears on one line, value on next
  KNOWN_FIELDS.forEach(label => {
    const idx = lines.findIndex(l => l.toLowerCase() === label.toLowerCase());
    if (idx !== -1 && idx + 1 < lines.length) {
      result[label] = lines[idx + 1];
    }
  });

  // 2️⃣ Extract From / To (multi-line address blocks)
  const fromIdx = lines.findIndex(l => l === 'From:');
  if (fromIdx !== -1) {
    const fromLines = [];
    for (let i = fromIdx + 1; i < lines.length && i < fromIdx + 5; i++) {
      if (lines[i] === 'To:') break;
      if (!KNOWN_FIELDS.includes(lines[i])) fromLines.push(lines[i]);
    }
    result['From'] = fromLines.join(', ');
  }

  const toIdx = lines.findIndex(l => l === 'To:');
  if (toIdx !== -1) {
    const toLines = [];
    for (let i = toIdx + 1; i < lines.length && i < toIdx + 5; i++) {
      if (lines[i] === 'Hrs/Qty') break;
      if (!KNOWN_FIELDS.includes(lines[i])) toLines.push(lines[i]);
    }
    result['To'] = toLines.join(', ');
  }

  return result;
}



// ─── Component ────────────────────────────────────────────────────────────────
export default function DocumentDetails() {
  const { id }      = useParams();
  const location    = useLocation();
  const [doc, setDoc]           = useState(location.state?.document || null);
  const [isLoading, setLoading] = useState(!location.state?.document);
  const [activeTab, setTab]     = useState('extracted');
  const [copied, setCopied]     = useState(false);

  useEffect(() => {
    if (location.state?.document) return;
    const fetchDoc = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDoc(data);
      } catch (err) {
        console.error('Failed to fetch document', err);
      } finally {
        setLoading(false);
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

  if (!doc) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Document not found</h2>
          <Link to="/dashboard"><Button>Back to Dashboard</Button></Link>
        </div>
      </PageWrapper>
    );
  }

  // Parse the extracted text into structured data
  const extractedJson = extractToJson(doc.extracted_text);
  const jsonString    = JSON.stringify(extractedJson, null, 2);

  const copyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(window.document.createElement('a'), {
      href: url, download: `${doc.id}-extracted.json`,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'extracted', label: 'Extracted Data', icon: Type },
    { id: 'json',      label: 'JSON View',       icon: FileJson },
  ];

  return (
    <PageWrapper>

      {/* ── Header ── */}
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 glass p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-dark-800">
          <div>
            <h1 className="text-3xl font-bold mb-2 break-all">{doc.filename}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1 rounded-full border border-green-200 dark:border-green-500/20 font-semibold">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                {doc.status}
              </span>
              <span>Uploaded: {new Date(doc.upload_time).toLocaleString()}</span>
              <span className="font-mono text-xs bg-slate-100 dark:bg-dark-800 px-2 py-1 rounded-md border border-slate-200 dark:border-dark-700">
                ID: {doc.id}
              </span>
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Button variant="secondary" onClick={copyJson}>
              {copied ? <CheckCheck className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy JSON'}
            </Button>
            <Button onClick={downloadJson}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left',
                activeTab === tab.id
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800/50 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-dark-800 border border-transparent'
              )}
            >
              <tab.icon className={cn('h-5 w-5', activeTab === tab.id ? 'text-primary-500' : 'text-slate-400')} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="lg:col-span-3">
          <div className="glass rounded-3xl p-6 sm:p-8 min-h-[500px] border border-slate-200 dark:border-dark-800 animate-in fade-in duration-300">

            {/* ── TAB 1: Extracted Data → Table ── */}
            {activeTab === 'extracted' && (
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Type className="h-5 w-5 text-primary-500" />
                  Extracted Invoice Fields
                </h3>

                {Object.keys(extractedJson).length > 0 ? (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-dark-800">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-primary-50 dark:bg-primary-900/20 border-b border-slate-200 dark:border-dark-800">
                          <th className="px-5 py-4 text-left font-bold text-primary-700 dark:text-primary-300 w-1/3 uppercase tracking-wide text-xs">Field</th>
                          <th className="px-5 py-4 text-left font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wide text-xs">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(extractedJson).map(([key, value], i) => (
                          <tr
                            key={key}
                            className={cn(
                              'border-b border-slate-100 dark:border-dark-800 last:border-0 transition-colors hover:bg-primary-50/30 dark:hover:bg-primary-900/10',
                              i % 2 === 0 ? 'bg-white dark:bg-dark-900/30' : 'bg-slate-50/60 dark:bg-dark-900/60'
                            )}
                          >
                            <td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                              {key}
                            </td>
                            <td className="px-5 py-4 font-mono text-slate-900 dark:text-white font-medium">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-10">No structured fields found in extracted text.</p>
                )}
              </div>
            )}



            {/* ── TAB 3: JSON View (structured JSON in a table) ── */}
            {activeTab === 'json' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <FileJson className="h-5 w-5 text-primary-500" />
                    Extracted Data — JSON Format
                  </h3>
                  <button
                    onClick={copyJson}
                    className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 transition-colors font-medium text-slate-600 dark:text-slate-300"
                  >
                    {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                {/* JSON displayed in a styled table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-dark-800 mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#1e1e1e] border-b border-dark-800">
                        <th className="px-5 py-3 text-left font-mono text-xs font-bold text-green-400 uppercase w-1/3">Key</th>
                        <th className="px-5 py-3 text-left font-mono text-xs font-bold text-blue-400 uppercase">Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#1e1e1e]">
                      {Object.entries(extractedJson).map(([key, value]) => (
                        <tr key={key} className="border-b border-[#2a2a2a] last:border-0 hover:bg-[#2a2a2a] transition-colors">
                          <td className="px-5 py-3 font-mono text-yellow-300 text-sm">"{key}"</td>
                          <td className="px-5 py-3 font-mono text-green-300 text-sm">"{value}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Raw JSON code block */}
                <div className="bg-[#1e1e1e] rounded-2xl border border-[#2a2a2a] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#2a2a2a] border-b border-[#333]">
                    <span className="text-xs font-mono text-slate-400">extracted_data.json</span>
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-500/70" />
                      <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                      <span className="h-3 w-3 rounded-full bg-green-500/70" />
                    </div>
                  </div>
                  <pre className="text-sm font-mono text-green-400 p-5 overflow-auto max-h-[350px]">
                    {jsonString}
                  </pre>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
