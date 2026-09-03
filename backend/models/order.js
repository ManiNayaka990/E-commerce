const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        default: null,
    },
    district: String,
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],
    orderTime: {
        type: Date,
        default: Date.now(),
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery",
    },
    orderStatus: Boolean,
})

module.exports = mongoose.model("Order", orderSchema)
