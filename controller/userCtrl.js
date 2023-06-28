const User = require('../models/userModel')
const generateToken = require('../config/jwtToken')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')
const jwt = require('jsonwebtoken')
const { generateRefreshToken } = require('../config/refreshToken')

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
    const refreshToken = await generateRefreshToken(user?._id)
    const updateUser = await User.findByIdAndUpdate(user?._id, {
      refreshToken
    }, { new: true })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000
    })
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

//* handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookie")

  const refreshToken = cookie.refreshToken
  const user = await User.findOne({ refreshToken })
  if (!user) throw new Error("No Refresh token in db or not matched")

  jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err || user?.id !== decoded?.id)
      throw new Error('There is something wrong with refresh token')
    //? decoded -> { id: '649bd2d3e7e7150908ea757b', iat: 1687933667, exp: 1688192867 }
    const accessToken = generateToken(decoded?.id)
    res.json({ accessToken })
  })
})

//* Logout
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh token in cookie");

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    return res.status(204).send();
  }

  await User.findOneAndUpdate({ refreshToken: refreshToken }, {
    refreshToken: "",
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });

  return res.status(200).send();
});

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

//* Update Password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user
  validateMongoDbId(_id)
  try {
    const { password } = req.body
    const user = await User.findById(_id)
    if(password) {
      user.password = password
      const updatePwd = await user.save()
      res.json(updatePwd)
    } else res.json(user)
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
  handleRefreshToken,
  logout,
  updatePassword
}