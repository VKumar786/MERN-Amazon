const mongoose = require('mongoose'); 

var orderSchema = new mongoose.Schema({
    produts: [
        {
            product: {
                type: mongoose.Types.ObjectId,
                ref: "Product"
            },
            count: Number,
            color: String,
        },
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not processed",
        enum: ["Not processed", "Cash on Delivery", "Processing", "Dispatched", "Cancelled", "Delivered"],
    },
    orderby: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);