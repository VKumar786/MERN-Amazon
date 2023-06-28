const { createProduct, getaProduct, getAllProduct } = require('../controller/productCtrl')
const Route = require('express').Router()

Route.post('', createProduct)
Route.get('', getAllProduct)
Route.get('/:id', getaProduct)

module.exports = Route