const bcrypt = require("bcrypt")
const Location = require("../models/location")
const Controller = require("../models/orderController")

// Check whether the logged-in user is a valid controller
// and attach the controller's location to the request.
const controllerExist = async (req, res, next) => {
    try {
        const controller = await Controller.findById(req.user.id).populate(
            "location"
        )

        if (!controller) {
            return res.status(403).json({
                success: false,
                message: "Controller does not exist",
            })
        }

        // Make the controller location available to later middleware/controllers.
        req.location = controller.location

        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Validate controller login credentials.
const loginValidation = async (req, res, next) => {
    const { username, password } = req.body

    try {
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required",
            })
        }

        const controller = await Controller.findOne({
            username: username,
        })

        if (!controller) {
            return res.status(409).json({
                success: false,
                message: "Invalid username",
            })
        }

        const isPassMatch = await bcrypt.compare(
            password,
            controller.password
        )

        if (!isPassMatch) {
            return res.status(400).json({
                success: false,
                message: "Password doesn't match",
            })
        }

        // Store the authenticated controller for the next middleware/controller.
        req.controller = controller

        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

// Validate supplier profile data before creating the supplier.
const profileDataValidator = async (req, res, next) => {
    let {
        Id,
        firstName,
        lastName,
        age,
        email,
        state,
        pincode,
        city,
        district,
        village,
        street,
        mobileNumber,
        role,
    } = req.body

    try {
        age = Number(age)

        if (!Number.isInteger(age) || age < 18 || age > 60) {
            return res.status(400).json({
                success: false,
                message: "Age must be an integer between 18 and 60",
            })
        }

        if (
            !Id ||
            !email ||
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

        // Only these three supplier roles are allowed.
        if (
            role !== "collector" &&
            role !== "localDistributor" &&
            role !== "globalDistributor"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid role",
            })
        }

        // Reuse an existing location if the same complete address already exists.
        let location = await Location.findOne({
            state: state,
            pincode: pincode,
            city: city,
            street: street,
            district: district,
            village: village,
        })

        // Create the location only when it does not already exist.
        if (!location) {
            location = new Location({
                state: state,
                pincode: pincode,
                city: city,
                street: street,
                village: village,
                district: district,
            })

            await location.save()
        }

        // Pass the location to the next middleware/controller.
        req.location = location

        next()
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    loginValidation,
    profileDataValidator,
    controllerExist,
}