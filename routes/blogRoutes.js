const Route = require('express').Router()
const { createBlog, updateBlog, getaBlog, getAllBlog, deleteBlog, likeBlog, disLikeBlog } = require('../controller/blogCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

Route.get('/', getAllBlog)
Route.post('/', authMiddleware, isAdmin, createBlog)
Route.put('/likes', authMiddleware, likeBlog)
Route.put('/dislikes', authMiddleware, disLikeBlog)
Route.put('/:id', authMiddleware, isAdmin, updateBlog)
Route.get('/:id', getaBlog)
Route.delete('/:id', authMiddleware, isAdmin, deleteBlog)

module.exports = Route