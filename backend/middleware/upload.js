const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:         'wearvana/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'heic'],
    // Auto-optimize + cap at 1500px so pages stay fast
    transformation: [
      { width: 1500, height: 1500, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
    ],
  }),
})

// 10 MB limit per image
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'), false)
  },
})

module.exports = { upload, cloudinary }
