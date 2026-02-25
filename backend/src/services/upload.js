import multer from "multer";

const storage = multer.memoryStorage({});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("application/pdf")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type! Use Images or PDFs."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export default upload;
