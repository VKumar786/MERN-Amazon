const Category = require('../models/productCategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongodbId = require('../utils/validateMongodbId')

const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await Category.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        validateMongodbId(id);

        const updateCategory = await Category.findByIdAndUpdate(id, req.body, { new: true })
        res.json(updateCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        validateMongodbId(id);

        const deleteCategory = await Category.findByIdAndDelete(id)
        res.json(deleteCategory)
    } catch (error) {
        throw new Error(error)
    }
})

const getCategory = asyncHandler(async (req, res) => {
    try {
        const {id} = req.params
        validateMongodbId(id)

        const category = await Category.findById(id)
        res.json(category)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.find()
        res.json(category)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory
}