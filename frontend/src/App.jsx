import React, { useState } from 'react';
import PdfDiffViewer from './components/PdfDiffViewer';


export default function App() {
const [files, setFiles] = useState([]);
const [diffData, setDiffData] = useState([]);


const handleUpload = async (e) => {
const formData = new FormData();
for (const file of e.target.files) formData.append('pdfs', file);


const res = await fetch('http://localhost:5000/compare', {
method: 'POST',
body: formData
});


const data = await res.json();
setDiffData(data.results || []);
setFiles(Array.from(e.target.files).map(f => URL.createObjectURL(f)));
};


return (
<div style={{ padding: 20 }}>
<h1>Multi-PDF Compare</h1>
<input type="file" accept="application/pdf" multiple onChange={handleUpload} />


{diffData.map((cmp, idx) => (
<div key={idx} style={{ marginTop: 30 }}>
<h2>PDF {cmp.pair[0]} vs PDF {cmp.pair[1]}</h2>
<PdfDiffViewer
pdfFile={files[cmp.pair[1] - 1]}
diffData={cmp.result.flatMap(r => r.diffs)}
/>
</div>
))}
</div>
);
}