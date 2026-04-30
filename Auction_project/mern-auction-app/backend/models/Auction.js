const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL to an image
      default: 'https://via.placeholder.com/400x300?text=No+Image',
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currentBid: {
      type: Number,
      default: 0, // Will be initialized to basePrice on creation in the controller
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // References the User schema
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'ended', 'cancelled'],
      default: 'active',
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Populated when the auction ends
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;
