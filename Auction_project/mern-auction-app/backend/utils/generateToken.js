const jwt = require('jsonwebtoken');

// Generate a JSON Web Token holding the user's ID
const generateToken = (id) => {
  // jwt.sign takes:
  // 1. The payload (data you want to store in the token, here just the id)
  // 2. The Secret Key (used to sign and verify the token)
  // 3. Options (like expiration time)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

module.exports = generateToken;
