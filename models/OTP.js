const { Schema, model } = require("mongoose");

const otp = new Schema(
  {
    otp: {
      type: Number,
      required: true,
    },
    user: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const OTP = model("otp", otp, "otp");

// make this available to our users in our Node applications
module.exports = OTP;
