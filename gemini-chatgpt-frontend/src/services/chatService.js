// gemini-chatgpt-frontend/src/services/chatService.js


import axios from 'axios';

// Function to send the user's message to the backend and get the AI response
const userString = localStorage.getItem('user');
let user = {};

if (userString) {
    try {
        user = JSON.parse(userString);
    } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
    }
}

const userId = user._id; // Assuming your user object has a 'userId' property
console.log('User ID:', userId);

const sendMessageToBackend = async (message) => {
    try {
        const response = await axios.post('https://chatgpt-1tmy.onrender.com/api/auth/chat', { message, userId });
        return response.data;  // Return the full response object from the backend
    } catch (error) {
        console.error('Error communicating with the backend:', error);
        throw error;  // Propagate the error to be handled in the ChatBox
    }
};

export default sendMessageToBackend;
