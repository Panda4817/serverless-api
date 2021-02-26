"use strict"
require('dotenv').config();
const express = require("express")
const serverless = require("serverless-http")
const cors = require("cors");
const app = express()
const bodyParser = require("body-parser")
const router = express.Router()
const axios = require('axios');

router.use(cors())

app.use(bodyParser.json())
app.use("/.netlify/functions/getDoodle", router) // path must route to lambda
app.use("/", router)

router.get("/", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write('<h1>Up and running</h1>')
    res.end()
})

router.post('/', async (req, res) => {
    const { year, month } = req.query;
    const response = await axios.get(`https://www.google.com/doodles/json/${year}/${month}`)
    console.log(response.data);
    res.status(200).json(response.data[0]);
})

module.exports = app
module.exports.handler = serverless(app)