const Blog = require('../models/blogModel')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body)
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const updateBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        validateMongodbId(id)

        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const getaBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        validateMongodbId(id)

        const blog = await Blog.findById(id).populate('likes').populate('dislikes')
        await Blog.findByIdAndUpdate(id, {
            $inc: { numViews: 1 }
        }, {
            new: true,
        })
        res.json(blog)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.find()
        res.json(blog)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteBlog = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        validateMongodbId(id)

        const deleteBlog = await Blog.findByIdAndDelete(id)
        res.json(deleteBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const likeBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body
        validateMongodbId(blogId)

        const blog = await Blog.findById(blogId)
        const loginUserId = req?.user?._id

        const isLiked = blog?.isLiked
        const alreadyDisLike = blog?.dislikes?.find(
            (userId => userId?.toString() === loginUserId?.toString())
        )
        if (alreadyDisLike) {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            }, { new: true, })
            res.json(blog)
        }
        if (isLiked) {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId },
                isLiked: false,
            }, { new: true, })
            res.json(blog)
        } else {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: { likes: loginUserId },
                isLiked: true,
            }, { new: true, })
            res.json(blog)
        }
    } catch (error) {
        throw new Error(error)
    }
})

const disLikeBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.body
        validateMongodbId(blogId)

        const blog = await Blog.findById(blogId)
        const loginUserId = req?.user?._id

        const isDisliked = blog?.isDisliked
        const alreadyisLike = blog?.likes?.find(
            (userId => userId?.toString() === loginUserId?.toString())
        )
        if (alreadyisLike) {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { likes: loginUserId },
                isLiked: false,
            }, { new: true, })
            res.json(blog)
        }
        if (isDisliked) {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            }, { new: true, })
            res.json(blog)
        } else {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: { dislikes: loginUserId },
                isDisliked: true,
            }, { new: true, })
            res.json(blog)
        }
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = {
    createBlog,
    updateBlog,
    getaBlog,
    getAllBlog,
    deleteBlog,
    likeBlog,
    disLikeBlog
}