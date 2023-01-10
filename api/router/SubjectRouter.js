const express = require("express");

// All Middlewares
const UserAuth = require("../middleware/auth/Authentication");

// All Controllers
const {
  createSubject,
  getAllSubjects,
  terminateSubject,
} = require("../controller/SubjectController");
const OnlyAdmin = require("../middleware/auth/AdminMiddleware");

// All Routes
const subjectRouter = express.Router();
subjectRouter.get("/getall", UserAuth, getAllSubjects);
subjectRouter.post("/create", UserAuth, OnlyAdmin, createSubject);
subjectRouter.post("/terminate", UserAuth, OnlyAdmin, terminateSubject);

module.exports = subjectRouter;
