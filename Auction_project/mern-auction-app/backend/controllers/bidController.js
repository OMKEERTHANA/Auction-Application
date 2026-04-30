const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// @desc    Place a bid on an auction
// @route   POST /api/bids/:auctionId
// @access  Private (Requires login)
// FEATURE: One user can only have ONE bid per auction (updated, not duplicated)
const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;
    const auctionId = req.params.auctionId;
    const userId = req.user._id;

    // 1. Find the auction
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // 2. Validate Auction Status & Time
    if (auction.status !== 'active') {
      return res.status(400).json({ message: 'This auction has ended or is cancelled' });
    }
    if (new Date(auction.endTime) < new Date()) {
      return res.status(400).json({ message: 'This auction time has expired' });
    }

    // 3. Prevent seller from bidding on their own item
    if (auction.seller.toString() === userId.toString()) {
      return res.status(400).json({ message: 'You cannot bid on your own auction' });
    }

    // 4. Validate Bid Amount
    // The bid must be strictly greater than the current highest bid
    if (Number(amount) <= auction.currentBid) {
      return res.status(400).json({ message: `Bid must be higher than current bid of $${auction.currentBid}` });
    }

    // 5. Check if user already has a bid on this auction
    // If yes, update it. If no, create a new one.
    let bid = await Bid.findOne({
      auction: auctionId,
      bidder: userId,
    });

    if (bid) {
      // User already has a bid for this auction - UPDATE it
      bid.amount = Number(amount);
      await bid.save();
    } else {
      // User doesn't have a bid yet - CREATE new one
      bid = await Bid.create({
        auction: auctionId,
        bidder: userId,
        amount: Number(amount),
      });
    }

    // 6. Update the Auction's current highest bid
    auction.currentBid = Number(amount);
    await auction.save();

    // Populate bidder details before returning to frontend
    const populatedBid = await Bid.findById(bid._id).populate('bidder', 'username');

    res.status(201).json(populatedBid);
  } catch (error) {
    res.status(500).json({ message: 'Error placing bid', error: error.message });
  }
};

module.exports = {
  placeBid,
};
