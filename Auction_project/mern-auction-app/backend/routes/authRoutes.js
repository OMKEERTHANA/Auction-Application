const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Route mapping
router.post('/register', registerUser); // http://localhost:5000/api/auth/register
router.post('/login', loginUser);       // http://localhost:5000/api/auth/login

// The 'protect' middleware runs first. If it succeeds, 'getUserProfile' runs.
router.get('/profile', protect, getUserProfile); // http://localhost:5000/api/auth/profile

module.exports = router;
