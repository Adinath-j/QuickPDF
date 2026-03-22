import React, { useState, useRef } from "react";
import { Layers, X, Download, Loader2, Trash2, GripVertical } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { mergePdfs } from "../../services/pdf.service";
import { Dropzone } from "../../components/pdf/Dropzone";
import { formatFileSize } from "../../utils/formatters";

export function Merge() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleFilesSelected = (selectedFiles) => {
    const validPdfs = selectedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (validPdfs.length !== selectedFiles.length) {
      setError("Some files were ignored. Only PDF files are allowed.");
    } else {
      setError(null);
    }

    setFiles((prev) => [...prev, ...validPdfs]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const clearAllFiles = () => {
    setFiles([]);
    setError(null);
  };

  // Function to handle the array reordering when a file is dropped
  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    // Duplicate the files array
    let _files = [...files];
    
    // Remove and save the dragged item
    const draggedItemContent = _files.splice(dragItem.current, 1)[0];
    
    // Insert the dragged item into its new position
    _files.splice(dragOverItem.current, 0, draggedItemContent);
    
    // Reset the refs
    dragItem.current = null;
    dragOverItem.current = null;
    
    // Update state to trigger re-render in the new order
    setFiles(_files);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;

    try {
      setIsProcessing(true);
      setError(null);

      const mergedPdfBlob = await mergePdfs(files);

      const url = URL.createObjectURL(mergedPdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `QuickPDF_Merged_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("An error occurred while merging the PDFs. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-primary mb-4">
          <Layers className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Merge PDF</h1>
        <p className="text-lg text-slate-600">
          Combine multiple PDFs into a single file directly in your browser.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="mb-8">
          <Dropzone 
            onFilesSelected={handleFilesSelected} 
            multiple={true} 
            disabled={isProcessing} 
            text="Click to upload" 
          />
        </div>

        {files.length > 0 && (
          <div className="mb-8 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-slate-900">Selected Files ({files.length})</h3>
              <button 
                onClick={clearAllFiles}
                disabled={isProcessing}
                className="flex items-center text-sm font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Clear All
              </button>
            </div>
            
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li 
                  key={`${file.name}-${index}`} 
                  // HTML5 Drag & Drop attributes
                  draggable={!isProcessing}
                  onDragStart={() => (dragItem.current = index)}
                  onDragEnter={() => (dragOverItem.current = index)}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                  className={`flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg group hover:border-primary/50 transition-all ${isProcessing ? 'opacity-50' : 'cursor-grab active:cursor-grabbing hover:shadow-md'}`}
                >
                  <div className="flex items-center overflow-hidden mr-4">
                    {/*Grip icon to indicate draggability */}
                    <GripVertical className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors mr-3 flex-shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{formatFileSize(file.size)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(index)}
                    disabled={isProcessing}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-400 text-center mt-3 flex items-center justify-center">
              Drag and drop files to rearrange their order before merging.
            </p>
          </div>
        )}

        <div className="flex justify-end mt-8 border-t border-slate-100 pt-6">
          <Button 
            onClick={handleMerge} 
            disabled={files.length < 2 || isProcessing}
            className="w-full sm:w-auto"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2" />
                Merge Files
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}