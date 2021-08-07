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
					"User-Agent":
						"My Serverless API for xkcd chrome extension (https://github.com/Panda4817/serverless-api)",
				},
			}
		);
		res
			.status(response.data["status"])
			.json(response.data["joke"]);
	} catch (err) {
		res
			.status(err.response.status)
			.json({ error: err.response.statusText });
	}
});

module.exports = app;
module.exports.handler = serverless(app);
