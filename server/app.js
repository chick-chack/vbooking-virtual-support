const express = require("express");
const router = require("./controllers");

const app = express();

// Set Properties for express app
app.set("PORT", process.env.PORT || 7771);
app.set("HOSTNAME", process.env.HOSTNAME || "localhost");

// middlewares
app.use(router);

module.exports = app;
