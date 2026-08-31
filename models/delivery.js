const mongoose = require("mongoose")

const deliverySchema = new mongoose.Schema({
    deliveryTime: Date,
    deliveryStatus: {
        type: String,
        enum: [
            "Pending",
            "Picked Up",
            "Transfer to other point",
            "In Transit",
            "Out for Delivery",
            "Delivered",
            "Failed",
            "Cancelled",
        ],
        default: "Pending",
    },
    received: Boolean,
    paymentMethod: String,
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
    },
    transactionId: String,
})

module.exports = mongoose.model("Delivery", deliverySchema)
