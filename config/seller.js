const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profile-photo") {
            cb(null, path.join(__dirname, "..", "upload", "sellerProfile"))
        } else if (file.fieldname === "qrcode-photo") {
            cb(null, path.join(__dirname, "..", "upload", "qrcode"))
        } else if (file.fieldname === "product-photos") {
            cb(null, path.join(__dirname, "..", "upload", "products"))
        } else {
            cb(new Error("Invalid file field"))
        }
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const upload = multer({
    storage: storage,
})

module.exports = upload
