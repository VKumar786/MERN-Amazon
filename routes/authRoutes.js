const Route = require('express').Router()
const { createUser, loginUserCtrl, getAllUser, getaUser, deleteaUser, updateaUser } = require('../controller/userCtrl')

Route.post('/register', createUser)
Route.post('/login', loginUserCtrl)
Route.get('/all-users', getAllUser)
Route.get('/:id', getaUser)
Route.delete('/:id', deleteaUser)
Route.put('/:id', updateaUser)

module.exports = Route