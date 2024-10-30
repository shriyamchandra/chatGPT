//gemini-chatgpt-backend/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../schema/user'); // Assuming you have a User model
const e = require('express');
const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Signup Controller
const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token with userId and username
    const token = jwt.sign(
      { userId: newUser._id.toString(), username: newUser.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Assign the token to newUser (not existingUser)
    newUser.token = token;
    newUser.password = undefined; // Exclude password from the response

    // Respond with the token and user details
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please sign up.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a token with userId and username included explicitly
    const token = jwt.sign({ userId: user._id.toString(), username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    user.token = token
    user.password = undefined;

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = { signUp, login };
