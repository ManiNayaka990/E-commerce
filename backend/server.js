const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/upload", express.static(path.join(__dirname, "upload")))


const seller = require("./routes/seller")
app.use("/api/seller", seller)

const customer = require("./routes/customer")
app.use("/api/customer", customer)

const controller = require("./routes/controller")
app.use("/api/controller", controller)

mongoose
    .connect(process.env.MONGOOSE_CONNECTION_KEY)
    .then(() => {
        console.log("mongoose connected successfully....")
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(process.env.LOCAL_HOST_CONNECTION, () => {
    console.log("connected on local host", process.env.LOCAL_HOST_CONNECTION)
})
