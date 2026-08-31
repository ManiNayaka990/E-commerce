const express = require("express")
const router = express.Router()

const {
    sellerRegValidation,
    sellerLogValidation,
    productValidation,
    sellerExist,
} = require("../middlewares/seller")

const { authmiddleware, logOut } = require("../middlewares/loginCheck")

const {
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
} = require("../controllers/seller")

const upload = require("../config/seller")

router.get("/", authmiddleware, sellerProducts)
router.post("/register", sellerRegValidation, sellerRegister)

router.post("/login", sellerLogValidation, sellerLogin)

router.post(
    "/add-profile-info",
    authmiddleware,
    sellerExist,
    upload.fields([
        {
            name: "profile-photo",
            maxCount: 1,
        },
        {
            name: "qrcode-photo",
            maxCount: 1,
        },
    ]),
    updateSellerProfile
)

router.post(
    "/add-product",
    authmiddleware,
    sellerExist,
    upload.array("product-photos", 10),
    productValidation,
    addProducts
)

router.get("/edit-profile-req", authmiddleware, sellerExist, editProfileData)

router.put(
    "/edit-profile",
    authmiddleware,
    sellerExist,
    upload.fields([
        {
            name: "profile-photo",
            maxCount: 1,
        },
        {
            name: "qrcode-photo",
            maxCount: 1,
        },
    ]),
    updateSellerProfile
)

router.get("/productData/:id", authmiddleware, sellerExist, productData)

router.put(
    "/updateProduct",
    authmiddleware,
    sellerExist,
    upload.array("product-photos", 10),
    productValidation,
    updateProduct
)

router.post("/logout", authmiddleware, sellerExist, logOut)

router.delete("/delete-product", authmiddleware, sellerExist, deleteProduct)

router.delete("/delete-seller", authmiddleware, sellerExist, deleteSeller)
module.exports = router
