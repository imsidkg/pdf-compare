import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfjsPkg from "pdfjs-dist/legacy/build/pdf.js";
import { ocrImageFromPdf } from "./ocr.js";

const { getDocument, GlobalWorkerOptions } = pdfjsPkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Keep your original working worker path
const workerPath = path.resolve(
  process.cwd(),
  "node_modules/pdfjs-dist/legacy/build/pdf.worker.js"
);
GlobalWorkerOptions.workerSrc = workerPath;

export async function extractPdfMetadata(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdfDoc = await getDocument({ data }).promise;
  const pages = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();

    if (!content.items || content.items.length === 0) {
      const text = await ocrImageFromPdf(filePath, i);
      pages.push({
        page: i,
        content: [{
          text,
          font: "OCR",
          x: 0, y: 0,
          width: 0, height: 0,
          transform: [1,0,0,1,0,0]
        }]
      });
      continue;
    }

    const viewport = page.getViewport({ scale: 1 });

    const pageText = content.items.map((item) => {
      const [a, b, c, d, e, f] = item.transform;

      return {
        text: item.str,
        font: item.fontName || "Unknown",

        width: item.width || 0,
        height: item.height || 10,

        // ✅ baseline coordinates
        x: e,
        y: f,

        // ✅ transform matrix for exact overlay
        transform: item.transform,

        viewport: { width: viewport.width, height: viewport.height }
      };
    });

    pages.push({ page: i, content: pageText });
  }

  return pages;
}
