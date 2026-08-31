const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    district: String,
    pName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: String,

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    stocks: {
        type: Number,
        required: true,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
    },

    photos: {
        type: [String],
        default: [],
        validate: [
            {
                validator: function (photos) {
                    return photos.length <= 10
                },
                message: "Maximum 10 photos allowed.",
            },
        ],
    },

    isUnderController: {
        type: Boolean,
        default: false,
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
    },
})

module.exports = mongoose.model("Product", productSchema)
