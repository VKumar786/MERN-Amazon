const Route = require('express').Router()
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategory } = require('../controller/productCategoryCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

Route.get('/', getAllCategory)
Route.get('/:id', getCategory)
Route.post('/', authMiddleware, isAdmin, createCategory)
Route.put('/:id', authMiddleware, isAdmin, updateCategory)
Route.delete('/:id', authMiddleware, isAdmin, deleteCategory)

module.exports = Route