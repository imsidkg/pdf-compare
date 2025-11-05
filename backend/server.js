import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import { extractPdfMetadata } from "./utils/extract.js";
import { compareMultiplePdfs } from "./utils/compare.js";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });
fs.mkdirSync(path.join(process.cwd(), "uploads"), { recursive: true });

app.post("/compare", upload.array("pdfs", 20), async (req, res) => {
  try {
    const files = req.files.map((f) =>
      path.join(process.cwd(), "uploads", f.filename)
    );

    const extracted = [];
    for (const filePath of files) {
      const data = await extractPdfMetadata(filePath);
      extracted.push(data);
    }

    const results = compareMultiplePdfs(extracted);

    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
