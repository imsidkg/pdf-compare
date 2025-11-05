import { diffWords } from 'diff';


export function compareMultiplePdfs(pdfsData) {
const comparisons = [];


for (let i = 0; i < pdfsData.length; i++) {
for (let j = i + 1; j < pdfsData.length; j++) {
const pdfA = pdfsData[i];
const pdfB = pdfsData[j];
const result = compareTwoPdfs(pdfA, pdfB);
comparisons.push({ pair: [i + 1, j + 1], result });
}
}


return comparisons;
}


function compareTwoPdfs(pdfA, pdfB) {
const diffs = [];


for (let i = 0; i < Math.max(pdfA.length, pdfB.length); i++) {
const pageA = pdfA[i]?.content || [];
const pageB = pdfB[i]?.content || [];


const pageDiffs = [];
const len = Math.max(pageA.length, pageB.length);


for (let k = 0; k < len; k++) {
const a = pageA[k];
const b = pageB[k];
if (!a || !b) continue;


const textDiff = a.text !== b.text;
const fontDiff = a.font !== b.font || a.size !== b.size;
const posDiff = Math.abs((a.x || 0) - (b.x || 0)) > 2 || Math.abs((a.y || 0) - (b.y || 0)) > 2;


if (textDiff || fontDiff || posDiff) {
pageDiffs.push({
page: i + 1,
index: k,
textA: a.text,
textB: b.text,
fontA: a.font,
fontB: b.font,
sizeA: a.size,
sizeB: b.size,
xA: a.x,
xB: b.x,
yA: a.y,
yB: b.y,
widthA: a.width,
widthB: b.width,
heightA: a.height,
heightB: b.height,
type: textDiff ? 'text' : fontDiff ? 'font' : 'position'
});
}
}


if (pageDiffs.length) diffs.push({ page: i + 1, diffs: pageDiffs });
}


return diffs;
}