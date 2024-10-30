//gemini-chatgpt-backend/config/config.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Enable CORS
app.use(express.json());  // Parse JSON request bodies

// Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
