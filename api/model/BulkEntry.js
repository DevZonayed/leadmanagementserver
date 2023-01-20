const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const BulkEntrySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    previousLead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" }],
    freshLead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" }],
    admittedLead: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" }],
    type: {
      type: String,
    },
    session: {
      type: Object,
    },
    subject: {
      type: Object,
    },
    createBy: {
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

BulkEntrySchema.plugin(uniqueValidator, { message: "{PATH} already exist" });
const BulkEntry = mongoose.model("BulkEntry", BulkEntrySchema);
module.exports = BulkEntry;
