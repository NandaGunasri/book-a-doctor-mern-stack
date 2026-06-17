const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "full name is required"],
      set: function (value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      },
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "password is required"],
    },

    isDoctor: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    notification: {
      type: Array,
      default: [],
    },

    seennotification: {
      type: Array,
      default: [],
    },

    documents: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = mongoose.model("user", userModel);

module.exports = userSchema;