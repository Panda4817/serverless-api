"use strict"
require('dotenv').config();
const express = require("express")
const serverless = require("serverless-http")
const cors = require("cors");
const app = express()
const bodyParser = require("body-parser")
const router = express.Router()
const axios = require('axios');
const api_key = process.env.API;

router.use(cors())

app.use(bodyParser.json())
app.use("/.netlify/functions/getNews", router) // path must route to lambda
app.use("/", router)

router.get("/", (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write('<h1>Up and running</h1>')
    res.end()
})

router.post('/', async (req, res) => {
    const { code } = req.query;
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=${code.toLowerCase()}&apiKey=${api_key}`);
    const headlines = response.data.articles.map((item) => {
        return {
            'title': item.title,
            'url': item.url
        }
    });
    res.status(200).json(headlines);
    
})

module.exports = app
module.exports.handler = serverless(app)