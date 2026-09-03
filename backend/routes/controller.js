const express = require("express")

const router = express.Router()

const {
    controllerLogin,
    addNewSupplier,
    updateSupplierStatus,
    supplierList,
    getLocalPendingOrders,
    newOrdersGlobal,
    assignOrdersLocal,
    orderReceivedFromGlobal,
    makeReceived,
    assignOrdersGlobal,
    newProductsadded,
    receiveProduct,
    ordersOutforDelivery,
    updateCollectorStatus,
    getSuppliersByStatus,
    getPendingOrders,
    updateDeliveryStatus,
} = require("../controllers/controller")

const {
    loginValidation,
    profileDataValidator,
    controllerExist,
} = require("../middlewares/controller")

const { logOut, authmiddleware } = require("../middlewares/loginCheck")

// Authentication
router.post("/login", loginValidation, controllerLogin)

router.post("/logout", authmiddleware, controllerExist, logOut)

// Supplier management
router.post(
    "/add-new-supplier",
    authmiddleware,
    controllerExist,
    profileDataValidator,
    addNewSupplier
)

router.post(
    "/change-supplier-status",
    authmiddleware,
    controllerExist,
    updateSupplierStatus
)

router.get("/supplier-list", authmiddleware, controllerExist, supplierList)

router.get(
    "/supplier/:status",
    authmiddleware,
    controllerExist,
    getSuppliersByStatus
)

// Order management
router.get("/new-orders", authmiddleware, controllerExist, getPendingOrders)

router.get(
    "/new-orders-local",
    authmiddleware,
    controllerExist,
    getLocalPendingOrders
)

router.get(
    "/new-orders-global",
    authmiddleware,
    controllerExist,
    newOrdersGlobal
)

router.get(
    "/orders-received-from-global",
    authmiddleware,
    controllerExist,
    orderReceivedFromGlobal
)

router.post(
    "/assign-orders-local",
    authmiddleware,
    controllerExist,
    assignOrdersLocal
)

router.post(
    "/assign-orders-global",
    authmiddleware,
    controllerExist,
    assignOrdersGlobal
)

router.post(
    "/receive-delivery",
    authmiddleware,
    controllerExist,
    makeReceived
)

// Product management
router.get(
    "/new-products",
    authmiddleware,
    controllerExist,
    newProductsadded
)

router.post(
    "/assign-products-to-collector",
    authmiddleware,
    controllerExist,
    receiveProduct
)

router.put(
    "/update-collector-status/:supplierId/:productId",
    authmiddleware,
    controllerExist,
    updateCollectorStatus
)

// Delivery management
router.put(
    "/update-delivery/:id",
    authmiddleware,
    controllerExist,
    updateDeliveryStatus
)

router.get(
    "/orders-out-for-delivery",
    authmiddleware,
    controllerExist,
    ordersOutforDelivery
)

module.exports = router