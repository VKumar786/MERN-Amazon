const mongoose = require('mongoose');

let blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numViews: {
        type: Number,
        default: 0,
    },
    isLiked: {
        type: Boolean,
        default: false,
    },
    isDisliked: {
        type: Boolean,
        default: false,
    },
    likes: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    dislikes: [{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }],
    image: {
        type: String,
        default: 'https://www.codeur.com/blog/wp-content/uploads/2021/03/image-tendance-blogging-1.jpg.webp'
    },
    author: {
        type: String,
        default: "Admin"
    }
}, {
    toJSON: { //? searlize and desearlize data with their properties
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true,
});

module.exports = mongoose.model('Blog', blogSchema);