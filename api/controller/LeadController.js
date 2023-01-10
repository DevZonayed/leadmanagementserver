const AsyncHandler = require("express-async-handler");
const { isDate } = require("../helper/generalUtils");
const { formatNumToBd } = require("../helper/phoneNumberFormater");
const BulkEntry = require("../model/BulkEntry");
const Lead = require("../model/Lead");
const Session = require("../model/Session");
const Subject = require("../model/Subject");
const User = require("../model/User");
/**
 * @route "/api/v1/lead/bulkentry"
 * @desc "This Controler is for Lead Bulk Entry
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const handleBulkEntry = AsyncHandler(async (req, res, next) => {
  const { lead, session, subject, title, leadBy } = req.body;
  let { _id, fullName } = req.tokenInfo;

  // Bulk Entry Title Validfation
  const entry = await BulkEntry.find({ title });
  if (entry.length !== 0) {
    let error = new Error("Please give a unique Title !");
    res.status(409);
    next(error);
    return;
  }

  //   Create a entry Report
  const bulkEntry = new BulkEntry({
    title: title,
    session,
    subject,
    createBy: {
      name: fullName,
      id: _id,
    },
  });

  //   Lead Operations handling start here
  let leadIDs = await Promise.all(
    lead.map(
      AsyncHandler(async (item) => {
        let modifyedLead = await Lead.findOneAndUpdate(
          {
            $or: [{ email: item.email }, { phone: formatNumToBd(item.phone) }],
          },
          {
            name: item.name,
            $addToSet: {
              phone: {
                $each: item.phone !== "" ? [formatNumToBd(item.phone)] : [],
              },
              email: { $each: item.email !== "" ? [item.email] : [] },
              entryType: {
                type: "Bulk",
                title: bulkEntry.title,
                id: bulkEntry._id,
              },
            },
          },
          { upsert: true, new: true }
        );

        // Update Bulk Edit
        if (
          modifyedLead.createdAt.toString() == modifyedLead.updatedAt.toString()
        ) {
          //   Add to fresh lead in entry report
          bulkEntry.freshLead = [...bulkEntry.freshLead, modifyedLead._id];
        } else {
          //   Add to Previous lead in entry report
          bulkEntry.previousLead = [
            ...bulkEntry.previousLead,
            modifyedLead._id,
          ];
        }

        // Change Lead Status
        if (modifyedLead.leadStatus.length == 0) {
          modifyedLead.leadStatus = [
            ...modifyedLead.leadStatus,
            {
              leadFrom: item.leadFrom,
              leadBy: {
                name: leadBy || "Self",
                id: null,
              },
              session: {
                sessionNo: session.sessionNo,
                id: session._id,
              },
              subject: {
                title: subject.title,
                id: subject._id,
              },
              leadAt: new Date(item.leadAt).getTime() || null,
            },
          ];
          await modifyedLead.save();
        } else {
          if (modifyedLead?.history?.length !== 0) {
            if (
              new Date(
                modifyedLead?.history[modifyedLead?.history.length - 1].callAt
              ) < new Date()
            ) {
              modifyedLead.leadStatus = [
                ...modifyedLead.leadStatus,
                {
                  leadFrom: item.leadFrom,
                  leadBy: {
                    name: leadBy || "Self",
                    id: null,
                  },
                  session: {
                    sessionNo: session.sessionNo,
                    id: session._id,
                  },
                  subject: {
                    title: subject.title,
                    id: subject._id,
                  },
                  leadAt: new Date(item.leadAt).getTime() || null,
                },
              ];
              await modifyedLead.save();
            }
          }
        }

        return modifyedLead._id;
      })
    )
  );

  await bulkEntry.save();
  await Session.updateOne(
    { _id: session._id },
    {
      $addToSet: {
        leads: { $each: [...leadIDs] },
      },
    }
  );
  await Subject.updateOne(
    { _id: subject._id },
    {
      $addToSet: {
        leads: { $each: [...leadIDs] },
      },
    }
  );

  res.status(201).json({
    message: `${
      bulkEntry.freshLead.length + bulkEntry.previousLead.length
    } Bulk Entry Successfull`,
    data: bulkEntry,
  });
});

/**
 * @route "/api/v1/lead/getallbulkentry"
 * @desc "This Controler is for getting all bulk entry
 * @Access { Private }
 * @method "GET"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllBulkEntryReport = AsyncHandler(async (req, res, next) => {
  const bulkEntry = await BulkEntry.find();
  res.status(200).json({
    message: "All bulk entry report get successful !",
    data: bulkEntry,
  });
});

/**
 * @route "/api/v1/lead/getalllead"
 * @desc "This Controler is for getting all Leads
 * @Access { Private }
 * @method "GET"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllLead = AsyncHandler(async (req, res, next) => {
  const leads = await Lead.find();
  res.status(200).json({
    message: "All lead getting successfull",
    data: leads,
  });
});

/**
 * @route "/api/v1/lead/updatelead"
 * @desc "This Controler is for getting all Leads
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const handleLeadUpdate = AsyncHandler(async (req, res, next) => {
  const { _id, data } = req.body;
  // Update Lead
  const updatedLead = await Lead.findByIdAndUpdate(
    _id,
    { ...data },
    {
      new: true,
    }
  );

  res.status(200).json({
    message: "Lead Update Successfull !",
    data: updatedLead,
  });
});

/**
 * @route "/api/v1/lead/getleadsbyid"
 * @desc "This Controler is for getting all Leads
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getLeadByIds = AsyncHandler(async (req, res, next) => {
  const { data } = req.body;
  if (data.length === 0) {
    res.status(404);
    let error = new Error("Nothing Found !");
    next(error);
    return;
  }

  // Get All Leads
  const leads = await Lead.find({ _id: { $in: data } });
  if (leads.length === 0) {
    res.status(404);
    let error = new Error("Nothing Found !");
    next(error);
    return;
  }

  res.status(200).json({
    message: "Lead Getting Successfull !",
    data: leads,
  });
});

/**
 * @route "/api/v1/lead/assignagent"
 * @desc "This Controler is for Assign Agent
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const assignAgenet = AsyncHandler(async (req, res, next) => {
  const { ids, dateLine, agent } = req.body;
  let { _id, fullName } = req.tokenInfo;

  let prevLeads = await Lead.find({ _id: { $in: ids } });

  prevLeads.map(
    AsyncHandler(async (item) => {
      if (item.agent.id === undefined || item.agent.id === agent._id) {
        return;
      }

      if (
        ((new Date(item.history[item.history?.length - 1]?.callAt) <
          new Date(item.agent.AssignAt) ||
          (isDate(item.followUpStatus.callAt) &&
            item.followUpStatus?.agent?.id !== agent.id) ||
          item.history.length === 0) &&
          new Date(item?.agent?.dateLine) < new Date()) ||
        new Date(item?.followUpStatus?.callAt) < new Date()
      ) {
        await User.updateOne(
          { _id: item.agent.id },
          {
            $addToSet: {
              expaired: item._id,
            },
          }
        );
      }
    })
  );

  await Lead.updateMany(
    { _id: { $in: ids } },
    {
      agent: {
        name: `${agent.firstName} ${agent.lastName}`,
        id: agent._id,
        assignBy: {
          name: fullName,
          id: _id,
        },
        AssignAt: Date.now(),
        dateLine: dateLine,
      },
    }
  );

  await User.updateOne(
    { _id: agent._id },
    {
      $addToSet: {
        leads: [...ids],
      },
      $push: {
        notification: {
          title: "Assign Lead",
          description: `${ids.length} Lead assigned to you`,
          link: "/datagrid",
          showAfter: Date.now(),
          type: "leadAssigned",
        },
      },
    }
  );
  const updatedLeads = await Lead.find({ _id: { $in: ids } });
  res.status(200).json({
    message: `${ids.length} Lead Assign to ${agent.firstName} Successful`,
    data: updatedLeads,
  });
});

/**
 * @route "/api/v1/lead/getleadforagent"
 * @desc "This Controler is for Assign Agent
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getLeadByAgent = AsyncHandler(async (req, res, next) => {
  const { user } = req.body;
  const leads = await Lead.find({ "agent.id": user._id });
  res.status(200).json({
    message: "All Lead Getting success",
    data: leads,
  });
});

module.exports = {
  handleBulkEntry,
  getAllBulkEntryReport,
  getAllLead,
  handleLeadUpdate,
  getLeadByIds,
  assignAgenet,
  getLeadByAgent,
};
