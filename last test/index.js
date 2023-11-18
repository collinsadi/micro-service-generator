const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT
const colors = require("colors")



// Use Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())






app.listen(port, () => {
    console.log("Server Started".green);
})