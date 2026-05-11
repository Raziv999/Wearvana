require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const app = express()

// Connect to MongoDB Atlas
connectDB()

// ── CORS ──────────────────────────────────────────────────────────
// Allow frontend (localhost in dev, production domain in prod)
// and any Vercel preview URLs.
const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'https://wearvana.com',
  'https://www.wearvana.com',
]
app.use(cors({
  origin: (origin, cb) => {
    // Allow same-origin (no Origin header) and all configured domains
    if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app')) {
      cb(null, true)
    } else {
      cb(new Error(`CORS: ${origin} not allowed`))
    }
  },
  credentials: true,
}))

// Body parsing
app.use(express.json())

// Routes
app.use('/api/products', require('./routes/products'))
app.use('/api/orders',   require('./routes/orders'))
app.use('/api/upload',   require('./routes/upload'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'wearvana-api' })
})

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => console.log(`Wearvana API running on port ${PORT}`))
