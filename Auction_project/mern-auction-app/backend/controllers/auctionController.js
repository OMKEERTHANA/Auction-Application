const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// --- Helper Function for Lazy Winner Logic ---
// This checks if an auction's time has expired. If it has, it automatically
// finds the highest bidder, sets them as the winner, and closes the auction.
const checkAndCloseAuction = async (auction) => {
  if (auction.status === 'active' && new Date(auction.endTime) < new Date()) {
    // 1. Find the highest bid for this auction
    const highestBid = await Bid.findOne({ auction: auction._id }).sort({ amount: -1 });

    // 2. Update the auction status and winner
    auction.status = 'ended';
    if (highestBid) {
      auction.winner = highestBid.bidder;
    }
    await auction.save();
  }
  return auction;
};

// @desc    Create a new auction
// @route   POST /api/auctions
// @access  Private (Requires login)
const createAuction = async (req, res) => {
  try {
    const { title, description, image, basePrice, endTime } = req.body;

    // The seller is automatically set to the logged-in user from the authMiddleware
    const auction = await Auction.create({
      title,
      description,
      image,
      basePrice,
      currentBid: basePrice, // Current bid starts at the base price
      seller: req.user._id,
      endTime,
    });

    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating auction', error: error.message });
  }
};

// @desc    Get all active auctions (with lazy update)
// @route   GET /api/auctions
// @access  Public
const getAuctions = async (req, res) => {
  try {
    let auctions = await Auction.find({}).populate('seller', 'username email');
    
    // Apply lazy winner logic to all fetched auctions
    for (let i = 0; i < auctions.length; i++) {
      auctions[i] = await checkAndCloseAuction(auctions[i]);
    }

    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auctions', error: error.message });
  }
};

// @desc    Get single auction by ID
// @route   GET /api/auctions/:id
// @access  Public
const getAuctionById = async (req, res) => {
  try {
    let auction = await Auction.findById(req.params.id)
      .populate('seller', 'username email')
      .populate('winner', 'username email');

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Apply lazy winner logic
    auction = await checkAndCloseAuction(auction);

    // If it was just closed, we might need to re-populate the winner field
    if (auction.status === 'ended' && auction.winner && !auction.winner.username) {
       auction = await Auction.findById(auction._id)
        .populate('seller', 'username email')
        .populate('winner', 'username email');
    }

    // Also fetch the bid history for this auction
    const bids = await Bid.find({ auction: auction._id })
      .populate('bidder', 'username')
      .sort({ createdAt: -1 }); // Newest first

    res.json({ auction, bids });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auction', error: error.message });
  }
};

// @desc    Update an auction
// @route   PUT /api/auctions/:id
// @access  Private (Seller only)
const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Ensure only the seller can update it
    if (auction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this auction' });
    }

    // Prevent updates if bids have already been placed
    const bidCount = await Bid.countDocuments({ auction: auction._id });
    if (bidCount > 0) {
       return res.status(400).json({ message: 'Cannot update auction after bids have been placed' });
    }

    const updatedAuction = await Auction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );

    res.json(updatedAuction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating auction', error: error.message });
  }
};

// @desc    Delete an auction
// @route   DELETE /api/auctions/:id
// @access  Private (Seller or Admin)
const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Ensure only the seller OR an admin can delete it
    if (auction.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this auction' });
    }

    await Auction.deleteOne({ _id: auction._id });
    
    // Also delete all associated bids
    await Bid.deleteMany({ auction: auction._id });

    res.json({ message: 'Auction removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting auction', error: error.message });
  }
};

module.exports = {
  createAuction,
  getAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
};
