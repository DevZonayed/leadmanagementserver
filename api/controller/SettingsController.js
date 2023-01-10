const AsyncHandler = require("express-async-handler");
const Setting = require("../model/Settings");

/**
 * @route "/api/v1/settings/insert"
 * @desc "This Controler is for Insert a option
 * @Access { Private }
 * @method "POST"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const insertOption = AsyncHandler(async (req, res, next) => {
  const { key, value } = req.body;

  let settings;
  settings = await Setting.findOne({ type: "global" });
  //   Have or not validation
  if (settings == null) {
    settings = new Setting({
      interest: [],
      leadSkill: [],
      callStatus: [],
    });
  }

  if (settings[key].some((e) => new RegExp("^" + value + "$", "i").test(e))) {
    let error = new Error(`This item in ${key} alredy Exist !`);
    res.status(409);
    next(error);
    return;
  }

  settings[key] = [...settings[key], value.trim()];
  settings.save();

  res.json({
    message: "Insert Successfull !",
    data: settings,
  });
});

/**
 * @route "/api/v1/settings/getall"
 * @desc "This Controler is for getall option
 * @Access { Private }
 * @method "GET"
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllSettings = AsyncHandler(async (req, res, next) => {
  const settings = await Setting.findOne({ type: "global" });
  if (settings === null) {
    let error = new Error("Nothing Found!");
    res.status(404);
    next(error);
    return;
  }

  res.status(200).json({
    message: "Settings Get Success",
    data: settings,
  });
});

const removeOption = AsyncHandler(async (req, res, next) => {
  let { key, value } = req.body;

  const settings = await Setting.findOne({ type: "global" });
  const newOptions = settings[key].filter((item) => item !== value);
  settings[key] = newOptions;
  settings.save();
  res.status(200).json({
    message: "Options Remove Successful",
    data: settings,
  });
});

module.exports = { insertOption, getAllSettings, removeOption };
