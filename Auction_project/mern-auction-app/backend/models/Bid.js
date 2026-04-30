const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Auction',
    },
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically tracks when the bid was placed via `createdAt`
  }
);

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
