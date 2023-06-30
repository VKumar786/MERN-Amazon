const Route = require('express').Router()
const { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand } = require('../controller/brandCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

Route.get('/', getAllBrand)
Route.get('/:id', getBrand)
Route.post('/', authMiddleware, isAdmin, createBrand)
Route.put('/:id', authMiddleware, isAdmin, updateBrand)
Route.delete('/:id', authMiddleware, isAdmin, deleteBrand)

module.exports = Route