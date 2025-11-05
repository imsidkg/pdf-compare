import Tesseract from 'tesseract.js';
import pdf from 'pdf-poppler';
import path from 'path';
import fs from 'fs';


export async function ocrImageFromPdf(pdfPath, pageNumber) {
const outputDir = path.join(process.cwd(), 'uploads', 'ocr_temp');
fs.mkdirSync(outputDir, { recursive: true });


const opts = {
format: 'png',
out_dir: outputDir,
out_prefix: 'page',
page: pageNumber
};


await pdf.convert(pdfPath, opts);
const imagePath = path.join(outputDir, `page-${pageNumber}.png`);


const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
return text;
}