const Seller = require("../models/seller")
const bcrypt = require("bcrypt")
const Category = require("../models/category")

const sellerExist = async (req, res, next) => {
    try {
        const seller = await Seller.findById(req.user.id)
        if (!seller) {
            return res.status(403).json({
                success: false,
                message: "Seller does not exist",
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const sellerRegValidation = async (req, res, next) => {
    const { username, email } = req.body
    try {
        const existSeller = await Seller.findOne({
            $or: [{ username }, { email }],
        })

        if (existSeller) {
            return res.status(409).json({
                success: false,
                message: "Seller already exist",
            })
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const sellerLogValidation = async (req, res, next) => {
    const { username, password } = req.body
    try {
        const existSeller = await Seller.findOne({
            username: username,
        }).populate("location")
        if (!existSeller) {
            return res.status(404).json({
                success: false,
                message: "Username does not existed",
            })
        }
        const isPasswordMatch = await bcrypt.compare(
            password,
            existSeller.password
        )
        if (!isPasswordMatch) {
            return res.status(404).json({
                success: false,
                message: "Password does not match",
            })
        }
        req.seller = existSeller
        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const productValidation = async (req, res, next) => {
    const { price, stocks, categoryName, categoryType } = req.body
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Require photos",
            })
        }
        if (Number(price) < 10) {
            return res.status(400).json({
                success: false,
                message: "Product price must greater than or equal to 10rup",
            })
        }
        if (Number(stocks) < 1) {
            return res.status(400).json({
                success: false,
                message: "stocks must be atleast 1",
            })
        }
        let category = await Category.findOne({ categoryType })
        if (!category) {
            category = new Category({
                categoryType: categoryType,
                categoryName: categoryName,
            })
            await category.save()
        }
        req.category = category

        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
module.exports = {
    sellerRegValidation,
    sellerLogValidation,
    productValidation,
    sellerExist,
}
