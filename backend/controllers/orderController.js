const Order = require('../models/Order')
const Product = require('../models/Product')

// GET /api/orders — all orders, newest first
const getOrders = async (req, res) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status

    const orders = await Order.find(filter)
      .populate('product', 'name brand image')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET /api/orders/stats — dashboard summary numbers
const getStats = async (req, res) => {
  try {
    const [total, pending, confirmed, sourcing, arrived, delivered, cancelled, revenueData] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: 'pending' }),
        Order.countDocuments({ status: 'confirmed' }),
        Order.countDocuments({ status: 'sourcing' }),
        Order.countDocuments({ status: 'arrived' }),
        Order.countDocuments({ status: 'delivered' }),
        Order.countDocuments({ status: 'cancelled' }),
        Order.aggregate([
          { $match: { advancePaid: true } },
          { $group: { _id: null, total: { $sum: '$advanceAmount' } } },
        ]),
      ])

    res.json({
      total,
      pending,
      confirmed,
      sourcing,
      arrived,
      delivered,
      cancelled,
      advanceCollected: revenueData[0]?.total ?? 0,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET /api/orders/:id — single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('product')
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// POST /api/orders — create new order
const createOrder = async (req, res) => {
  try {
    const { productId, customerName, customerPhone, size, paymentMethod, paymentReference, notes } =
      req.body

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    const order = await Order.create({
      customerName,
      customerPhone,
      product: product._id,
      productName: product.name,
      productBrand: product.brand,
      colorway: product.colorway,
      size,
      totalPrice: product.price,
      advanceAmount: Math.ceil(product.price / 2),
      paymentMethod: paymentMethod ?? null,
      paymentReference: paymentReference ?? '',
      notes: notes ?? '',
    })

    // Decrement slotsRemaining if product has a slot limit
    if (product.slotsRemaining !== null) {
      product.slotsRemaining = Math.max(0, product.slotsRemaining - 1)
      if (product.slotsRemaining === 0) product.available = false
      await product.save()
    }

    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ message: 'Validation error', error: err.message })
  }
}

// PATCH /api/orders/:id — update status, payment, notes
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(400).json({ message: 'Validation error', error: err.message })
  }
}

// GET /api/orders/status/:orderId — public, safe fields only (no PII)
const getPublicOrderStatus = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId.toUpperCase() })
      .select('orderId productName productBrand colorway size status advancePaid createdAt')

    if (!order) return res.status(404).json({ message: 'Order not found. Check your order ID and try again.' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { getOrders, getStats, getOrderById, createOrder, updateOrder, getPublicOrderStatus }
