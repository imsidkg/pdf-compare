import fs from 'fs';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import { ocrImageFromPdf } from './ocr.js';


export async function extractPdfMetadata(filePath) {
const data = new Uint8Array(fs.readFileSync(filePath));
const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
const pages = [];


for (let i = 1; i <= pdfDoc.numPages; i++) {
const page = await pdfDoc.getPage(i);
const content = await page.getTextContent();


// If no text items (likely scanned), fallback to OCR
if (!content.items || content.items.length === 0) {
const text = await ocrImageFromPdf(filePath, i);
pages.push({ page: i, content: [{ text, font: 'OCR', x: 0, y: 0, width: 0, height: 0 }] });
continue;
}


const pageText = content.items.map(item => ({
text: item.str,
font: item.fontName || null,
size: (item.transform && item.transform[0]) || null,
// pdfjs transform: [a, b, c, d, e, f] where e,f are x,y
x: (item.transform && item.transform[4]) || 0,
y: (item.transform && item.transform[5]) || 0,
width: item.width || 0,
height: item.height || 0
}));


pages.push({ page: i, content: pageText });
}


return pages;
}