const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    leads: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lead" }],
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["admin", "agent"],
      default: "agent",
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    notification: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
        link: {
          type: String,
        },
        showAfter: {
          type: Number,
        },
        isRead: {
          type: Boolean,
          defaul: false,
        },
        type: {
          type: String,
          defaul: "simple",
        },
      },
    ],
    extraPhone: [String],
    extraEmail: [String],
    accessories: [
      mongoose.Schema({
        title: {
          type: String,
        },
        url: {
          type: String,
        },
      }),
    ],
    expaired: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lead",
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match Password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword || "", this.password);
};

// Full name vartual key value
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName !== undefined && this.firstName} ${
    this.lastName !== undefined && this.lastName
  }`.trim();
});

UserSchema.plugin(uniqueValidator, { message: "{PATH} already exist" });
const User = mongoose.model("User", UserSchema);
module.exports = User;
