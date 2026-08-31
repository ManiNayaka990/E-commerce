const jwt = require("jsonwebtoken")

// Verify the JWT stored in the user's cookie.
const authmiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Login required",
            })
        }

        // Verify the token and attach its decoded data to the request.
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRETE_KEY
        )

        req.user = decoded

        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message,
        })
    }
}

// Remove the authentication cookie from the browser.
const logOut = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
        })

        return res.status(200).json({
            success: true,
            message: "Logout successfully...",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    authmiddleware,
    logOut,
}