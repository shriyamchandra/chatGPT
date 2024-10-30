// controllers/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../schema/user'); // Corrected to uppercase 'U'
const dotenv = require('dotenv');

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found.' });
      }

      req.user = user; // Attach user to request object
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Invalid token.' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided.' });
  }
};

module.exports = authenticate;
