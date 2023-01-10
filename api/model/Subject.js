const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const SubjectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
    leads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" }],
    createdBy: {
      name: {
        type: String,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  },
  {
    timestamps: true,
  }
);

SubjectSchema.plugin(uniqueValidator, { message: "{PATH} already exist" });
const Subject = mongoose.model("Subject", SubjectSchema);
module.exports = Subject;
