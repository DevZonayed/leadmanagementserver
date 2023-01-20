const AsyncHandler = require("express-async-handler");
const Subject = require("../model/Subject");

/**
 * @route "/api/v1/subject/create"
 * @desc "This Controler is for Create Subject
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createSubject = AsyncHandler(async (req, res, next) => {
  const { title } = req.body;
  let { _id, fullName } = req.tokenInfo;

  //   Validation
  if (title === undefined || !title) {
    res.status(400);
    let error = new Error("Invalid Data");
    next(error);
  }

  const subject = new Subject({
    title,
    createdBy: {
      name: fullName,
      id: _id,
    },
  });
  await subject.save();

  res.status(201).json({
    message: "Subject Created Successfull",
    data: subject,
  });
});

/**
 * @route "/api/v1/subject/getall"
 * @desc "This Controler is for Get All Subjects
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllSubjects = AsyncHandler(async (req, res, next) => {
  const subjects = await Subject.find()
    .sort({
      updatedAt: -1,
    })
    .select("-__v");
  res.status(200).json({
    messaqge: "Subject Get Successful",
    data: subjects,
  });
});

/**
 * @route "/api/v1/subject/terminate"
 * @desc "This Controler is for Get All Subjects
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const terminateSubject = AsyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  const subject = await Subject.findById(_id);
  if (subject.sessions.length !== 0) {
    let error = new Error("Not terminateable!");
    res.status(417);
    next(error);
  }

  const result = await Subject.deleteOne({ _id });

  if (result.deletedCount !== 1) {
    let error = new Error("Something Went Wrong!");
    res.status(500);
    next(error);
  }

  const allSubject = await Subject.find().sort({
    updatedAt: -1,
  });

  res.json({
    message: "Subject Terminate Success",
    data: allSubject,
  });
});

module.exports = { createSubject, getAllSubjects, terminateSubject };
