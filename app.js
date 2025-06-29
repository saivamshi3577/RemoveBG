const express = require('express');
const cors = require('cors');
const path = require('path');
const removeRoute = require('./routes/removeRoute');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS config for dev and prod
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173', // Vite dev
      'https://your-frontend-domain.com' // ← change this for production
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

// ✅ JSON body parser
app.use(express.json());

// ✅ Serve static output folder
app.use('/output', express.static(path.join(__dirname, 'output')));

// ✅ API Route
app.use('/remove-bg', removeRoute);

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ RemoveBG API is running');
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
