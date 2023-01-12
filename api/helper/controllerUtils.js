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
      /^notapplicable$/i.test(callStatus(item)) &&
      !/^dome$/i.test(callStatus(item))
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

/**
 *  Give a appropiate call status based on some condition
 * if any one input a lead from diffrent area after 5 days of assign someone then it will behave like fresh lead
 * @param {lead} lead
 * @returns
 */
function callStatus(lead) {
  let latestHistory = lead.history[lead.history.length - 1];
  if (latestHistory === undefined) {
    return "notapplicable";
  }
  if (
    new Date(lead?.agent?.AssignAt) >
      new Date(
        new Date(lead.leadStatus[lead.leadStatus.length - 1].leadAt).getTime() -
          864000000
      ) &&
    latestHistory?.callStatus !== ""
  ) {
    return latestHistory.callStatus;
  }

  return "notapplicable";
}

/**
 * Is the value exsit in spacifiq object key
 * @param {all data} list
 * @param {key name} prop
 * @param {key value to match} val
 * @returns
 */
function objectPropInArray(list, prop, val) {
  if (list.length > 0) {
    for (i in list) {
      if (list[i][prop] === val) {
        return true;
      }
    }
  }
  return false;
}

module.exports = {
  filteringLeads,
  allDoneLead,
  othersStatusLead,
  allExpairedCall,
  getAllFollowUps,
  objectPropInArray,
};
