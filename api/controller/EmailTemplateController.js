const AsyncHandler = require("express-async-handler");
const EmailTemplate = require("../model/EmailTemplate");

/**
 * @route "/api/v1/template/create"
 * @desc "This Controler is for Create Email Template
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createTemplate = AsyncHandler(async (req, res, next) => {
  let { _id, fullName } = req.tokenInfo;
  const { title } = req.body;

  // Empty Data Validation
  if (title == "") {
    res.status(400);
    let error = new Error("Invalid Data");
    next(error);
  }

  //   Create template
  const template = new EmailTemplate({
    title,
    createBy: {
      name: fullName,
      id: _id,
    },
  });

  //   Save to db
  await template.save();
  //   Send Response
  res.status(201).json({
    message: "Template Create Successfull!",
    data: template,
  });
});

/**
 * @route "/api/v1/template/edit"
 * @desc "This Controler is for Edit Email Template
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllTemplate = AsyncHandler(async (req, res, next) => {
  //   Get all template
  let template = await EmailTemplate.find();
  //   Send Response
  res.status(200).json({
    message: "All Template get success!",
    data: template,
  });
});

const editTemplate = AsyncHandler(async (req, res, next) => {
  const { _id, html, editableData } = req.body;

  //   Edit Template
  const template = await EmailTemplate.findByIdAndUpdate(
    _id,
    {
      html,
      editableData,
    },
    {
      new: true,
    }
  );

  //   Send Response
  res.status(200).json({
    message: "Template Update Successfull!",
    data: template,
  });
});

module.exports = { createTemplate, getAllTemplate, editTemplate };
