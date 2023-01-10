const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const SettingSchema = mongoose.Schema(
  {
    type: {
      type: String,
      default: "global",
    },
    interest: [String],
    leadSkill: [String],
    callStatus: [String],
  },
  {
    timestamps: true,
  }
);

SettingSchema.plugin(uniqueValidator, { message: "{PATH} already exist" });
const Setting = mongoose.model("Setting", SettingSchema);
module.exports = Setting;
