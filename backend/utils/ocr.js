import { fromPath } from "pdf2pic";

export async function ocrImageFromPdf(pdfPath, pageNumber) {
  const converter = fromPath(pdfPath, {
    density: 200,
    saveFilename: `page-${pageNumber}`,
    savePath: "./uploads/ocr_temp",
    format: "png",
    width: 1200,
    height: 1600,
  });

  const result = await converter(pageNumber);
  const imagePath = result.path;

  const { data: { text } } = await Tesseract.recognize(imagePath, "eng");
  return text;
}
