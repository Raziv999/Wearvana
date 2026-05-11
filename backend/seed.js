require('dotenv').config()
const dns = require('dns')
const mongoose = require('mongoose')
const Product = require('./models/Product')

dns.setServers(['8.8.8.8', '8.8.4.4'])

const products = [
  // --- Sneakers ---
  {
    brand: 'NIKE',
    name: "Air Force 1 '07 LX",
    colorway: 'Summit White / Pale Ivory',
    price: 18500,
    category: 'sneakers',
    image: '/products/af1-lx.jpg',
    badge: 'HOT',
    limited: true,
    available: true,
    slotsRemaining: 10,
    slug: 'nike-air-force-1-07-lx',
  },
  {
    brand: 'NEW BALANCE',
    name: '550 "BBB"',
    colorway: 'White / Green',
    price: 16800,
    category: 'sneakers',
    image: '/products/nb550.jpg',
    badge: 'NEW',
    limited: false,
    available: true,
    slotsRemaining: null,
    slug: 'new-balance-550-bbb',
  },
  {
    brand: 'JORDAN',
    name: 'Air Jordan 1 Retro High OG',
    colorway: 'Chicago — White / Black / Varsity Red',
    price: 24500,
    category: 'sneakers',
    subcategory: 'Jordan 1 High',
    image: '/products/j1-chicago.jpg',
    badge: 'SELLING FAST',
    limited: true,
    available: true,
    slotsRemaining: 5,
    slug: 'air-jordan-1-chicago',
  },
  {
    brand: 'ADIDAS',
    name: 'Samba OG',
    colorway: 'Cloud White / Core Black / Gum',
    price: 15500,
    category: 'sneakers',
    image: '/products/samba.jpg',
    badge: null,
    limited: false,
    available: true,
    slotsRemaining: null,
    slug: 'adidas-samba-og',
  },
  // --- Caps ---
  {
    brand: 'NEW ERA',
    name: '59FIFTY MLB New York Yankees',
    colorway: 'Navy / White',
    price: 6500,
    category: 'caps',
    image: '/products/ne-yankees.jpg',
    badge: 'ICONIC',
    limited: false,
    available: true,
    slotsRemaining: null,
    slug: 'new-era-yankees-59fifty',
  },
  {
    brand: 'NEW ERA',
    name: '9FORTY NBA Chicago Bulls',
    colorway: 'Black / Red Snapback',
    price: 5800,
    category: 'caps',
    image: '/products/ne-bulls.jpg',
    badge: 'NEW',
    limited: false,
    available: true,
    slotsRemaining: null,
    slug: 'new-era-bulls-9forty',
  },
  {
    brand: 'NEW ERA',
    name: '59FIFTY NBA Los Angeles Lakers',
    colorway: 'Purple / Gold',
    price: 6800,
    category: 'caps',
    image: '/products/ne-lakers.jpg',
    badge: null,
    limited: true,
    available: true,
    slotsRemaining: 8,
    slug: 'new-era-lakers-59fifty',
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected')
    await Product.deleteMany({})
    console.log('Cleared existing products')
    const inserted = await Product.insertMany(products)
    console.log(`Seeded ${inserted.length} products successfully`)
    process.exit(0)
  } catch (err) {
    console.error('Seed error:', err.message)
    process.exit(1)
  }
}

seed()
