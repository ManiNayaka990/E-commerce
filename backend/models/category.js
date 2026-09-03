const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    categoryType: String,
    categoryName: String,
})
module.exports = mongoose.model("Category", categorySchema)
