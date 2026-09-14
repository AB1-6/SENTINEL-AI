import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve('backend/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`),
});

function fileFilter(_req, file, cb) {
  const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
  cb(null, allowed.includes(file.mimetype));
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 15 * 1024 * 1024 } });