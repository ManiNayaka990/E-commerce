const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Location = require("../models/location")
const Order = require("../models/order")
const Product = require("../models/product")
const Review = require("../models/review")
const Delivery = require("../models/delivery")

// Register a new customer.
const customerRegister = async (req, res) => {
    const { username, password, email } = req.body

    try {
        // Hash the password before storing it in the database.
        const hashPassword = await bcrypt.hash(password, 10)

        const user = new User({
            username: username,
            password: hashPassword,
            email: email,
        })

        await user.save()

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Authenticate the customer and create a JWT.
const customerLogin = async (req, res) => {
    try {
        const customer = req.customer

        const token = jwt.sign(
            { id: customer._id },
            process.env.JWT_SECRETE_KEY,
            { expiresIn: "1d" }
        )

        // Store the JWT in an HTTP-only cookie.
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            success: true,
            message: "Login successful",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Add or update the customer's profile and location.
const editProfile = async (req, res) => {
    try {
        let {
            firstName,
            lastName,
            age,
            mobileNumber,
            state,
            pincode,
            city,
            street,
            village,
            district,
        } = req.body

        age = Number(age)

        // Validate that age is an integer within the allowed range.
        if (!Number.isInteger(age) || age < 12 || age > 135) {
            return res.status(400).json({
                success: false,
                message: "Age must be a valid number",
            })
        }

        if (
            !firstName ||
            !lastName ||
            !mobileNumber ||
            !state ||
            !pincode ||
            !city ||
            !street ||
            !village ||
            !district
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required field",
            })
        }

        const customer = await User.findById(req.user.id)

        if (!customer) {
            return res.status(400).json({
                success: false,
                message: "Customer info not found",
                data: null,
            })
        }

        customer.firstName = firstName
        customer.lastName = lastName
        customer.age = age
        customer.mobileNumber = mobileNumber

        // Reuse an existing location when the same address already exists.
        let location = await Location.findOne({
            state: state,
            pincode: pincode,
            city: city,
            street: street,
            district: district,
            village: village,
        })

        // Create a new location when no matching location exists.
        if (!location) {
            location = new Location({
                state: state,
                pincode: pincode,
                city: city,
                street: street,
                district: district,
                village: village,
            })

            await location.save()
        }

        customer.location = location._id

        await customer.save()

        return res.status(200).json({
            success: true,
            message: "Profile info added successfully",
            data: customer,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Return the logged-in customer's profile.
const profileData = async (req, res) => {
    try {
        const customer = await User.findById(req.user.id)

        if (customer) {
            return res.status(200).json({
                success: true,
                message: "Customer data found",
                data: customer,
            })
        }

        return res.status(404).json({
            success: false,
            message: "Customer info not found",
            data: null,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Add a product to the customer's cart.
const addToCart = async (req, res) => {
    try {
        const customer = await User.findById(req.user.id)
        const product = await Product.findById(req.params.id)

        if (!customer) {
            return res.status(400).json({
                success: false,
                message: "Invalid user",
            })
        }

        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Invalid product",
            })
        }

        // Prevent the same product from being added twice.
        const item = customer.cart.find(
            (item) => item.toString() === product._id.toString()
        )

        if (item) {
            return res.status(400).json({
                success: false,
                message: "Product already in cart",
            })
        }

        customer.cart.push(product._id)

        await customer.save()

        return res.status(201).json({
            success: true,
            message: "Product added to cart successfully",
            data: customer,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Add a product to the customer's wishlist.
const addToWishList = async (req, res) => {
    try {
        const customer = await User.findById(req.user.id)
        const product = await Product.findById(req.params.id)

        if (!customer) {
            return res.status(400).json({
                success: false,
                message: "Invalid user",
            })
        }

        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Invalid product",
            })
        }

        // Prevent duplicate wishlist entries.
        const item = customer.wishList.find(
            (item) => item.toString() === product._id.toString()
        )

        if (item) {
            return res.status(400).json({
                success: false,
                message: "Product already exists in wishlist",
            })
        }

        customer.wishList.push(product._id)

        await customer.save()

        return res.status(201).json({
            success: true,
            message: "Product added to wishlist successfully",
            data: customer,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Return all products currently in the customer's cart.
const cartList = async (req, res) => {
    try {
        const customer = await User.findById(req.user.id).populate("cart")

        if (!customer) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                data: null,
            })
        }

        if (customer.cart.length === 0) {
            return res.status(200).json({
                success: true,
                message: "You have not added any product yet",
                data: [],
            })
        }

        return res.status(200).json({
            success: true,
            message: "Cart list found",
            data: customer.cart,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Return all products currently in the customer's wishlist.
const wishList = async (req, res) => {
    try {
        const customer = await User.findById(req.user.id).populate("wishList")

        if (!customer) {
            return res.status(400).json({
                success: false,
                message: "Can't find user",
            })
        }

        if (customer.wishList.length === 0) {
            return res.status(200).json({
                success: true,
                message: "You have not added any product yet",
                data: [],
            })
        }

        return res.status(200).json({
            success: true,
            message: "Wishlist found",
            data: customer.wishList,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Remove a product from the customer's cart.
const deleteItemCart = async (req, res) => {
    try {
        const customer = await User.findById(req.user.id)

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            })
        }

        if (customer.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Empty cart",
            })
        }

        const index = customer.cart.findIndex(
            (item) => item.toString() === req.params.id
        )

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found",
            })
        }

        customer.cart.splice(index, 1)

        await customer.save()

        return res.status(200).json({
            success: true,
            message: "Item deleted successfully",
            data: customer.cart,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Remove a product from the customer's wishlist.
const deleteItemwishlist = async (req, res) => {
    try {
        const customer = await User.findById(req.user.id)

        if (!customer) {
            return res.status(400).json({
                success: false,
                message: "Customer not found",
            })
        }

        if (customer.wishList.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Empty wishlist",
            })
        }

        const index = customer.wishList.findIndex(
            (item) => item.toString() === req.params.id
        )

        if (index === -1) {
            return res.status(400).json({
                success: false,
                message: "Item not found",
            })
        }

        customer.wishList.splice(index, 1)

        await customer.save()

        return res.status(200).json({
            success: true,
            message: "Item deleted successfully",
            data: customer.wishList,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Return the payment methods supported by the application.
const orderInfo = (req, res) => {
    return res.json({
        paymentTypes: [
            "Cash on delivery",
            "UPI",
            "Card",
            "Internet Banking",
        ],
    })
}

// Create an order and its corresponding delivery record.
const orderProduct = async (req, res) => {
    try {
        const customer = req.customerBuy

        const { paymentMethod } = req.body

        const paymentTypes = [
            "Cash on delivery",
            "UPI",
            "Card",
            "Internet Banking",
        ]

        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Payment method is required",
            })
        }

        if (!paymentTypes.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method",
            })
        }

        const order = new Order({
            customerId: customer._id,
            products: [
                {
                    product: req.product._id,
                    quantity: req.stocks,
                },
            ],
            orderStatus: true,
            orderTime: Date.now(),

            // The controller uses the product's district to route the order.
            district: req.product.district,
        })

        // Reduce the available stock after the order is created.
        req.product.stocks -= req.stocks
        await req.product.save()

        const deliveryDate = new Date()
        deliveryDate.setDate(deliveryDate.getDate() + 5)

        const delivery = new Delivery({
            orderId: order._id,
            deliveryTime: deliveryDate,
            paymentMethod: paymentMethod,
        })

        await order.save()
        await delivery.save()

        return res.status(201).json({
            success: true,
            message: "Order confirmed",
            orderData: order,
            deliveryData: delivery,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Add or update a customer's review for a product.
const reviewProduct = async (req, res) => {
    try {
        let { rating, comment } = req.body

        const product = await Product.findById(req.params.id)
        const customer = await User.findById(req.user.id)

        if (!product || !customer) {
            return res.status(400).json({
                success: false,
                message: "Product or customer is invalid",
            })
        }

        if (rating !== undefined) {
            rating = Number(rating)

            if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                return res.status(400).json({
                    success: false,
                    message: "Rating must be between 1 and 5",
                })
            }
        }

        if (rating === undefined && !comment) {
            return res.status(400).json({
                success: false,
                message: "Rating or comment is required",
            })
        }

        // Find an existing review so the customer can update it.
        const review = await Review.findOne({
            customerId: customer._id,
            productId: product._id,
        })

        let newReview = review

        if (!review) {
            newReview = new Review({
                productId: product._id,
                customerId: customer._id,
            })
        }

        if (rating !== undefined) {
            newReview.rating = rating
        }

        if (comment) {
            newReview.comment.push(comment)
        }

        await newReview.save()

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            data: newReview,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Cancel an order and return its products to available stock.
const cancelOrder = async (req, res) => {
    try {
        const customer = await User.findById(req.user.id)

        if (!customer) {
            return res.status(400).json({
                success: false,
                message: "Invalid User",
            })
        }

        const order = await Order.findOne({
            customerId: customer._id,
            _id: req.params.id,
        }).populate("products.product")

        if (!order) {
            return res.status(400).json({
                success: false,
                message: "Invalid order",
            })
        }

        if (order.orderStatus === false) {
            return res.status(400).json({
                success: false,
                message: "Your order is already cancelled",
            })
        }

        const twoDays = 2 * 24 * 60 * 60 * 1000
        const date = Date.now()

        if (date - order.orderTime > twoDays) {
            return res.status(400).json({
                success: false,
                message: "Date for cancellation has expired",
            })
        }

        order.orderStatus = false

        // Restore stock for every product in the order.
        for (const item of order.products) {
            item.product.stocks += item.quantity
            await item.product.save()
        }

        await Delivery.findOneAndDelete({
            orderId: order._id,
        })

        await order.save()

        return res.status(200).json({
            success: true,
            data: order,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Delete a customer's review.
const deleteReview = async (req, res) => {
    try {
        const customer = await User.findById(req.user.id)

        if (!customer) {
            return res.status(400).json({
                success: false,
                message: "Invalid User",
            })
        }

        const review = await Review.findOneAndDelete({
            customerId: customer._id,
            _id: req.params.id,
        })

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: review,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Delete the customer account only when there are no active orders.
const deleteAccount = async (req, res) => {
    try {
        const customer = await User.findById(req.user.id)

        if (!customer) {
            return res.status(400).json({
                success: false,
                message: "Invalid user",
            })
        }

        const order = await Order.find({
            customerId: customer._id,
            orderStatus: true,
        })

        if (order.length !== 0) {
            return res.status(400).json({
                success: false,
                message: "Before deleting your account, receive or cancel your orders",
            })
        }

        // Keep historical orders but remove the reference to the deleted customer.
        await Order.updateMany(
            { customerId: customer._id },
            { $set: { customerId: null } }
        )

        await Review.deleteMany({
            customerId: customer._id,
        })

        await User.findOneAndDelete({
            _id: customer._id,
        })

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
        })

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    customerRegister,
    customerLogin,
    editProfile,
    profileData,
    addToCart,
    addToWishList,
    cartList,
    wishList,
    deleteItemCart,
    deleteItemwishlist,
    orderInfo,
    orderProduct,
    reviewProduct,
    cancelOrder,
    deleteReview,
    deleteAccount,
}