const express = require('express')
const router = express.Router()
const {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController')

router.get('/', getProducts)
router.get('/slug/:slug', getProductBySlug)  // must be before /:id
router.get('/:id', getProductById)
router.post('/', createProduct)
router.patch('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
