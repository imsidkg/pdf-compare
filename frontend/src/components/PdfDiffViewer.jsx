// import React, { useState } from "react";
// import { Document, Page } from "react-pdf";

// export default function PdfDiffViewer({ pdfFile, diffData }) {
//   const [numPages, setNumPages] = useState(null);
//   const [pageState, setPageState] = useState({});

//   function onDocumentLoad({ numPages }) {
//     setNumPages(numPages);
//   }

//   function onPageRender(page, container) {
//     const viewport = page.getViewport({ scale: 1 });
//     const canvas = container.querySelector("canvas");

//     if (!canvas) return;

//     setPageState(prev => ({
//       ...prev,
//       [page.pageNumber]: {
//         viewport,
//         renderWidth: canvas.width,
//         renderHeight: canvas.height
//       }
//     }));
//   }

//   return (
//     <div style={{ border: "1px solid #ddd", padding: 5 }}>
//       <Document file={pdfFile} onLoadSuccess={onDocumentLoad}>
//         {Array.from({ length: numPages || 0 }).map((_, idx) => {
//           const pageNumber = idx + 1;
//           const state = pageState[pageNumber];
//           const diffsForPage = diffData.filter(d => d.page === pageNumber);

//           return (
//             <div
//               key={pageNumber}
//               id={`page_${pageNumber}`}
//               style={{ position: "relative", marginBottom: 30 }}
//             >
//               <Page
//                 pageNumber={pageNumber}
//                 onLoadSuccess={(page) => {
//                   const el = document.getElementById(`page_${pageNumber}`);
//                   onPageRender(page, el);
//                 }}
//               />

//               {state &&
//                 diffsForPage.map((d, i) => {
//                   const { viewport, renderWidth, renderHeight } = state;
                  
//                   const scaleX = renderWidth / viewport.width;
//                   const scaleY = renderHeight / viewport.height;

//                   const x = d.xA * scaleX;
//                   const y = renderHeight - d.yA * scaleY - d.heightA * scaleY;
//                   const width = d.widthA * scaleX;
//                   const height = d.heightA * scaleY;

//                   return (
//                     <div
//                       key={i}
//                       style={{
//                         position: "absolute",
//                         left: `${x}px`,
//                         top: `${y}px`,
//                         width: `${width}px`,
//                         height: `${height}px`,
//                         backgroundColor:
//                           d.type === "text"
//                             ? "rgba(0,255,0,0.40)"   // text change = green
//                             : "rgba(0,0,255,0.40)", // font diff = blue
//                         pointerEvents: "none"
//                       }}
//                     />
//                   );
//                 })}
//             </div>
//           );
//         })}
//       </Document>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Document, Page } from "react-pdf";

export default function PdfDiffViewer({ pdfFile, diffData }) {
  const [numPages, setNumPages] = useState(null);
  const [pages, setPages] = useState({});

  function onDocumentLoad({ numPages }) {
    setNumPages(numPages);
  }

  function onPageLoad(pdfPage, container) {
    const viewport = pdfPage.getViewport({ scale: 1 });

    const canvas = container.querySelector("canvas");
    const renderWidth = canvas.width;
    const renderHeight = canvas.height;

    setPages((prev) => ({
      ...prev,
      [pdfPage.pageNumber]: { viewport, renderWidth, renderHeight },
    }));
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: 10 }}>
      <Document file={pdfFile} onLoadSuccess={onDocumentLoad}>
        {Array.from({ length: numPages || 0 }).map((_, i) => {
          const pageNum = i + 1;
          const pageState = pages[pageNum];

          return (
            <div
              key={pageNum}
              style={{ position: "relative", marginBottom: 20 }}
              id={`pdf_page_${pageNum}`}
            >
              <Page
                pageNumber={pageNum}
                onLoadSuccess={(p) => {
                  const el = document.getElementById(`pdf_page_${pageNum}`);
                  onPageLoad(p, el);
                }}
                renderTextLayer={false}          // ✅ hide text layer
                renderAnnotationLayer={false}     // ✅ hide annotations
              />

              {pageState &&
                diffData
                  ?.filter((d) => d.page === pageNum)
                  .map((d, idx) => {
                    const x = d.xA * (pageState.renderWidth / pageState.viewport.width);
                    const baselineY =
                      d.yA * (pageState.renderHeight / pageState.viewport.height);
                    const height =
                      d.heightA * (pageState.renderHeight / pageState.viewport.height);
                    const y = pageState.renderHeight - baselineY - height;
                    const width =
                      d.widthA * (pageState.renderWidth / pageState.viewport.width);

                    return (
                      <div
                        key={idx}
                        style={{
                          position: "absolute",
                          left: `${x}px`,
                          top: `${y}px`,
                          width: `${width}px`,
                          height: `${height}px`,
                          backgroundColor:
                            d.type === "text"
                              ? "rgba(255,0,0,0.4)"
                              : d.type === "font"
                              ? "rgba(0,0,255,0.4)"
                              : "rgba(0,255,0,0.4)",
                          pointerEvents: "none",
                          borderRadius: "2px",
                        }}
                      />
                    );
                  })}
            </div>
          );
        })}
      </Document>
    </div>
  );
}
