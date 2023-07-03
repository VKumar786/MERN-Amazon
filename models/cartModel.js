const mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Product"
            },
            count: Number,
            color: String,
            price: Number,
        },
    ],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderby: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);