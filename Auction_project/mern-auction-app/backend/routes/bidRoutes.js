const express = require('express');
const router = express.Router();
const { placeBid } = require('../controllers/bidController');
const { protect } = require('../middlewares/authMiddleware');

// Route mapping
// POST /api/bids/:auctionId
router.post('/:auctionId', protect, placeBid);

module.exports = router;
