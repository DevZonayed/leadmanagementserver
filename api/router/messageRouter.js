const express = require("express");

// All Middlewares
const UserAuth = require("../middleware/auth/Authentication");

// All Controllers
const { sendMessage } = require("../controller/MessageController");
const OnlyAdmin = require("../middleware/auth/AdminMiddleware");

// All Routes
const sessionRouter = express.Router();
sessionRouter.post("/send", UserAuth, sendMessage);

module.exports = sessionRouter;
