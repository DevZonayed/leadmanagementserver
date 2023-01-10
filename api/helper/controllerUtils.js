const { isDate } = require("./generalUtils");

function filteringLeads(leads, data = "global") {
  let allLeads = leads.filter((item) => {
    if (data == "global" || data == "allLeads") {
      return true;
    }
    if (!isDate(data)) {
      return false;
    }
    return (
      new Date(item?.agent?.dateLine).toDateString("en", {}) ===
      new Date(data).toDateString("en", {})
    );
  });

  //   All calls that have done
  let allCompleteCall = allDoneLead(allLeads);

  //   All Calls Without done status
  let allOthersCalls = othersStatusLead(allLeads);

  // All Expaired
  let expairedCall = allExpairedCall(leads);

  return {
    completed: allCompleteCall.map((item) => item?._id),
    expairedCall: expairedCall.map((item) => item?._id),
    others: allOthersCalls.map((item) => item?._id),
    total: allLeads.map((item) => item._id),
  };
}

// All Lead with done status within assign
function allDoneLead(leads) {
  return leads.filter((item) => {
    let history = item.history[item.history.length - 1];
    return (
      new Date(history?.callAt) > new Date(item?.agent?.AssignAt) &&
      /^done$/i.test(history?.callStatus)
    );
  });
}
// This lead will help to find lead without done status
function othersStatusLead(leads) {
  return leads.filter((item) => {
    let history = item.history[item.history.length - 1];
    return (
      new Date(history?.callAt) > new Date(item?.agent?.AssignAt) &&
      !/^done$/i.test(history?.callStatus)
    );
  });
}
// Get All Expaired Call
function allExpairedCall(leads) {
  return leads.filter((item) => {
    if (!isDate(item?.agent?.dateLine)) {
      return false;
    }

    return (
      new Date(
        new Date(item?.agent?.dateLine).toDateString("en", {
          dateStyle: "full",
        })
      ) < new Date(new Date().toDateString("en", { dateStyle: "full" })) &&
      !item.admitionStatus.isAdmitted &&
      !isDate(item.followUpStatus.callAt) &&
      // !/^done$/i.test(latestHistory?.callStatus)
      !/^done$/i.test(callStatus(item))
    );
  });
}

// Get all followup calls
function getAllFollowUps(leads) {
  let followUps = leads.filter((item) => {
    return (
      isDate(item?.followUpStatus?.callAt) || item?.followUpStatus?.isCalled
    );
  });

  return {
    allFollowUps: followUps.map((item) => {
      return { id: item?._id, followUpTime: item?.followUpStatus?.callAt };
    }),
    followUpDone: followUps
      .filter((item) => item?.followUpStatus?.isCalled)
      .map((item) => {
        return { id: item?._id, followUpTime: item?.followUpStatus?.callAt };
      }),
  };
}

function callStatus(lead) {
  let latestHistory = lead.history[lead.history.length - 1];
  if (latestHistory === undefined) {
    return "Not Found!";
  }
  if (
    new Date(latestHistory?.callAt) >
      new Date(new Date(lead.updatedAt).getTime() - 8640000) &&
    latestHistory?.callStatus !== ""
  ) {
    return latestHistory.callStatus;
  }

  return "Not Found!";
}

module.exports = {
  filteringLeads,
  allDoneLead,
  othersStatusLead,
  allExpairedCall,
  getAllFollowUps,
};
