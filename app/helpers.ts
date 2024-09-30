import { PDFDocument } from 'pdf-lib';

export async function extractPageAsBase64(pdfFile: File, pageIndex: number): Promise<string> {
  const arrayBuffer = await pdfFile.arrayBuffer();

  const pdfBytes = new Uint8Array(arrayBuffer);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  if (pageIndex < 0 || pageIndex >= pdfDoc.getPageCount()) {
    throw new Error('Invalid page index');
  }

  const newPdfDoc = await PDFDocument.create();

  const [extractedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex]);

  newPdfDoc.addPage(extractedPage);

  const extractedPdfBytes = await newPdfDoc.save();

  const base64String = uint8ArrayToBase64(extractedPdfBytes);

  return base64String;
}

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
  let binary = '';
  const len = uint8Array.byteLength;

  for (let i = 0; i < len; i += 1024) {
    const chunk = uint8Array.subarray(i, i + 1024);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }

  return btoa(binary);
}
