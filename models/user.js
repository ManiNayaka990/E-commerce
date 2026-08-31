const mongoose = require("mongoose")

const customer = new mongoose.Schema({
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
        unique: true,
    },
    password: {
        type: String,
        minlength: 8,
    },
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        unique: true,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
    },
    mobileNumber: Number,
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    wishList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
})

module.exports = mongoose.model("Customer", customer)
