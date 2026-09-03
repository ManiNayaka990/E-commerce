
const Product = require("../models/product")
const User = require("../models/user")
const bcrypt = require("bcrypt")

// Checks whether the username or email is already registered
const regValidation = async (req, res, next) => {
    const { username, email } = req.body

    try {
        const user = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (user) {
            return res.status(402).json({
                success: false,
                message: "User already exists with email or username"
            })
        }

        next()
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// Verifies the customer's username and password during login
const loginValidation = async (req, res, next) => {
    const { username, password } = req.body

    try {
        const user = await User.findOne({ username })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            })
        }

        // Store the authenticated customer so the next middleware/controller can use it
        req.customer = user

        next()
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// Validates customer details and product stock before creating an order
const orderValidation = async (req, res, next) => {
    try {
        let { stocks } = req.body
        stocks = Number(stocks)

        // Get the customer's location to make sure all required order information is available
        const customer = await User.findById(req.user.id).populate(
            "location",
            "state pincode city street village district"
        )

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        let message = "Order successful"

        // Check whether the customer has completed the required profile information
        switch (true) {
            case !customer.firstName || !customer.lastName:
                message = "Customer name required"
                break

            case !customer.mobileNumber:
                message = "Mobile number required"
                break

            case !customer.location:
                message = "Location required"
                break

            case !customer.location.state:
                message = "State name required"
                break

            case !customer.location.pincode:
                message = "Pincode required"
                break

            case !customer.location.district:
                message = "District required"
                break

            case !customer.location.city:
                message = "City name required"
                break

            case !customer.location.street || !customer.location.village:
                message = "Street name or village name required"
                break
        }

        if (message !== "Order successful") {
            return res.status(400).json({
                success: false,
                message
            })
        }

        // Get the product and check whether the requested quantity is available
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        message = "ok"

        // Validate the requested stock quantity against the product's available stock
        switch (true) {
            case stocks === undefined ||
                stocks === null ||
                Number.isNaN(stocks):
                message = "Stock must be selected"
                break

            case stocks < 1:
                message = "At least one stock should be selected"
                break

            case product.stocks === 0:
                message = "No stocks left"
                break

            case product.stocks < stocks:
                message = `Only ${product.stocks} left`
                break
        }

        if (message !== "ok") {
            return res.status(400).json({
                success: false,
                message
            })
        }

        // Pass the validated data to the order controller
        req.customerBuy = customer
        req.stocks = stocks
        req.product = product

        next()
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    regValidation,
    loginValidation,
    orderValidation
}

