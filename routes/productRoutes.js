const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishList, rating } = require('../controller/productCtrl')
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware')
const Route = require('express').Router()

Route.get('', getAllProduct)
Route.put('/wishList', authMiddleware, addToWishList)
Route.put('/rating', authMiddleware, rating)
Route.get('/:id', getaProduct)
Route.post('', authMiddleware, isAdmin, createProduct)
Route.put('/:id', authMiddleware, isAdmin, updateProduct)
Route.delete('/:id', authMiddleware, isAdmin, deleteProduct)

module.exports = Route