const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const OrderSchema = mongoose.Schema(
  {
    userInfo: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      city: {
        type: String,
      },
      postCode: {
        type: String,
      },
      country: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
    leadId: {
      type: mongoose.Types.ObjectId,
      ref: "Lead",
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    orderAt: {
      type: Date,
      required: true,
    },
    orderEditAt: {
      type: Date,
      required: true,
    },
    orderAtGmt: {
      type: Date,
      required: true,
    },
    orderEditAtGmt: {
      type: Date,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    discountTotal: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
    },
    leadIp: {
      type: String,
    },
    products: [
      {
        title: {
          type: String,
        },
        quantity: {
          type: Number,
        },
        subTotal: {
          type: Number,
        },
        total: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    session: {
      id: {
        type: mongoose.Types.ObjectId,
      },
      sessionNo: {
        type: Number,
      },
    },
    subject: {
      id: {
        type: mongoose.Types.ObjectId,
      },
      title: {
        type: String,
      },
    },
    classTime: {
      days: {
        type: String,
      },
      time: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.plugin(uniqueValidator, { message: "{PATH} already exist" });
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
