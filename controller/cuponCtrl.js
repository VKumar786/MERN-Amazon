const Cupon = require('../models/cuponModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')

const createCupon = asyncHandler(async (req, res) => {
    try {
        const newCupon = await Cupon.create(req.body)
        res.json(newCupon)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllCupons = asyncHandler(async (req, res) => {
    try {
        const cupon = await Cupon.find()
        res.json(cupon)
    } catch (error) {
        throw new Error(error)
    }
})

const updateCupons = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params
        validateMongodbId(id)
        const updateCupon = await Cupon.findByIdAndUpdate(id, req.body, {new : true})
        res.json(updateCupon)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteCupons = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params
        validateMongodbId(id)
        const deleteCupon = await Cupon.findByIdAndDelete(id)
        res.json(deleteCupon)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createCupon,
    getAllCupons,
    updateCupons,
    deleteCupons
}