const express = require("express");

// All Middlewares
const UserAuth = require("../middleware/auth/Authentication");

// All Controllers
const { sendMail } = require("../controller/MailController");
const OnlyAdmin = require("../middleware/auth/AdminMiddleware");

// All Routes
const sessionRouter = express.Router();
sessionRouter.post("/send", UserAuth, sendMail);

module.exports = sessionRouter;
