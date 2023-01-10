const AsyncHandler = require("express-async-handler");
const {
  filteringLeads,
  getAllFollowUps,
} = require("../helper/controllerUtils");
const Lead = require("../model/Lead");
const User = require("../model/User");

const getAgentDashBord = AsyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const user = await User.findById(id);
  if (user === null) {
    let error = new Error("Invalid Request !");
    res.status(400);
    next(error);
  }
  // Get all lead from this user
  const leads = await Lead.find({ "agent.id": id });

  const allLeads = filteringLeads(leads, "allLeads");
  const todaysLeads = filteringLeads(leads, new Date());
  const tomorrowLeads = filteringLeads(leads, new Date().getTime() + 86400000);
  const allFollowUps = getAllFollowUps(leads);

  res.status(200).json({
    message: "All Lead Getting success",
    data: {
      todaysLeads: todaysLeads,
      tomorrowLeads: tomorrowLeads,
      allLeads: {
        ...allLeads,
        expairedCall: [
          ...new Set([...allLeads.expairedCall, ...user?.expaired]),
        ],
      },
      allFollowUps: allFollowUps,
    },
  });
});

module.exports = { getAgentDashBord };
