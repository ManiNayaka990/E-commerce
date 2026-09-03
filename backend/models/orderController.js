const mongoose = require("mongoose")

const controllerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        maxlength: 30,
        required: true,
    },
    lastName: {
        type: String,
        maxlength: 30,
    },
    age: {
        type: Number,
        min: 12,
        required: true,
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
        match: /^\S+@\S+\.\S+$/,
        unique: true,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
    },
    mobileNumber: Number,
})

module.exports = mongoose.model("OrderController", controllerSchema)
