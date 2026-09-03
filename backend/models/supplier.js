const mongoose = require("mongoose")

const supplierSchema = new mongoose.Schema({
    Id: String,
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
    email: {
        type: String,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
    },
    controller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderController",
    },
    mobileNumber: {
        type: String,
        required: true,
    },
    totalDelivery: {
        type: Number,
        default: 0,
    },
    role: String,
    available: Boolean,
    active: Boolean,
})

module.exports = mongoose.model("Supplier", supplierSchema)
