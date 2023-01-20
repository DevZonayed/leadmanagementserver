const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

// Lead Status
const leadStatusSchema = mongoose.Schema({
  leadFrom: {
    type: String,
  },
  leadAt: {
    type: Number,
    default: new Date().getTime(),
  },
  leadBy: {
    name: {
      type: String,
      default: "Dynamic",
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  session: {
    sessionNo: {
      type: Number,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  subject: {
    title: {
      type: String,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
});

const leadHistorySchema = mongoose.Schema({
  callAt: {
    type: Date,
  },
  agent: {
    name: {
      type: String,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  callType: {
    type: String,
  },
  callStatus: {
    type: String,
  },
  session: {
    sessionNo: {
      type: Number,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  subject: {
    title: {
      type: String,
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  comments: {
    type: String,
  },
});

const LeadSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    phone: [String],
    email: [String],
    accessories: [String],
    tags: [String],
    interest: [
      {
        subject: {
          type: String,
        },
        progress: {
          type: Number,
        },
      },
    ],
    leadSkill: [
      {
        subject: {
          type: String,
        },
        progress: {
          type: Number,
        },
      },
    ],
    leadStatus: [leadStatusSchema],
    agent: {
      name: {
        type: String,
      },
      id: {
        type: mongoose.Schema.ObjectId,
      },
      assignBy: {
        name: {
          type: String,
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
      AssignAt: {
        type: Date,
      },
      dateLine: {
        type: Number,
      },
    },
    batchStatus: [
      {
        batchNo: {
          type: String,
        },
        sessionId: {
          type: mongoose.Types.ObjectId,
        },
      },
    ],
    followUpStatus: {
      callAt: {
        type: Date,
      },
      agent: {
        name: {
          type: String,
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
      isCalled: {
        type: Boolean,
        default: false,
      },
    },
    admitionStatus: {
      isAdmitted: {
        type: Boolean,
        default: false,
      },
      admittedAt: {
        type: Date,
      },
    },
    admittedSession: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Session",
      },
    ],
    orderList: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
    ],
    entryType: [
      {
        type: {
          type: String,
        },
        title: {
          type: String,
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
        },
      },
    ],
    history: [leadHistorySchema],
  },
  {
    timestamps: true,
  }
);

LeadSchema.plugin(uniqueValidator, { message: "{PATH} already exist" });
const Lead = mongoose.model("Lead", LeadSchema);
module.exports = Lead;
