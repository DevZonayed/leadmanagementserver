const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const EmailTemplateSchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    html: {
      type: String,
    },
    editableData: {
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

EmailTemplateSchema.plugin(uniqueValidator, {
  message: "{PATH} already exist",
});
const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);
module.exports = EmailTemplate;
