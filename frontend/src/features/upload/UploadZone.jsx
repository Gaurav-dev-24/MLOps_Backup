import React, { useCallback, useState } from 'react';
import { UploadCloud, File, X, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { documentService } from '../../services/documentService';
import { s3Service } from '../../services/s3Service';
import { useNavigate } from 'react-router-dom';

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const navigate = useNavigate();

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (validTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setStatus('idle');
      setProgress(0);
    } else {
      alert("Invalid file type. Please upload a PDF, PNG, or JPG.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setStatus('uploading');
      setProgress(0);

      // 1. Get Presigned URL
      const { uploadUrl, documentId } = await documentService.getUploadUrl(file.name, file.type);

      // 2. Upload to S3
      await s3Service.uploadFile(uploadUrl, file, (p) => setProgress(p));

      // 3. Complete
      setStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      console.error("Upload failed", error);
      setStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl transition-all duration-300 ease-in-out glass",
            isDragging 
              ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 scale-105 shadow-primary-500/20" 
              : "border-slate-300 hover:border-primary-400 dark:border-dark-700 dark:hover:border-primary-500"
          )}
        >
          <div className="p-4 bg-primary-100 dark:bg-dark-800 rounded-full mb-4 shadow-inner">
            <UploadCloud className="h-10 w-10 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Drag & Drop your document here</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 text-center max-w-sm">
            Supported formats: PDF, JPEG, PNG. Max file size 10MB.
          </p>
          
          <label className="relative cursor-pointer">
            <Button as="span" variant="secondary">Browse Files</Button>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />
          </label>
        </div>
      ) : (
        <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-dark-800 animate-in zoom-in-95 duration-300">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 dark:bg-dark-800 rounded-2xl text-primary-600 dark:text-primary-400">
                <File className="h-8 w-8" />
              </div>
              <div>
                <p className="font-semibold text-lg truncate max-w-[200px] sm:max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && status !== 'success' && (
              <button 
                onClick={() => setFile(null)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors dark:hover:bg-red-500/10"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {status === 'uploading' && (
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-primary-600 dark:text-primary-400">Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-dark-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-6 bg-green-50 dark:bg-green-500/10 p-3 rounded-xl">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Upload complete! Processing document...</span>
            </div>
          )}

          {status === 'error' && (
            <div className="text-red-500 text-sm mb-6 bg-red-50 dark:bg-red-500/10 p-3 rounded-xl font-medium">
              Upload failed. Please try again.
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <Button 
              className="flex-1"
              onClick={handleUpload}
              isLoading={isUploading}
              disabled={status === 'success'}
            >
              {status === 'success' ? 'Redirecting...' : 'Extract Data'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
