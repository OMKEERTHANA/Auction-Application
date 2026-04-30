// Middleware to check if user is an admin
// Must be used AFTER the protect middleware so that req.user is available
const isAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated (protect middleware should have run first)
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user' });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // User is admin, proceed to next middleware/route handler
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin status', error: error.message });
  }
};

module.exports = { isAdmin };
