const Seller = require("../models/seller")
const Location = require("../models/location")
const Product = require("../models/product")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Category = require("../models/category")
const deleteFile = require("../utils/deleteFile")

// Register a new seller account.
const sellerRegister = async (req, res) => {
    const { username, email, password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const seller = new Seller({
            username,
            email,
            password: hashedPassword,
        })

        await seller.save()

        return res.status(201).json({
            success: true,
            message: "Seller registered successfully",
            data: seller,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Create a JWT and log the seller in.
const sellerLogin = async (req, res) => {
    try {
        const seller = req.seller

        const token = jwt.sign(
            { id: seller._id },
            process.env.JWT_SECRETE_KEY,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: seller,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Update seller profile information and profile images.
const updateSellerProfile = async (req, res) => {
    try {
        const {
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

        const seller = await Seller.findById(req.user.id)

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found",
            })
        }

        // -----------------------------
        // 1. Update text/profile fields
        // -----------------------------

        if (firstName !== undefined) {
            seller.firstName = firstName
        }

        if (lastName !== undefined) {
            seller.lastName = lastName
        }

        if (age !== undefined) {
            seller.age = age
        }

        if (mobileNumber !== undefined) {
            seller.mobileNumber = mobileNumber
        }

        // -----------------------------
        // 2. Update profile photo
        // -----------------------------

        if (req.files && req.files["profile-photo"]) {

            // Delete old profile photo
            if (seller.profilePhoto) {
                deleteFile(seller.profilePhoto)
            }

            seller.profilePhoto =
                `/upload/sellerProfile/${req.files["profile-photo"][0].filename}`
        }

        // -----------------------------
        // 3. Update QR code
        // -----------------------------

        if (req.files && req.files["qrcode-photo"]) {

            // Delete old QR code
            if (seller.qrCodeImg) {
                deleteFile(seller.qrCodeImg)
            }

            seller.qrCodeImg =
                `/upload/qrcode/${req.files["qrcode-photo"][0].filename}`
        }

        // -----------------------------
        // 4. Update location
        // -----------------------------

        // Only update location if location data was sent
        if (
            state !== undefined ||
            pincode !== undefined ||
            city !== undefined ||
            street !== undefined ||
            village !== undefined ||
            district !== undefined
        ) {

            let location = await Location.findOne({
                state,
                pincode,
                city,
                street,
                village,
                district,
            })

            // Create location if it doesn't already exist
            if (!location) {
                location = new Location({
                    state,
                    pincode,
                    city,
                    street,
                    village,
                    district,
                })

                await location.save()
            }

            seller.location = location._id
        }

        // -----------------------------
        // 5. Save seller
        // -----------------------------

        await seller.save()

        // Populate location before sending response
        await seller.populate("location")

        return res.status(200).json({
            success: true,
            message: "Profile information updated successfully",
            data: seller,
        })

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Add a new product for the logged-in seller.
const addProducts = async (req, res) => {
    const { pName, price, description, stocks } = req.body

    try {
        const seller = await Seller.findById(req.user.id)

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found",
            })
        }

        const photos = req.files.map((file) => {
            return `/upload/products/${file.filename}`
        })

        const product = new Product({
            pName,
            price,
            description,
            stocks,
            category: req.category._id,
            seller: seller._id,
            photos,
            district: seller.location?.district,
        })

        // Increase the seller's total value of products.
        seller.sellingProductCost += Number(price) * Number(stocks)

        await product.save()
        await seller.save()

        return res.status(201).json({
            success: true,
            message: "Product information added successfully",
            data: product,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get the logged-in seller's profile information.
const editProfileData = async (req, res) => {
    const sellerId = req.user.id

    try {
        const seller = await Seller.findById(sellerId).populate("location")

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Seller information found",
            data: seller,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Find a product belonging to the logged-in seller.
const productData = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            seller: req.user.id,
        }).populate("category").populate({path: "reviews",
            populate: {
                path: "customerId"
            }
        })

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }

        req.product = product

        return res.status(200).json({
            success: true,
            message: "Product found",
            data: product,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Update an existing product.
const updateProduct = async (req, res) => {
    const {
        pName,
        price,
        description,
        stocks
    } = req.body

    try {
        const product = req.product

        const seller = await Seller.findById(req.user.id)
            .populate("location")

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found",
            })
        }

        if (!seller.location) {
            return res.status(400).json({
                success: false,
                message: "Seller location not found",
            })
        }

        // Replace existing photos only when new photos are uploaded
        if (req.files && req.files.length > 0) {
            if (product.photos && product.photos.length > 0) {
                product.photos.forEach((photo) => {
                    deleteFile(photo)
                })
            }

            product.photos = req.files.map((file) => {
                return `/upload/products/${file.filename}`
            })
        }

        // Update product fields
        if (pName !== undefined) {
            product.pName = pName
        }

        if (price !== undefined) {
            product.price = price
        }

        if (description !== undefined) {
            product.description = description
        }

        if (stocks !== undefined) {
            product.stocks = stocks
        }
        const category = await Category.findById(req.category._id)
        if(!category){
            return res.status(400).json({
                success: false,
                message: "Invalid category"
            })
        }
        // Update category and district
        product.category = category._id
        product.district = seller.location.district
        await product.save()

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Delete a product and its stored images.
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            seller: req.user.id,
        })

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            })
        }

        if (product.photos && product.photos.length > 0) {
            product.photos.forEach((photo) => {
                deleteFile(photo)
            })
        }

        await Product.findByIdAndDelete(product._id)

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Delete the seller account and all products belonging to the seller.
const deleteSeller = async (req, res) => {
    try {
        const seller = await Seller.findById(req.user.id)

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found",
            })
        }

        // Delete seller profile images.
        if (seller.profilePhoto) {
            deleteFile(seller.profilePhoto)
        }

        if (seller.qrCodeImg) {
            deleteFile(seller.qrCodeImg)
        }

        const products = await Product.find({
            seller: seller._id,
        })

        // Delete all images belonging to the seller's products.
        for (const product of products) {
            if (product.photos && product.photos.length > 0) {
                product.photos.forEach((photo) => {
                    deleteFile(photo)
                })
            }
        }

        await Product.deleteMany({
            seller: seller._id,
        })

        await Seller.findByIdAndDelete(seller._id)

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
        })

        return res.status(200).json({
            success: true,
            message: "Seller deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get all products belonging to the logged-in seller.
const sellerProducts = async (req, res) => {
    try {
        const products = await Product.find({
            seller: req.user.id,
        }).populate("category").populate({path: "reviews",
            populate: {
                path: "customerId"
            }
        })
        if (products.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No products added yet",
            })
        }

        return res.status(200).json({
            success: true,
            message: "These are your products",
            data: products,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    sellerRegister,
    sellerLogin,
    updateSellerProfile,
    addProducts,
    editProfileData,
    productData,
    updateProduct,
    deleteProduct,
    deleteSeller,
    sellerProducts,
}