const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1]
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)
                const user = await User.findById(decoded?.id)
                if (user) {
                    req.user = user
                    next()
                } else {
                    throw new Error("User not found")
                }
            }
        } catch (error) {
            next(error)
        }
    } else {
        next(new Error("There is no auth token"))
    }
})

const isAdmin = asyncHandler(async (req, res, next) => {
    const userId = req.user._id.toHexString();
    const adminUser = await User.findById(userId)
    if(adminUser.role !== "admin") throw new Error("You are not admin")
    next();
});


module.exports = { authMiddleware, isAdmin }
