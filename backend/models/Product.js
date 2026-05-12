const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    colorway: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['sneakers', 'running', 'caps'],
    },
    subcategory: {
      type: String,
      default: null,
      // Used for Jordan silhouettes and running sub-types
      // e.g. 'Jordan 1 Low', 'Jordan 1 Mid', 'Jordan 1 High', 'Air Jordan 4'
    },
    image: {
      type: String,
      default: '',
    },
    // Additional gallery images (up to 5 total including main)
    images: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      enum: ['HOT', 'NEW', 'SELLING FAST', 'ICONIC', null],
      default: null,
    },
    limited: {
      type: Boolean,
      default: false,
    },
    available: {
      type: Boolean,
      default: true,
    },
    // Tracks how many pre-order slots remain (null = unlimited)
    slotsRemaining: {
      type: Number,
      default: null,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    // Sizes that are sold out — still shown but greyed out / unselectable
    soldSizes: {
      type: [String],
      default: [],
    },
    // Optional video URL (YouTube embed or direct mp4)
    videoUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)
