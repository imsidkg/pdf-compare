import React from 'react';
import { Document, Page } from 'react-pdf';


export default function PdfDiffViewer({ pdfFile, diffData }) {
// Group diffs by page for rendering
const pages = {};
(diffData || []).forEach(d => {
pages[d.page] = pages[d.page] || [];
pages[d.page].push(d);
});


return (
<div>
<Document file={pdfFile}>
{Object.keys(pages).map(pn => (
<div key={pn} style={{ position: 'relative', marginBottom: 20 }}>
<Page pageNumber={Number(pn)} />
{pages[pn].map((d, i) => (
<div
key={i}
className={`highlight ${d.type}`}
style={{
left: `${d.xB || d.xA || 0}px`,
top: `${d.yB || d.yA || 0}px`,
width: `${d.widthB || d.widthA || 80}px`,
height: `${d.heightB || d.heightA || 16}px`,
position: 'absolute'
}}
/>
))}
</div>
))}
</Document>
</div>
);
}