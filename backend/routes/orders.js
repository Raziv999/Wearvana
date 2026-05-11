const express = require('express')
const router = express.Router()
const {
  getOrders,
  getStats,
  getOrderById,
  createOrder,
  updateOrder,
  getPublicOrderStatus,
} = require('../controllers/orderController')

router.get('/stats', getStats)
router.get('/status/:orderId', getPublicOrderStatus)
router.get('/', getOrders)
router.get('/:id', getOrderById)
router.post('/', createOrder)
router.patch('/:id', updateOrder)

module.exports = router
