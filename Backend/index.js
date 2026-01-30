const http = require("http");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./api/middleware/db.js");

const routes = require("./api/route/index.js");
const { useErrorHandler } = require("./api/middleware/error-handler.js");
const {startCron} = require("./api/helper/cron/index.js");
const {startWorker} = require("./api/helper/worker/worker.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/", routes);

const server = http.createServer(app);
const portNumber = process.env.PORT || 5000;

app.use(useErrorHandler);

(async () => {
  try {
    await db.connectToDatabase();
    console.log("✅ MongoDB connected");

    startCron();

    startWorker();

    server.listen(portNumber, () => {
      console.log(`Server running on port ${portNumber}`);
    });

  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
})();
