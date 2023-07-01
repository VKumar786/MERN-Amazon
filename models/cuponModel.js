const mongoose = require('mongoose');

var cuponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Cupon', cuponSchema);