const express = require("express");

// All Middlewares
const UserAuth = require("../middleware/auth/Authentication");

// All Controllers
const {
  handleBulkEntry,
  getAllBulkEntryReport,
  getAllLead,
  handleLeadUpdate,
  getLeadByIds,
  assignAgenet,
  getLeadByAgent,
} = require("../controller/LeadController");
const OnlyAdmin = require("../middleware/auth/AdminMiddleware");

// All Routes
const LeadRouter = express.Router();
// LeadRouter.post("/deletefromids", handleLeadDeletebyId);
LeadRouter.post("/bulkentry", UserAuth, OnlyAdmin, handleBulkEntry);
LeadRouter.post("/updatelead", UserAuth, handleLeadUpdate);
LeadRouter.post("/assignagent", UserAuth, OnlyAdmin, assignAgenet);
LeadRouter.post("/getleadforagent", UserAuth, getLeadByAgent);
LeadRouter.post("/getleadsbyid", UserAuth, getLeadByIds);
LeadRouter.get("/getalllead", UserAuth, getAllLead);
LeadRouter.get("/getallbulkentry", UserAuth, OnlyAdmin, getAllBulkEntryReport);

module.exports = LeadRouter;
