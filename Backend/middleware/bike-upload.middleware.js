import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const uploadDirectory = path.join(currentDirectory, "../uploads/bikes");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `bike-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    callback(null, filename);
  },
});

const imageUpload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      return callback(null, true);
    }

    callback(new Error("Only image files are allowed"));
  },
});

export default imageUpload;