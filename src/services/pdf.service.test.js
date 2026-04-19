import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { mergePdfs } from './pdf.service.js';

/**
 * Creates a mock PDF File object in memory using pdf-lib.
 *
 * @param {string} name - The name to give the generated file.
 * @param {number} pageCount - The number of blank pages to add to the PDF.
 * @returns {Promise<File>} A File object containing the PDF data.
 */
async function createMockPdfFile(name, pageCount) {
  // Create a new, blank PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add the specified number of blank pages
  for (let i = 0; i < pageCount; i++) {
    pdfDoc.addPage();
  }
  
  // Serialize the PDF document to bytes (Uint8Array)
  const pdfBytes = await pdfDoc.save();
  
  // Create a Blob from the bytes
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  
  // Simulate a File object by adding a name property (useful for browser environments)
  blob.name = name;
  
  return blob;
}

describe('mergePdfs', () => {
  it('should merge a 2-page and a 3-page PDF into a single 5-page PDF', async () => {
    // 1. Arrange: Create our mock PDF files
    const file1 = await createMockPdfFile('file1.pdf', 2);
    const file2 = await createMockPdfFile('file2.pdf', 3);
    
    // 2. Act: Merge the files using the service function
    const mergedBlob = await mergePdfs([file1, file2]);
    
    // 3. Assert: Verify the result is a Blob of type application/pdf
    expect(mergedBlob).toBeInstanceOf(Blob);
    expect(mergedBlob.type).toBe('application/pdf');
    
    // Read the merged blob back into pdf-lib to verify the total page count
    const arrayBuffer = await mergedBlob.arrayBuffer();
    const mergedPdfDoc = await PDFDocument.load(arrayBuffer);
    
    expect(mergedPdfDoc.getPageCount()).toBe(5);
  });

  it('should throw an error if passed an empty array or null', async () => {
    // We wrap the calls in an async function to gracefully handle 
    // both synchronous throws and asynchronous rejections.
    const callMergePdfs = async (input) => {
      return await mergePdfs(input);
    };

    await expect(callMergePdfs([])).rejects.toThrow('No files provided for merging.');
    await expect(callMergePdfs(null)).rejects.toThrow('No files provided for merging.');
  });
});
