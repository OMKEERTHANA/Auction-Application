const User = require('../models/User');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// ==================== USER MANAGEMENT ====================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      message: 'Users retrieved successfully',
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:userId
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own admin account' });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete all auctions created by this user
    await Auction.deleteMany({ seller: userId });

    // Delete all bids placed by this user
    await Bid.deleteMany({ bidder: userId });

    res.status(200).json({
      message: 'User deleted successfully',
      deletedUser: user.username,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// ==================== AUCTION MANAGEMENT ====================

// @desc    Get all auctions (admin view - includes all statuses)
// @route   GET /api/admin/auctions
// @access  Private/Admin
const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate('seller', 'username email')
      .populate('winner', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Auctions retrieved successfully',
      count: auctions.length,
      auctions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auctions', error: error.message });
  }
};

// @desc    Delete an auction (remove spam/fake auctions)
// @route   DELETE /api/admin/auctions/:auctionId
// @access  Private/Admin
const deleteAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findByIdAndDelete(auctionId);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Delete all bids associated with this auction
    await Bid.deleteMany({ auction: auctionId });

    res.status(200).json({
      message: 'Auction deleted successfully',
      deletedAuction: auction.title,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting auction', error: error.message });
  }
};

// ==================== BID MANAGEMENT ====================

// @desc    Get all bids with details
// @route   GET /api/admin/bids
// @access  Private/Admin
const getAllBids = async (req, res) => {
  try {
    const bids = await Bid.find()
      .populate('bidder', 'username email')
      .populate('auction', 'title currentBid')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Bids retrieved successfully',
      count: bids.length,
      bids,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bids', error: error.message });
  }
};

// ==================== STATISTICS ====================

// @desc    Get platform statistics
// @route   GET /api/admin/statistics
// @access  Private/Admin
const getStatistics = async (req, res) => {
  try {
    // Count total users
    const totalUsers = await User.countDocuments();

    // Count total auctions
    const totalAuctions = await Auction.countDocuments();

    // Count active auctions
    const activeAuctions = await Auction.countDocuments({ status: 'active' });

    // Count completed (ended) auctions
    const completedAuctions = await Auction.countDocuments({ status: 'ended' });

    // Count total bids
    const totalBids = await Bid.countDocuments();

    // Calculate total bid value
    const bidStats = await Bid.aggregate([
      {
        $group: {
          _id: null,
          totalBidValue: { $sum: '$amount' },
          averageBidValue: { $avg: '$amount' },
        },
      },
    ]);

    const totalBidValue = bidStats[0]?.totalBidValue || 0;
    const averageBidValue = bidStats[0]?.averageBidValue || 0;

    res.status(200).json({
      message: 'Platform statistics',
      statistics: {
        users: {
          total: totalUsers,
        },
        auctions: {
          total: totalAuctions,
          active: activeAuctions,
          completed: completedAuctions,
        },
        bids: {
          total: totalBids,
          totalValue: Math.round(totalBidValue),
          averageValue: Math.round(averageBidValue),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllAuctions,
  deleteAuction,
  getAllBids,
  getStatistics,
};
