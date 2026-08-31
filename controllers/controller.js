const Delivery = require("../models/delivery")
const Supplier = require("../models/supplier")
const Order = require("../models/order")
const Product = require("../models/product")

const jwt = require("jsonwebtoken")

const controllerLogin = async (req, res) => {
    const token = jwt.sign(
        { id: req.controller._id },
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
        data: req.controller,
    })
}

const addNewSupplier = async (req, res) => {
    try {
        const { Id, firstName, lastName, age, email, mobileNumber, role } =
            req.body

        const supplierExists = await Supplier.findOne({ Id: Id })

        if (supplierExists) {
            return res.status(409).json({
                success: false,
                message: "Supplier ID already exists",
            })
        }

        const newSupplier = new Supplier({
            Id: Id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            mobileNumber: mobileNumber,
            location: req.location,
            active: true,
            controller: req.user.id,
            role: role,
        })

        await newSupplier.save()

        return res.status(201).json({
            success: true,
            message: "Supplier added successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const updateSupplierStatus = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id)
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found"
            })
        }

        // Toggle supplier status between active and inactive
        supplier.active = !supplier.active

        await supplier.save()

        return res.status(200).json({
            success: true,
            message: supplier.active
                ? "Supplier activated successfully"
                : "Supplier deactivated successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const supplierList = async (req, res) => {
    try {
        const suppliers = await Supplier.find({ controller: req.user.id })

        return res.status(200).json({
            success: true,
            message:
                suppliers.length === 0
                    ? "No suppliers found"
                    : "Suppliers retrieved successfully",
            data: suppliers
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const getSuppliersByStatus = async (req, res) => {
    try {
        const status = req.params.status

        if (status !== "active" && status !== "inactive")
            return res.status(400).json({
                success: false,
                message: "Invalid supplier status",
            })

        const suppliers = await Supplier.find({
            controller: req.user.id,
            active: status === "active" ? true : false,
        })

        return res.status(200).json({
            success: true,
            message:
                suppliers.length === 0 ? "Empty List" : "The suppliers list",
            data: suppliers,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const getPendingOrders = async (req, res) => {
    try {
        const orders = await Order.aggregate([
            // Get orders from the controller's district
            {
                $match: {
                    district: req.location.district,
                },
            },

            // Attach the delivery document associated with each order
            {
                $lookup: {
                    from: "deliveries",
                    localField: "delivery",
                    foreignField: "_id",
                    as: "delivery",
                },
            },

            // Convert the delivery array into a single delivery object
            {
                $unwind: "$delivery",
            },

            // Keep only orders whose delivery is still pendig
            {
                $match: {
                    "delivery.deliveryStatus": "Pending",
                },
            },
        ])
        return res.status(200).json({
            success: true,
            message: orders.length === 0 ? "No orders yet" : "Orders",
            data: orders.length === 0 ? [] : orders,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const getLocalPendingOrders = async (req, res) => {
    try {
        // Define the date range for orders from the previous four days
        const startOfFourDaysAgo = new Date()
        startOfFourDaysAgo.setDate(startOfFourDaysAgo.getDate() - 4)
        startOfFourDaysAgo.setHours(0, 0, 0, 0)

        const startOfNextDay = new Date(startOfDay)
        startOfNextDay.setDate(startOfNextDay.getDate() + 1)
        const orders = await Order.aggregate([
            // Get orders from the controller's district within the date range
            {
                $match: {
                    district: req.location.district,
                    orderTime: {
                        $gte: startOfFourDaysAgo,
                        $lt: startOfNextDay,
                    },
                },
            },

            // Attach the customer associated with each order
            {
                $lookup: {
                    from: "customers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customer",
                },
            },

            // Convert the customer array into a single customer object
            {
                $unwind: "$customer",
            },

            // Attach the customer's Location
            {
                $lookup: {
                    from: "locations",
                    localField: "customer.location",
                    foreignField: "_id",
                    as: "location",
                },
            },

            // Convert the Location array into a single Location object
            {
                $unwind: "$location",
            },

            // Keep only orders whose customer is in the controller's district
            {
                $match: {
                    "location.district": req.location.district,
                },
            },

            // Attach the delivery associated with each order
            {
                $lookup: {
                    from: "deliveries",
                    localField: "delivery",
                    foreignField: "_id",
                    as: "delivery",
                },
            },

            // Convert the delivery array into a single delivery object
            {
                $unwind: "$delivery",
            },

            // Keep only orders with pending deliveries
            {
                $match: {
                    "delivery.deliveryStatus": "Pending",
                },
            },
        ])

        // Find active and available Local distributors managed by the controller
        const suppliers = await Supplier.find({
            controller: req.user.id,
            role: "localDistributor",
            active: true,
            available: true,
        })

        return res.status(200).json({
            success: true,
            orderMessage:
                orders.length === 0 ? "No orders found" : "Orders retrieved successfully",
            orders: orders,
            supplierMessage:
                suppliers.length === 0
                    ? "No available suppliers found"
                    : "Suppliers retrieved successfully",
            suppliers: suppliers,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const assignOrdersLocal = async (req, res) => {
    const { supplierId, orders } = req.body
    try {
        const supplier = await Supplier.findById(supplierId)

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: "Supplier not found",
            })
        }

        if (!supplier.active || !supplier.available) {
            return res.status(400).json({
                success: false,
                message: "Supplier is not available",
            })
        }

        if (!Array.isArray(orders) || orders.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select orders",
            })
        }

        const orderCount = orders.length

        const orderList = await Order.find({
            _id: { $in: orders },
        })

        if (orderCount !== orderList.length) {
            return res.status(400).json({
                success: false,
                message: "One or more orders are invalid",
            })
        }

        // Assign the selected orders to the supplier and update their delivery status
        for (const item of orders) {
            const order = await Order.findById(item).populate("delivery")
            order.delivery.supplier = supplier._id
            order.delivery.deliveryStatus = "Picked Up"
            order.delivery.deliveryTime = Date.now()

            await order.delivery.save()
        }

        supplier.totalDelivery += orderCount
        supplier.available = false

        await supplier.save()

        return res.status(200).json({
            success: true,
            message: "Orders assigned successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const newOrdersGlobal = async (req, res) => {
    try {
        const startOfYesterday = new Date()
        startOfYesterday.setDate(startOfYesterday.getDate() - 1)
        startOfYesterday.setHours(0, 0, 0, 0)

        const startOfToday = new Date()
        startOfToday.setHours(0, 0, 0, 0)
        const orders = await Order.aggregate([
            // Get yesterday's orders
            {
                $match: {
                    orderTime: {
                        $gte: startOfYesterday,
                        $lt: startOfToday,
                    },
                },
            },

            // Get the products included in each order
            {
                $lookup: {
                    from: "products",
                    localField: "products.product",
                    foreignField: "_id",
                    as: "product",
                },
            },

            // Convert the product array into individual product ducuments
            {
                $unwind: "$product",
            },

            // Only include orders for products handled by this controller's district
            {
                $match: {
                    "product.district": req.location.district,
                },
            },

            // Get the delivery associated with each order
            {
                $lookup: {
                    from: "deliveries",
                    localField: "delivery",
                    foreignField: "_id",
                    as: "delivery",
                },
            },

            // Convert the dlivery array into a single delivery object
            {
                $unwind: "$delivery",
            },

            // Only include orders that have not been assigned yet
            {
                $match: {
                    "delivery.deliveryStatus": "Pending",
                },
            },
        ])

        const suppliers = await Supplier.find({
            controller: req.user.id,
            role: "globalDistributor",
            active: true,
            available: true,
        })

        return res.status(200).json({
            success: true,
            orderMessage:
                orders.length === 0 ? "No pending orders found" : "Pending orders retrieved successfully",
            orders: orders,
            supplierMessage:
                suppliers.length === 0
                    ? "No available suppliers found"
                    : "Suppliers retrieved successfully",
            suppliers: suppliers,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const assignOrdersGlobal = async (req, res) => {
    const { supplierId, orders } = req.body
    try {
        const supplier = await Supplier.findOne({
            _id: supplierId,
            controller: req.user.id,
            role: "globalDistributor",
            active: true,
            available: true,
        })

        if (!supplier) {
            return res.status(400).json({
                success: false,
                message: "Supplier does not exist",
            })
        }

        if (!Array.isArray(orders) || orders.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select orders",
            })
        }

        const orderCount = orders.length

        const orderList = await Order.find({
            _id: { $in: orders },
        })

        if (orderCount !== orderList.length) {
            return res.status(400).json({
                success: false,
                message: "One or more orders are invalid",
            })
        }

        // Assign the selected orders to the supplier and update their delivery status
        for (const item of orders) {
            const order = await Order.findById(item).populate("delivery")
            order.delivery.supplier = supplier._id
            order.delivery.deliveryStatus = "Transfer to other point"
            order.delivery.deliveryTime = new Date(Date.now() + 24 * 60 * 60 * 1000)
            await order.delivery.save()
        }

        supplier.totalDelivery += orderCount
        supplier.available = false

        await supplier.save()

        return res.status(200).json({
            success: true,
            message: "Orders assigned successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const orderReceivedFromGlobal = async (req, res) => {
    try {
        const deliveries = await Delivery.aggregate([
            // Find deliveries transferred from global distributors
            {
                $match: {
                    deliveryStatus: "Transfer to other point",
                },
            },

            // Attach the order asociated with each delivery
            {
                $lookup: {
                    from: "orders",
                    localField: "orderId",
                    foreignField: "_id",
                    as: "order",
                },
            },

            // Convert the order array into a single order object
            {
                $unwind: "$order",
            },

            // Attach the customer associated with the order
            {
                $lookup: {
                    from: "customers",
                    localField: "order.customerId",
                    foreignField: "_id",
                    as: "customer",
                },
            },

            // Convert the customer array into a single customer object
            {
                $unwind: "$customer",
            },

            // Attach the customer's Location
            {
                $lookup: {
                    from: "locations",
                    localField: "customer.location",
                    foreignField: "_id",
                    as: "location",
                },
            },

            // Convert the Location array into a single Location object
            {
                $unwind: "$location",
            },

            // Return only deliveries for the current controller's district
            {
                $match: {
                    "location.district": req.location.district,
                },
            },
        ])

        return res.status(200).json({
            success: true,
            message:
                deliveries.length === 0
                    ? "No deliveries received"
                    : "Here is the delivery",
            data: deliveries,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const makeReceived = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id).populate(
            "orderId"
        )
        if (
            !delivery ||
            delivery.deliveryStatus !== "Transfer to other point"
        ) {
            return res.status(404).json({
                success: false,
                message: "Delivery not found or not ready to be received",
            })
        }

        // Reset the order time when the delivery is received by the Local controller
        delivery.orderId.orderTime = Date.now()
        delivery.received = true
        delivery.deliveryStatus = "Pending"
        await delivery.save()
        await delivery.orderId.save()

        return res.status(200).json({
            success: true,
            message: "Delivery received",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get the unassigned products added by sellers
const newProductsadded = async (req, res) => {
    try {
        const products = await Product.aggregate([

            // Find products that have not yet been assigned to a controller
            {
                $match: {
                    isUnderController: false,
                },
            },

            // Attach seller associated with each product
            {
                $lookup: {
                    from: "sellers",
                    localField: "seller",
                    foreignField: "_id",
                    as: "seller",
                },
            },

            // Convert the seller array into a single seller object
            {
                $unwind: "$seller",
            },

            // Keep products above the controller's collection thershold
            {
                $match: {
                    sellingProductCost: {
                        $gte: 5000,
                    },
                },
            },

            // Attach the seller's Location
            {
                $lookup: {
                    from: "locations",
                    localField: "seller.location",
                    foreignField: "_id",
                    as: "location",
                },
            },

            // Convert the Location array into a single Location object
            {
                $unwind: "$location",
            },

            // Keep products from sellers in the current controller's district
            {
                $match: {
                    "location.district": req.location.district,
                },
            },
        ])

        const collectors = await Supplier.find({
            controller: req.user.id,
            role: "collector",
            available: true,
            active: true,
        })
        return res.status(200).json({
            success: true,
            productsMessage:
                products.length === 0
                    ? "No unassigned products found"
                    : "Products retrieved successfully",
            products: products,
            collectorsMessage:
                collectors.length === 0
                    ? "No collectors available"
                    : "Collectors retrived successfully",
            collectors: collectors,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const receiveProduct = async (req, res) => {
    try {
        const { collectorId, products } = req.body

        const collector = await Supplier.findOne({
            _id: collectorId,
            controller: req.user.id,
            role: "collector",
            available: true,
            active: true,
        })

        if (!collector) {
            return res.status(400).json({
                success: false,
                message: "Collector not found or unavailable",
            })
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please select products",
            })
        }

        const productsCount = products.length

        const productList = await Product.find({
            _id: { $in: products },
        })

        if (productList.length !== productsCount) {
            return res.status(400).json({
                success: false,
                message: "One or more products are invalid",
            })
        }

        // Assign the selected products to the collector
        for (const item of products) {
            const product = await Product.findById(item)
            product.receiver = collector._id
            await product.save()
        }

        collector.available = false
        await collector.save()

        return res.status(200).json({
            success: true,
            message: "Products assigned to collector successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Get the deliveries info send by other district controller
const ordersOutforDelivery = async (req, res) => {
    try {
        const deliveries = await Delivery.aggregate([
            // Find deliveries that have been picked up by the supplier
            {
                $match: {
                    deliveryStatus: "Picked Up",
                },
            },

            // Attach the order associated with each delivery
            {
                $lookup: {
                    from: "orders",
                    localField: "orderId",
                    foreignField: "_id",
                    as: "order",
                },
            },

            // Convert the order array into a single order object        
            {
                $unwind: "$order",
            },

            // Attach the customer associated with the order
            {
                $lookup: {
                    from: "customers",
                    localField: "order.customerId",
                    foreignField: "_id",
                    as: "customer",
                },
            },

            // Convert the customer array into a single customer object
            {
                $unwind: "$customer",
            },

            // Attach the customer's Location
            {
                $lookup: {
                    from: "locations",
                    localField: "customer.location",
                    foreignField: "_id",
                    as: "location",
                },
            },

            // Convert the location array into a single location object           
            {
                $unwind: "$location",
            },

            // Keep deliveries belonging to the current controller's district
            {
                $match: {
                    "location.district": req.location.district,
                },
            },
        ])

        return res.status(200).json({
            success: true,
            message:
                deliveries.length === 0 ? "No deliveries out for delivery" : "Deliveries List",
            data: deliveries,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const updateDeliveryStatus = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id).populate(
            "supplier"
        )
        const { status, isPaid } = req.body
        if (!delivery) {
            return res.status(400).json({
                success: false,
                message: "Delivery not found",
            })
        }

        const statuses = [
            "Pending",
            "Picked Up",
            "In Transit",
            "Out for Delivery",
            "Delivered",
            "Failed",
            "Cancelled",
            "Transfer to other point",
        ]

        if (!statuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid delivery status",
            })
        }

        const previousStatus = delivery.deliveryStatus

        delivery.deliveryStatus = status

        if (isPaid !== "true" && isPaid !== "false") {
            return res.status(400).json({
                success: false,
                message: "Invalid payment Status",
            })
        }

        delivery.isPaid = isPaid === "true" ? true : false

        if (!delivery.supplier) {
            return res.status(400).json({
                success: false,
                message: "No supplier assigned to this delivery",
            })
        }
        if (status === "Delivered" && previousStatus !== "Delivered") {
            delivery.supplier.available = true
            delivery.supplier.totalDelivery += 1
        }

        await delivery.save()
        await delivery.supplier.save()

        return res.status(200).json({
            success: true,
            message: "Delivery status updated successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

const updateCollectorStatus = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.productId,
            receiver: req.params.supplierId,
        }).populate({
            path: "seller",
            populate: {
                path: "location",
            },
        })

        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product not found or not assigned to this collector",
            })
        }

        if (product.seller.location.district !== req.location.district) {
            return res.status(400).json({
                success: false,
                message: "Product is from another district",
            })
        }

        // Mark the product as received by the controller
        product.isUnderController = true

        const collector = await Supplier.findById(req.params.supplierId)

        if (!collector) {
            return res.status(400).json({
                success: false,
                message: "Collector not found",
            })
        }

        collector.available = true
        collector.totalDelivery += 1

        await product.save()
        await collector.save()

        return res.status(200).json({
            success: true,
            message: "Product received successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    controllerLogin,
    addNewSupplier,
    updateSupplierStatus,
    supplierList,
    getSuppliersByStatus,
    getPendingOrders,
    getLocalPendingOrders,
    assignOrdersLocal,
    newOrdersGlobal,
    orderReceivedFromGlobal,
    assignOrdersGlobal,
    makeReceived,
    newProductsadded,
    receiveProduct,
    ordersOutforDelivery,
    updateDeliveryStatus,
    updateCollectorStatus,
}
