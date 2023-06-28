const User = require('../models/userModel')
const generateToken = require('../config/jwtToken')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')

//* Register user
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email
  const findUser = await User.findOne({ email })

  if (!findUser) {
    //* Create New User
    const newUser = await User.create(req.body)
    res.json(newUser)
  } else {
    //* User Already exits
    throw new Error("User Already exits 🤪")
  }
})

//* Login user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  //* check weather user exits
  const user = await User.findOne({ email })
  if (user && (await user.isPasswordMatched(password))) {
    res.json({
      _id: user?._id,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      mobile: user?.mobile,

      token: generateToken(user?._id)
    })
  } else {
    throw new Error("Invalid Credentials 🤪")
  }
})

//* Get All user
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUser = await User.find({})
    res.json(getUser)
  } catch (error) {
    throw new Error(error)
  }
})

//* Get single user
const getaUser = asyncHandler(async (req, res) => {
  let { _id } = req.user
  validateMongoDbId(_id)
  try {
    let user = await User.find({ _id })
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

//* Delete a user
const deleteaUser = asyncHandler(async (req, res) => {
  let { _id } = req.user
  validateMongoDbId(_id)
  try {
    let user = await User.findByIdAndDelete(_id)
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

//* Update a user 
const updateaUser = asyncHandler(async (req, res) => {
  let { _id } = req.user
  validateMongoDbId(_id)
  try {
    let user = await User.findByIdAndUpdate(_id, {
      firstname: req?.body?.firstname,
      lastname: req?.body?.lastname,
      email: req?.body?.email,
      mobile: req?.body?.mobile,
    }, { new: true })
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

//* Block User
const blockUser = asyncHandler(async (req, res) => {
  let { id } = req.params
  validateMongoDbId(id)
  try {
    let user = await User.findByIdAndUpdate(id, {
      isBlocked: true,
    }, {
      new: true
    })
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

//* Unblock User
const unBlockUser = asyncHandler(async (req, res) => {
  let { id } = req.params
  validateMongoDbId(id)
  try {
    let user = await User.findByIdAndUpdate(id, {
      isBlocked: false,
    }, {
      new: true
    })
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = {
  createUser,
  loginUserCtrl,
  getAllUser,
  getaUser,
  deleteaUser,
  updateaUser,
  blockUser,
  unBlockUser,
}