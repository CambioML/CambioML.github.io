import { PDFDocument } from 'pdf-lib';

import { remark } from 'remark';
import { visit } from 'unist-util-visit';

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

/**
 * Extracts all image URLs and filenames from a Markdown string.
 * @param markdown - The Markdown content as a string.
 * @returns An array of objects containing image URLs and filenames.
 */
export function extractImageLinks(markdown: string): { url: string; filename: string }[] {
  const imageLinks: { url: string; filename: string }[] = [];

  // Parse the Markdown into an Abstract Syntax Tree (AST)
  const tree = remark().parse(markdown);

  // Traverse the AST and collect URLs and filenames from image nodes
  visit(tree, 'image', (node: any) => {
    if (node.url) {
      const url = node.url;
      // Extract the filename from the URL
      const filename = url.split('/').pop().split('?')[0];
      imageLinks.push({ url, filename });
    }
  });

  return imageLinks;
}
