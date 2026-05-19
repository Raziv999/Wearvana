const router = require('express').Router()
const Review = require('../models/Review')

// GET /api/reviews — all approved reviews (public)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/reviews/all — all reviews including unapproved (admin)
router.get('/all', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/reviews — create a review (admin)
router.post('/', async (req, res) => {
  const { name, location, product, rating, text } = req.body
  if (!name?.trim() || !text?.trim())
    return res.status(400).json({ message: 'Name and review text are required.' })
  try {
    const review = await Review.create({ name, location, product, rating, text })
    res.status(201).json(review)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PATCH /api/reviews/:id — toggle approved (admin)
router.patch('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!review) return res.status(404).json({ message: 'Review not found.' })
    res.json(review)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/reviews/:id — remove a review (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
