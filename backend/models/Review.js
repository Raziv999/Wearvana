const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    location: { type: String, default: 'Nepal', trim: true },
    product:  { type: String, default: '', trim: true },   // optional product name
    rating:   { type: Number, min: 1, max: 5, default: 5 },
    text:     { type: String, required: true, trim: true },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Review', reviewSchema)
