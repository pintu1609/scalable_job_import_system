const express = require("express");
const app = express();

const importData  = require("./importRoutes/importRouts");

app.use("/history", importData);

module.exports = app;