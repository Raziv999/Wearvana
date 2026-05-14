const router  = require('express').Router()
const Waitlist = require('../models/Waitlist')
const Product  = require('../models/Product')

// ── POST /api/waitlist ─ join waitlist ────────────────────────
router.post('/', async (req, res) => {
  const { productId, name, phone } = req.body

  if (!productId || !name?.trim() || !phone?.trim()) {
    return res.status(400).json({ message: 'productId, name, and phone are required.' })
  }

  // Nepal phone validation
  if (!/^(98|97)\d{8}$/.test(phone.trim())) {
    return res.status(400).json({ message: 'Enter a valid Nepali phone number (98/97XXXXXXXX).' })
  }

  try {
    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: 'Product not found.' })

    const entry = await Waitlist.create({
      product:      productId,
      productName:  product.name,
      productBrand: product.brand,
      name:  name.trim(),
      phone: phone.trim(),
    })

    res.status(201).json({ message: 'You\'re on the waitlist!', id: entry._id })
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key — already on waitlist
      return res.status(409).json({ message: 'You\'re already on the waitlist for this product.' })
    }
    res.status(500).json({ message: 'Server error.', error: err.message })
  }
})

// ── GET /api/waitlist/:productId ─ all entries (admin use) ────
router.get('/:productId', async (req, res) => {
  try {
    const entries = await Waitlist.find({ product: req.params.productId })
      .sort({ createdAt: -1 })
    res.json(entries)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── GET /api/waitlist/count/:productId ─ count for badges ─────
router.get('/count/:productId', async (req, res) => {
  try {
    const count = await Waitlist.countDocuments({ product: req.params.productId })
    res.json({ count })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── DELETE /api/waitlist/:id ─ remove a single entry ──────────
router.delete('/:id', async (req, res) => {
  try {
    await Waitlist.findByIdAndDelete(req.params.id)
    res.json({ message: 'Removed.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
