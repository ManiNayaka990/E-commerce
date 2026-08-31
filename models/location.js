const mongoose = require("mongoose")

const locationSchema = new mongoose.Schema({
    state: String,
    pincode: Number,
    district: String,
    city: String,
    street: String,
    village: String,
    liveLocation: String,
})

module.exports = mongoose.model("Location", locationSchema)
