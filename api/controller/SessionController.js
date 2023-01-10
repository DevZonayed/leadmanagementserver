const AsyncHandler = require("express-async-handler");
const Session = require("../model/Session");
const Subject = require("../model/Subject");
/**
 * @route "/api/v1/session/create"
 * @desc "This Controler is for Create Subject
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createSession = AsyncHandler(async (req, res, next) => {
  const {
    sessionNo,
    subject: subjectInfo,
    startAt,
    endAt,
    leadExpectation,
    studentExpectation,
  } = req.body;
  let { _id, fullName } = req.tokenInfo;

  //   Validation
  if (
    !sessionNo ||
    sessionNo === undefined ||
    !subjectInfo ||
    subjectInfo.title === undefined ||
    subjectInfo.id === undefined ||
    !startAt ||
    startAt === undefined ||
    !endAt ||
    endAt === undefined ||
    !leadExpectation ||
    leadExpectation === undefined ||
    !studentExpectation ||
    studentExpectation === undefined
  ) {
    res.status(400);
    let error = new Error("Invalid Data");
    next(error);
  }

  const session = new Session({
    sessionNo,
    subject: {
      ...subjectInfo,
    },
    startAt,
    endAt,
    leadExpectation,
    studentExpectation,
    createdBy: {
      name: fullName,
      id: _id,
    },
  });
  await session.save();

  // Subject Update
  await Subject.updateOne(
    { _id: session.subject.id },
    {
      $push: {
        sessions: session._id,
      },
    }
  );
  const subjects = await Subject.find();

  res.status(201).json({
    message: "Session Created Successfull",
    data: session,
    subjects,
  });
});

/**
 * @route "/api/v1/session/getall"
 * @desc "This Controler is for Get All Subjects
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllSession = AsyncHandler(async (req, res, next) => {
  const sessions = await Session.find().select("-__v");

  res.status(200).json({
    messaqge: "Sessions Get Successful",
    data: sessions,
  });
});

/**
 * @route "/api/v1/session/terminate"
 * @desc "This Controler is for Get All Subjects
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const terminateSession = AsyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  const session = await Session.findById(_id);
  if (session.leads.length !== 0) {
    let error = new Error("Not terminateable!");
    res.status(417);
    next(error);
    return;
  }

  const result = await Session.deleteOne({ _id });
  if (result.deletedCount !== 1) {
    let error = new Error("Something Went Wrong!");
    res.status(500);
    next(error);
    return;
  }

  //   Drop from subject
  await Subject.updateOne(
    { _id: session.subject.id },
    {
      $pull: {
        sessions: session._id,
      },
    }
  );

  const allSession = await Session.find();
  const subjects = await Subject.find();

  res.status(200).json({
    message: "Subject Terminate Success",
    data: allSession,
    subjects,
  });
});

module.exports = { createSession, getAllSession, terminateSession };
