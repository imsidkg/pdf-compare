import React , { useState } from "react";
import PdfDiffViewer from "./components/PdfDiffViewer";

export default function App() {
  const [files, setFiles] = useState([]);
  const [diffData, setDiffData] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);

  const handleFileUpload = async (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);

    const form = new FormData();
    selected.forEach((f) => form.append("pdfs", f));

    const res = await fetch("http://localhost:5000/compare", {
      method: "POST",
      body: form
    });
    const data = await res.json();

    // ✅ Convert backend structure → flat array of diffs
    const flatDiffs =
      data.results[0].result.flatMap(pageObj =>
        pageObj.diffs.map(d => ({
          page: pageObj.page,
          ...d
        }))
      );

    setDiffData(flatDiffs);

    // ✅ Load PDFs for viewer
    setPdfUrls(selected.map(f => URL.createObjectURL(f)));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Multi-PDF Compare</h2>

      <input
        type="file"
        multiple accept="application/pdf"
        onChange={handleFileUpload}
      />

      {pdfUrls.length === 2 && (
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <div style={{ width: "50%" }}>
            <h4>{files[0]?.name}</h4>
            <PdfDiffViewer pdfFile={pdfUrls[0]} diffData={diffData} />
          </div>

          <div style={{ width: "50%" }}>
            <h4>{files[1]?.name}</h4>
            <PdfDiffViewer pdfFile={pdfUrls[1]} diffData={diffData} />
          </div>
        </div>
      )}
    </div>
  );
}
