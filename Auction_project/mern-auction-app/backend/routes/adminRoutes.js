const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllAuctions,
  deleteAuction,
  getAllBids,
  getStatistics,
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// All admin routes require authentication AND admin role
// Apply protect middleware first, then isAdmin middleware

// ==================== USER MANAGEMENT ====================
router.route('/users')
  .get(protect, isAdmin, getAllUsers);           // GET /api/admin/users

router.route('/users/:userId')
  .delete(protect, isAdmin, deleteUser);         // DELETE /api/admin/users/:userId

// ==================== AUCTION MANAGEMENT ====================
router.route('/auctions')
  .get(protect, isAdmin, getAllAuctions);        // GET /api/admin/auctions

router.route('/auctions/:auctionId')
  .delete(protect, isAdmin, deleteAuction);      // DELETE /api/admin/auctions/:auctionId

// ==================== BID MANAGEMENT ====================
router.route('/bids')
  .get(protect, isAdmin, getAllBids);            // GET /api/admin/bids

// ==================== STATISTICS ====================
router.route('/statistics')
  .get(protect, isAdmin, getStatistics);         // GET /api/admin/statistics

module.exports = router;
