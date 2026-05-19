const https   = require('https')
const Product  = require('../models/Product')
const Waitlist = require('../models/Waitlist')

// ── CallMeBot WhatsApp sender ──────────────────────────────────
// Fire-and-forget. Encodes the message and POSTs to CallMeBot.
function sendWhatsApp(phone, message) {
  return new Promise((resolve) => {
    const encoded = encodeURIComponent(message)
    const url = `https://api.callmebot.com/whatsapp.php?phone=977${phone}&text=${encoded}&apikey=${process.env.CALLMEBOT_API_KEY}`
    https.get(url, (res) => {
      res.resume()            // drain the response so the socket closes cleanly
      resolve()
    }).on('error', () => resolve())   // never throw — notifications are best-effort
  })
}

// GET /api/products — all products, optionally filter by category
const getProducts = async (req, res) => {
  try {
    const filter = {}
    if (req.query.category)    filter.category    = req.query.category
    if (req.query.subcategory) filter.subcategory = req.query.subcategory
    if (req.query.brand)       filter.brand       = req.query.brand.toUpperCase()
    if (req.query.available === 'true') filter.available = true

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET /api/products/slug/:slug — lookup by slug
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET /api/products/:id — single product by MongoDB ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// POST /api/products — create a product (admin use)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: 'Validation error', error: err.message })
  }
}

// PATCH /api/products/:id — update availability or slots
const updateProduct = async (req, res) => {
  try {
    // Fetch the current document BEFORE updating so we can detect the
    // available: false → true transition
    const before = await Product.findById(req.params.id)
    if (!before) return res.status(404).json({ message: 'Product not found' })

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.json(product)

    // ── Auto-notify waitlist on "goes live" transition ─────────
    const goingLive = req.body.available === true && before.available === false
    if (!goingLive) return

    // Fetch unnotified waitlist entries (don't block the response)
    const entries = await Waitlist.find({ product: req.params.id, notified: false })
    if (!entries.length) return

    const productName  = product.name
    const productBrand = product.brand

    // Queue one message per entry, 1 second apart (CallMeBot rate limit)
    entries.forEach((entry, i) => {
      setTimeout(async () => {
        const msg =
          `Hi ${entry.name}! 🔥 ${productBrand} ${productName} is now LIVE on Wearvana Nepal! ` +
          `Pre-order before slots run out: https://wearvana.vercel.app`

        await sendWhatsApp(entry.phone, msg)

        // Mark as notified after the message is sent
        await Waitlist.findByIdAndUpdate(entry._id, { notified: true })
      }, i * 1000)
    })

  } catch (err) {
    res.status(400).json({ message: 'Validation error', error: err.message })
  }
}

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product removed' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { getProducts, getProductBySlug, getProductById, createProduct, updateProduct, deleteProduct }
