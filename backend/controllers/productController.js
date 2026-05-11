const Product = require('../models/Product')

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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
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
