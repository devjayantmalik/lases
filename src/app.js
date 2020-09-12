const express = require("express");
const bodyParser = require("body-parser");
const routers = require("./routers");
const config = require("./config");
const { errors } = require("celebrate");
const cors = require("cors");
const helmet = require("helmet");
const io = require("socket.io");
const http = require("http");

// Connect to database
require("./config/db")();

const app = express();

// Configure Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

// Setup api routes
app.use("/api", routers());

// Configure 404 Routes
app.use((req, res, next) => {
  return res.status(400).json({ message: "Not Found!" });
});

/**
 * Handle Celebrate Requests
 */
app.use(errors());

/**
 * Error Handler for app
 */
app.use((err, req, res, next) => {
  return res
    .status(err.status || 500)
    .json({ name: err.name, message: err.message, status: err.status })
    .end();
});

// Initialize socket io instance
const server = http.createServer(app);
const socket = io(server);

socket.on("connection", (client) => {
  setInterval(() => {
    client.emit("progress", "Testing...");
  }, 1000);
});

app.listen(config.port, () => {
  console.log(`Server started at: http://0.0.0.0:${config.port}`);
});

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});
