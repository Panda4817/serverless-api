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
app.use("/.netlify/functions/getComic", router) // path must route to lambda
app.use("/", router)

router.get("/", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write('<h1>Up and running</h1>')
    res.end()
})

router.post('/', async (req, res) => {
    const { num } = req.query;
    try {
        if (!num || num == "" || num == " " || num == "latest") {
            const response = await axios.get(`https://xkcd.com/info.0.json`);
            res.status(200).json(response.data);
        } else {
            const response = await axios.get(`https://xkcd.com/${num}/info.0.json`);
            res.status(200).json(response.data);
        }
    } catch (err) {
        res.status(400).json({ 'error': err.message });
    }

})

module.exports = app
module.exports.handler = serverless(app)