const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
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
    },
    color: {
        type: String,
        enum: ["Black", "Brown", "Red"],
    },
    brand: {
        type: String,
        enum: ["Apple", "Samsung", "Lenovo"],
    },
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    ratings: [{
        star: Number,
        postedby: { type: mongoose.Types.ObjectId, ref: "User" },
    }],
},{
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);