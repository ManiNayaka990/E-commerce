const express = require("express")
const router = express.Router()

const {
    regValidation,
    loginValidation,
    orderValidation,
    customerExist
} = require("../middlewares/customer")
const {
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
    productdata,
    singleProduct,
    loginCheck,
    orderDetails,
    searchProducts
} = require("../controllers/customer")

const { authmiddleware, logOut } = require("../middlewares/loginCheck")
const upload = require("../config/seller")

router.get("/products", productdata)
router.post("/login-check", authmiddleware, customerExist, loginCheck)
router.get("/single-product/:id", authmiddleware, customerExist, singleProduct)
router.post("/customer-register", regValidation,customerRegister)
router.post("/customerLogin", loginValidation, customerLogin)
router.post("/logout", logOut)
router.post("/edit-Profile", authmiddleware, customerExist, upload.none(), editProfile)
router.post("/add-to-cart/:id", authmiddleware, customerExist, addToCart)
router.post("/add-to-wishList/:id", authmiddleware, customerExist, addToWishList)
router.delete("/delete-cart-item/:id", authmiddleware, customerExist, deleteItemCart)
router.delete("/delete-item-wishlist/:id", authmiddleware, customerExist, deleteItemwishlist)
router.post("/order-product/:id", authmiddleware, customerExist, orderValidation, orderProduct)
router.post("/review-product/:id", authmiddleware, customerExist, reviewProduct)
router.post("/cancel-order/:id", authmiddleware, customerExist, cancelOrder)
router.post("/delete-review/:id", authmiddleware, customerExist, deleteReview)

router.get("/search-products/:category/:search", searchProducts)
router.get("/order-details", authmiddleware, customerExist, orderDetails)
router.get("/order-info", authmiddleware, customerExist, orderInfo)
router.get("/profile-data", authmiddleware, customerExist, profileData)
router.get("/cart-list", authmiddleware, customerExist, cartList)
router.get("/wish-list", authmiddleware, customerExist, wishList)

router.delete("/delete-account", authmiddleware, customerExist, deleteAccount)

module.exports = router
