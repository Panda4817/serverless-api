"use strict";
require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const app = express();
const router = express.Router();
const axios = require("axios");

router.use(cors());

app.use("/.netlify/functions/getJoke", router); // path must route to lambda
app.use("/", router);

router.get("/", (req, res) => {
	res.writeHead(200, { "Content-Type": "text/html" });
	res.write("<h1>Up and running</h1>");
	res.end();
});

router.post("/", async (req, res) => {
	try {
		const response = await axios.get(
			`https://icanhazdadjoke.com/`,
			{
				headers: {
					Accept: "application/json",
				},
			}
		);
		res.status(200).json(response.data["joke"]);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

module.exports = app;
module.exports.handler = serverless(app);
