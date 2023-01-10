const express = require("express");
const {
  createTemplate,
  getAllTemplate,
  editTemplate,
} = require("../controller/EmailTemplateController");
const OnlyAdmin = require("../middleware/auth/AdminMiddleware");

// All Middlewares
const UserAuth = require("../middleware/auth/Authentication");

// All Controllers

// All Routes
const emailTemplate = express.Router();
emailTemplate.get("/getall", UserAuth, OnlyAdmin, getAllTemplate);
emailTemplate.post("/create", UserAuth, OnlyAdmin, createTemplate);
emailTemplate.post("/edit", UserAuth, OnlyAdmin, editTemplate);
// emailTemplate.post("/terminate", UserAuth, terminateSession);

module.exports = emailTemplate;
