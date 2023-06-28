const Product = require('../models/productModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')

//* Create Product
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        let product = await Product.create(req.body)
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
})

//* Get a Prodcut
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        let product = await Product.findById(id)
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
})

//* Get All Product
const getAllProduct = asyncHandler(async (req, res) => {
    try {
        //? filtering
        let queryObj = {...req.query} //! imp b/c of shallow copy
        const excludeFields = ["page", "sort", "limit", "fields"]
        excludeFields.forEach(el => delete queryObj[el])

        //? { price: { gt: '200', lt: '500' } } -> { "price": { "$gt": "200", "$lt": "500" } }
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        
        let query = Product.find(JSON.parse(queryStr))  
        
        //? sorting
        if(req.query.sort) {
            //? category,brand(query) -> category brand
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        //? limiting fields
        if (req.query.fields) {
            //? -title,-price,-description
            //? title,price,description
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        //? Pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        if(req.query.page) {
            const productCount = await Product.countDocuments()
            if(skip >= productCount) throw new Error("this page don't exits")
        }
        query = query.skip(skip).limit(limit)


        const product = await query
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
})

//* Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true,
        })
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//* Delete Product 
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        let deleteProduct = await Product.findByIdAndDelete(id)
        res.json(deleteProduct)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
}