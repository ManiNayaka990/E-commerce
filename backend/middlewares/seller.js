const Seller = require("../models/seller")
const bcrypt = require("bcrypt")
const Category = require("../models/category")
const Product = require("../models/product")
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
    const {
        price,
        stocks,
        categoryName,
        categoryType
    } = req.body

    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Invalid Product Id",
            })
        }

        if (price !== undefined && Number(price) < 10) {
            return res.status(400).json({
                success: false,
                message: "Product price must be greater than or equal to 10 rupees",
            })
        }

        if (stocks !== undefined && Number(stocks) < 1) {
            return res.status(400).json({
                success: false,
                message: "Stocks must be at least 1",
            })
        }

        let category = await Category.findOne({
            categoryType,
            categoryName,
        })

        if (!category) {
            category = new Category({
                categoryType,
                categoryName,
            })

            await category.save()
        }

        req.category = category
        req.product = product

        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
const productValidationforAdding = async (req, res, next) => {
    const {
        price,
        stocks,
        categoryName,
        categoryType
    } = req.body

    try {

        if (price !== undefined && Number(price) < 10) {
            return res.status(400).json({
                success: false,
                message: "Product price must be greater than or equal to 10 rupees",
            })
        }

        if (stocks !== undefined && Number(stocks) < 1) {
            return res.status(400).json({
                success: false,
                message: "Stocks must be at least 1",
            })
        }

        let category = await Category.findOne({
            categoryType,
            categoryName,
        })

        if (!category) {
            category = new Category({
                categoryType,
                categoryName,
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
    productValidationforAdding,
    sellerExist,
}
