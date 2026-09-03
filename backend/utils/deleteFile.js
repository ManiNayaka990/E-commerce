const fs = require("fs")
const path = require("path")

const deleteFile = (filePath) => {
    if (!filePath) return
    const fullPath = path.join(__dirname, "..", filePath)

    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
}
module.exports = deleteFile
