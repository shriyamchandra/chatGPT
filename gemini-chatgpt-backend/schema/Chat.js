// gemini-chatgpt-backend/schema/Chat.js


const mongoose = require("mongoose");

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true, // "user" or "assistant"
    enum: ["user", "assistant"],
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Chat Schema
const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming a User schema exists
    required: true,
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", chatSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { Chat, Message };
