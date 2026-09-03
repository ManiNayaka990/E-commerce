const mongoose = require("mongoose")

const sellerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxlength: 30,
    },
    lastName: {
        type: String,
        maxlength: 30,
    },
    age: {
        type: Number,
        min: 12,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
    },
    mobileNumber: {
        type: String,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    totalAmount: {
        type: Number,
        default: 0,
    },

    sellingProductCost: {
        type: Number,
        default: 0,
    },
    qrCodeImg: String,
    profilePhoto: String,
})

module.exports = mongoose.model("Seller", sellerSchema)
