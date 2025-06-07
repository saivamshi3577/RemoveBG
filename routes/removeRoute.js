const express = require('express');
const router = express.Router();
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

router.post('/', (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const inputPath = path.join(__dirname, '..', 'uploads', req.file.filename);
  const outputFilename = req.file.filename.split('.')[0] + '-output.png';
  const outputPath = path.join(__dirname, '..', 'output', outputFilename);

  if (!fs.existsSync(path.join(__dirname, '..', 'output'))) {
    fs.mkdirSync(path.join(__dirname, '..', 'output'));
  }

  execFile('python', [
    path.join(__dirname, '..', 'python', 'remove_bg.py'),
    inputPath,
    outputPath
  ], (error, stdout, stderr) => {
    if (error) {
      console.error('Python script error:', stderr || error.message);
      return res.status(500).json({ error: 'Background removal failed' });
    }
    res.json({ output: outputFilename });
  });
});

module.exports = router;
