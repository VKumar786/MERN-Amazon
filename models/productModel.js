const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    images: {
        type: String,
    },
    sold: {
        type: Number,
        default: 0,
        //? select: false, -- hide from user
    },
    // color: {
    //     type: String,
    //     enum: ["Black", "Brown", "Red"],
    // },
    color: {
        type: String,
        required: true,
    },
    // brand: {
    //     type: String,
    //     enum: ["Apple", "Samsung", "Lenovo"],
    // },
    brand: {
        type: String,
        required: true,
    },
    // category: { type: mongoose.Types.ObjectId, ref: "Category" },
    category: { type: String, required: true, },
    ratings: [{
        star: Number,
        postedby: { type: mongoose.Types.ObjectId, ref: "User" },
    }],
},{
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);