const Route = require('express').Router()
const { createCupon, getAllCupons, updateCupons, deleteCupons } = require('../controller/cuponCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

Route.get('/', authMiddleware, isAdmin, getAllCupons)
Route.post('/', authMiddleware, isAdmin, createCupon)
Route.put('/:id', authMiddleware, isAdmin, updateCupons)
Route.delete('/:id', authMiddleware, isAdmin, deleteCupons)

module.exports = Route