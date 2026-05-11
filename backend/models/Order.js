const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    // Denormalized so order history survives product edits/deletes
    productName: { type: String, required: true },
    productBrand: { type: String, required: true },
    colorway: { type: String },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    advanceAmount: {
      type: Number,
      required: true,
    },
    advancePaid: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ['esewa', 'khalti', 'bank', 'cash', null],
      default: null,
    },
    paymentReference: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'sourcing', 'arrived', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

// Auto-generate human-readable Order ID: WV-001, WV-002 ...
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderId = `WV-${String(count + 1).padStart(3, '0')}`
  }
  next()
})

module.exports = mongoose.model('Order', orderSchema)
