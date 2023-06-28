const Route = require('express').Router()
const { createUser, loginUserCtrl, getAllUser, getaUser, deleteaUser, updateaUser, blockUser,
    unBlockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword } = require('../controller/userCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

Route.post('/register', createUser)
Route.post('/forgot-password-token', forgotPasswordToken)
Route.put('/password/:id', authMiddleware, updatePassword)
Route.put('/reset-password/:token', resetPassword)
Route.post('/login', loginUserCtrl)
Route.get('/all-users', getAllUser)
Route.get('/refresh-token', handleRefreshToken)
Route.get('/logout', logout)
Route.get('/', authMiddleware, isAdmin, getaUser)
Route.delete('/', authMiddleware, deleteaUser)
Route.put('/', authMiddleware, updateaUser)
Route.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
Route.put('/unblock-user/:id', authMiddleware, isAdmin, unBlockUser)

module.exports = Route