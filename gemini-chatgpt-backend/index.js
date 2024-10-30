// gemini-chatgpt-backend/index.js


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const connectToMongoDB = require("./config/db")
// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1); // Exit the app if the connection fails
    }
};
connectToMongoDB();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/auth', chatRoutes);
app.use('/api/auth', chatRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`); // This should show the log
});

