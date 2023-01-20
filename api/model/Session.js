const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const SessionSchema = mongoose.Schema(
  {
    sessionNo: {
      type: Number,
      required: true,
    },
    subject: {
      title: {
        type: String,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    leads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" }],
    createdBy: {
      name: {
        type: String,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    admittedLead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" }],
    startAt: {
      type: String,
      required: true,
    },
    endAt: {
      type: String,
      required: true,
    },
    leadExpectation: {
      type: Number,
    },
    studentExpectation: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

SessionSchema.plugin(uniqueValidator, { message: "{PATH} already exist" });
const Session = mongoose.model("Session", SessionSchema);
module.exports = Session;
