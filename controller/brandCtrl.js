const Brand = require('../models/brandModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')

const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
})

const updateBrand = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        validateMongodbId(id);

        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updateBrand)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteBrand = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        validateMongodbId(id);

        const deleteBrand = await Brand.findByIdAndDelete(id)
        res.json(deleteBrand)
    } catch (error) {
        throw new Error(error)
    }
})

const getBrand = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        validateMongodbId(id)

        const brand = await Brand.findById(id)
        res.json(brand)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const brand = await Brand.find()
        res.json(brand)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrand
}