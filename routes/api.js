const express = require("express");
const wordCounterRouter = require("./wordCounter");

const app = express();

app.use("/word-count/", wordCounterRouter);

module.exports = app;