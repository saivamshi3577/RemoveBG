const express = require('express');
const cors = require('cors');
const path = require('path');
const removeRoute = require('./routes/removeRoute');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;



app.use(cors({
  origin: 'http://localhost:5173', // React Vite Dev Server
  methods: ['GET', 'POST'],
  credentials: true
}));

// ✅ Parse JSON bodies (optional for future)
app.use(express.json());

// ✅ Serve static output images
app.use('/output', express.static(path.join(__dirname, 'output')));

// ✅ Use your background remove route
app.use('/remove-bg', removeRoute);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ RemoveBG API is running');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
