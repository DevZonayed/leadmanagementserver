const express = require("express");

// All Middlewares
const UserAuth = require("../middleware/auth/Authentication");

// All Controllers
const { getAgentDashBord } = require("../controller/dashbordController");
const OnlyAdmin = require("../middleware/auth/AdminMiddleware");

// All Routes
const sessionRouter = express.Router();
sessionRouter.post("/agent", UserAuth, getAgentDashBord);

module.exports = sessionRouter;
