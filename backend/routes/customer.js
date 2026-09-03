const express = require("express")
const router = express.Router()

const {
    regValidation,
    loginValidation,
    orderValidation,
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
} = require("../controllers/customer")

const { authmiddleware, logOut } = require("../middlewares/loginCheck")

router.post("/customer-register", regValidation, customerRegister)
router.post("/customerLogin", loginValidation, customerLogin)
router.post("/logout", authmiddleware, logOut)
router.post("/edit-Profile", authmiddleware, editProfile)
router.post("/add-to-cart/:id", authmiddleware, addToCart)
router.post("/add-to-wishList/:id", authmiddleware, addToWishList)
router.post("/delete-cart-item/:id", authmiddleware, deleteItemCart)
router.post("/delete-item-wishlist/:id", authmiddleware, deleteItemwishlist)
router.post("/order-product/:id", authmiddleware, orderValidation, orderProduct)
router.post("/review-product/:id", authmiddleware, reviewProduct)
router.post("/cancel-order/:id", authmiddleware, cancelOrder)
router.post("/delete-review/:id", authmiddleware, deleteReview)

router.get("/order-info", authmiddleware, orderInfo)
router.get("/edit-Profile", authmiddleware, profileData)
router.get("/cart-list", authmiddleware, cartList)
router.get("/wish-list", authmiddleware, wishList)

router.delete("/delete-account", authmiddleware, deleteAccount)

module.exports = router
