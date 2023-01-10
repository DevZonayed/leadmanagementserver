const express = require("express");

// All Middlewares
const UserAuth = require("../middleware/auth/Authentication");

// All Controllers
const {
  insertOption,
  getAllSettings,
  removeOption,
} = require("../controller/SettingsController");
const OnlyAdmin = require("../middleware/auth/AdminMiddleware");

// All Routes
const SettingsRouter = express.Router();
SettingsRouter.get("/getall", UserAuth, getAllSettings);
SettingsRouter.post("/insert", UserAuth, OnlyAdmin, insertOption);
SettingsRouter.post("/pullopt", UserAuth, OnlyAdmin, removeOption);

module.exports = SettingsRouter;
