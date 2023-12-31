const User = require('../models/userModel')
const Product = require('../models/productModel')
const Cart = require('../models/cartModel')
const Cupon = require('../models/cuponModel')

const generateToken = require('../config/jwtToken')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')
const jwt = require('jsonwebtoken')
const { generateRefreshToken } = require('../config/refreshToken')
const sendEmail = require('./emailCtrl')
const crypto = require('crypto')

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

//* admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  //* check weather user exits
  const AdminUser = await User.findOne({ email })
  if (AdminUser.role !== 'admin') throw new Error('Not Authroized')
  if (AdminUser && (await AdminUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(AdminUser?._id)
    const updateUser = await User.findByIdAndUpdate(AdminUser?._id, {
      refreshToken
    }, { new: true })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000
    })
    res.json({
      _id: AdminUser?._id,
      firstname: AdminUser?.firstname,
      lastname: AdminUser?.lastname,
      email: AdminUser?.email,
      mobile: AdminUser?.mobile,

      token: generateToken(AdminUser?._id)
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

//* Save user address
const saveAddress = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user
    validateMongoDbId(_id)

    const updateUser = await User.findByIdAndUpdate(_id, {
      address: req.body?.address,
    }, { new: true })

    res.json(updateUser)
  } catch (error) {
    throw new Error(error)
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

//* Update Password
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user
  validateMongoDbId(_id)
  try {
    const { password } = req.body
    const user = await User.findById(_id)
    if (password) {
      user.password = password
      const updatePwd = await user.save()
      res.json(updatePwd)
    } else res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

//* forgot password
const forgotPasswordToken = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new Error('User Not Found with given credential')
    const token = await user.createPasswordResetToken()
    await user.save() //? b/c of internal update done in createPasswordResetToken

    const resetUrl = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href='http://localhost:5173/api/user/reset-password/${token}'>Click Here</a>`
    let data = {
      to: email,
      text: "Hey User 🔥",
      subject: "Forgot Password Link",
      html: resetUrl,
    }
    sendEmail(data)
    res.json(token)
  } catch (error) {
    throw new Error(error)
  }
})

//* Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { password } = req.body
    const { token } = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })
    if (!user) throw new Error('Token expired, Please try again')
    user.password = password
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

const getWishList = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user
    const user = await User.findById(_id).populate('wishlist')
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
})

const userCart = asyncHandler(async (req, res) => {
  try {
    const { cart } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)

    const user = await User.findById(_id)
    //? check if user have already product in cart
    let alreadyExits = await Cart.findOne({
      orderby: user._id
    })
    let products = []

    if (alreadyExits) {
      alreadyExits.remove()
    }

    for (let i = 0; i < cart.length; i++) {
      let obj = {}
      obj.product = cart[i]._id
      obj.count = cart[i].count
      obj.color = cart[i].color
      let getPrice = await Product.findById(cart[i]._id).select('price').exec()
      obj.price = getPrice.price
      products.push(obj)
    }

    let cartTotal = 0
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count
    }

    let newCart = await Cart.create({
      products,
      cartTotal,
      orderby: user?._id
    })

    res.json(newCart)
  } catch (error) {
    throw new Error(error)
  }
})

const getUserCart = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user
    validateMongoDbId(_id)

    const cart = await Cart.findOne({
      orderby: _id
    }).populate('products.product')

    res.json(cart)
  } catch (error) {
    throw new Error(error)
  }
})

const emptyCart = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user
    validateMongoDbId(_id)

    const user = await User.findById(_id)
    const cart = await Cart.findOneAndRemove({
      orderby: user._id
    })

    res.json(cart)
  } catch (error) {
    throw new Error(error)
  }
})

const applyCupon = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user
    validateMongoDbId(_id)
    const { cupon } = req.body
    const validCupon = await Cupon.findOne({
      name: cupon
    })

    if (validCupon == null) {
      throw new Error('Invalid Cupon')
    }

    const user = await User.findById(_id)
    let { products, cartTotal } = await Cart.findOne({
      orderby: user._id
    }).populate('products.product')

    let totalAfterDiscount = (cartTotal - (cartTotal * validCupon.discount) / 100).toFixed(2)
    await Cart.findOneAndUpdate({
      orderby: user._id
    }, {
      totalAfterDiscount
    }, { new: true })

    
    res.json(totalAfterDiscount)
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
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishList,
  saveAddress,

  userCart,
  getUserCart,
  emptyCart,

  applyCupon
}