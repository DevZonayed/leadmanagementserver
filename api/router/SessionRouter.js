const express = require("express");

// All Middlewares
const UserAuth = require("../middleware/auth/Authentication");

// All Controllers
const {
  createSession,
  getAllSession,
  terminateSession,
} = require("../controller/SessionController");
const OnlyAdmin = require("../middleware/auth/AdminMiddleware");

// All Routes
const sessionRouter = express.Router();
sessionRouter.get("/getall", UserAuth, getAllSession);
sessionRouter.post("/create", UserAuth, OnlyAdmin, createSession);
sessionRouter.post("/terminate", UserAuth, OnlyAdmin, terminateSession);

module.exports = sessionRouter;
