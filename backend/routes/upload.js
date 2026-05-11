const express  = require('express')
const router   = express.Router()

// Guard: if Cloudinary isn't configured, return helpful 503 rather than crashing
const CLOUDINARY_OK =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET

const { upload, cloudinary } = require('../middleware/upload')

// POST /api/upload  — single image upload from admin
router.post('/', (req, res, next) => {
  if (!CLOUDINARY_OK) {
    return res.status(503).json({
      message: 'Cloudinary not configured — add CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET to backend .env',
    })
  }
  next()
}, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file received' })

  res.json({
    url:      req.file.path,      // full Cloudinary HTTPS URL
    publicId: req.file.filename,
  })
})

// DELETE /api/upload  — remove from Cloudinary when admin removes a photo
router.delete('/', async (req, res) => {
  const { publicId } = req.body
  if (!publicId) return res.status(400).json({ message: 'publicId required' })
  try {
    await cloudinary.uploader.destroy(publicId)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
