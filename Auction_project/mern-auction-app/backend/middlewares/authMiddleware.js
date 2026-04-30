const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if the request headers have an Authorization token starting with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format: "Bearer <token_string>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our Secret Key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the DB using the ID inside the token payload
      // We use .select('-password') to exclude the password field from the result
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the actual route handler function
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token was found at all
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
