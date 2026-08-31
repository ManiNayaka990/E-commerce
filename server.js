const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
require("dotenv").config()
app.use("/uploads", express.static("uploads"))

const seller = require("./routes/seller")
app.use("/seller", seller)

const customer = require("./routes/customer")
app.use("/customer", customer)

const controller = require("./routes/controller")
app.use("/controller", controller)

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
