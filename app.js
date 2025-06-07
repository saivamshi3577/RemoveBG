const express = require('express');
const multer = require('multer');
const path = require('path');
const removeRoute = require('./routes/removeRoute');
const app = express();
const port = 3000;
const cors = require('cors');
const fs = require('fs');

// ✅ Ensure necessary folders exist
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync('output')) fs.mkdirSync('output');
app.use(cors({
  origin: "http://localhost:5173"
}));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
  
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/output', express.static(path.join(__dirname, 'output')));
app.use('/remove-bg', upload.single('image'), removeRoute);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



