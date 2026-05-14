const mongoose = require('mongoose')

const waitlistSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    productName:  { type: String, default: '' },
    productBrand: { type: String, default: '' },
    name:  { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    // Prevent duplicate sign-ups per product + phone
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Compound unique index — one entry per (product, phone)
waitlistSchema.index({ product: 1, phone: 1 }, { unique: true })

module.exports = mongoose.model('Waitlist', waitlistSchema)
