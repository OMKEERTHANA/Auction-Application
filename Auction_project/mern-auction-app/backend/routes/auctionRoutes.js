const express = require('express');
const router = express.Router();
const {
  createAuction,
  getAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
} = require('../controllers/auctionController');
const { protect } = require('../middlewares/authMiddleware');

// Route mapping
router.route('/')
  .get(getAuctions)           // GET /api/auctions (Public)
  .post(protect, createAuction); // POST /api/auctions (Protected)

router.route('/:id')
  .get(getAuctionById)        // GET /api/auctions/:id (Public)
  .put(protect, updateAuction)   // PUT /api/auctions/:id (Protected - Seller)
  .delete(protect, deleteAuction); // DELETE /api/auctions/:id (Protected - Seller/Admin)

module.exports = router;
