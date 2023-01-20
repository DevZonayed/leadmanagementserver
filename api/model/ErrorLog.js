const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const ErrorLogSchema = mongoose.Schema(
  {
    time: {
      type: Date,
    },
    from: {
      type: String,
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

ErrorLogSchema.plugin(uniqueValidator, { message: "{PATH} already exist" });
const ErrorLog = mongoose.model("ErrorLog", ErrorLogSchema);
module.exports = ErrorLog;
