// gemini-chatgpt-backend/routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const { chatWithGemini } = require('../controllers/chatController');
const { signUp, login } = require('../controllers/authcontroller');

// POST request to handle chat messages
router.post('/chat', chatWithGemini);
router.post('/signup', signUp);
router.post('/login', login);
module.exports = router;
