// gemini-chatgpt-backend/controllers/chatController.js

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Chat } = require('../schema/Chat'); // Assuming Chat schema is exported correctly
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.API_KEY;

// Existing chatWithGemini function remains unchanged
const chatWithGemini = async (req, res) => {
    // const userId = req.user._id; // Retrieved from authentication middleware
    const { message, userId } = req.body; // User's message

    console.log(`User ID: ${userId}, Message: ${message}`);

    try {
        // Log the API Key to check if it's accessible (remove in production)
        console.log("API Key:", API_KEY);

        // Initialize the Gemini API client with API key
        const genAI = new GoogleGenerativeAI(API_KEY);

        // Get the model (gemini-1.5-flash)
        const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Generate content based on the prompt (user's message)
        const result = await model.generateContent(message);

        console.log('Gemini API Response:', JSON.stringify(result, null, 2));

        let generatedText = "No text generated from Gemini API";
        if (result && result.response && result.response.candidates && result.response.candidates.length > 0) {
            const candidate = result.response.candidates[0]; // First candidate
            generatedText = candidate.content.parts.map(part => part.text).join('');
            console.log('Extracted Text:', generatedText);
        }

        // Save chat history to the database
        let chat = await Chat.findOne({ userId });
        if (!chat) {
            chat = new Chat({ userId, messages: [] });
        }

        // Add both user and assistant messages to the chat history
        chat.messages.push({ sender: 'user', text: message });
        chat.messages.push({ sender: 'assistant', text: generatedText });
        chat.updatedAt = new Date();

        // Save the chat history
        await chat.save();

        res.json({ response: generatedText });
    } catch (error) {
        console.error('Full error:', error);
        res.status(500).json({ error: 'Error interacting with Gemini API' });
    }
};

// New: Controller to get chat history
const getChatHistory = async (req, res) => {
    const userId = req.user._id; // Retrieved from authentication middleware

    try {
        const chat = await Chat.findOne({ userId }).sort({ updatedAt: -1 });

        if (!chat) {
            return res.status(404).json({ message: 'No chat history found.' });
        }

        res.status(200).json({ messages: chat.messages });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Error fetching chat history.' });
    }
};

// New: Controller to clear chat history
const clearChatHistory = async (req, res) => {
    const userId = req.user._id; // Retrieved from authentication middleware

    try {
        const chat = await Chat.findOneAndDelete({ userId });

        if (!chat) {
            return res.status(404).json({ message: 'No chat history to delete.' });
        }

        res.status(200).json({ message: 'Chat history cleared successfully.' });
    } catch (error) {
        console.error('Error clearing chat history:', error);
        res.status(500).json({ message: 'Error clearing chat history.' });
    }
};

module.exports = { chatWithGemini, getChatHistory, clearChatHistory };
