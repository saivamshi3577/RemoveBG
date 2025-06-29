const express = require('express');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

require('dotenv').config();

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// POST /remove-bg
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const inputPath = path.join(__dirname, '..', 'uploads', req.file.filename);
  const outputDir = path.join(__dirname, '..', 'output');
  const outputFilename = req.file.filename.split('.')[0] + '-output.png';
  const outputPath = path.join(outputDir, outputFilename);

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  execFile('python', [
    path.join(__dirname, '..', 'python', 'remove_bg.py'),
    inputPath,
    outputPath,
  ], async (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Python script error:', stderr || error.message);
      return res.status(500).json({ error: 'Background removal failed' });
    }

    try {
      const result = await cloudinary.uploader.upload(outputPath, {
        folder: 'removed-bg',
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });

      console.log('✅ Uploaded to Cloudinary:', result.secure_url);

      // Cleanup files
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);

      res.json({ url: result.secure_url });
    } catch (err) {
      console.error('❌ Cloudinary upload failed:', err.message);
      res.status(500).json({ error: 'Upload to Cloudinary failed' });
    }
  });
});

module.exports = router;
