const mongoose = require("mongoose")

const reviewScheama = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    rating: Number,
    comment: [
        {
            type: String,
        },
    ],
})
module.exports = mongoose.model("Review", reviewScheama)
