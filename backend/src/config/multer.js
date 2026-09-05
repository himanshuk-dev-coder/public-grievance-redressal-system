import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// ✅ Allow Images + PDF + Videos
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",

    // PDF
    "application/pdf",

    // Videos
    "video/mp4",
    "video/mpeg",
    "video/quicktime", // mov
    "video/x-matroska", // mkv
    "video/webm",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only Images, PDFs and Videos (mp4, mov, mkv, webm) allowed"
      ),
      false
    );
  }
};

// Multer Upload Middleware
export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // ✅ 50MB (videos need bigger size)
  },
  fileFilter,
});
