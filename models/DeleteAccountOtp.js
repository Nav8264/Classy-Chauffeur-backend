const { Schema, model } = require("mongoose");
// create a schema
var deleteAccountOtp = new Schema(
  {
    otp: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    accountType: { type: String, required: true },
    createdAt: { type: Date, expires: "5m", default: Date.now },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// make this available to our users in our Node applications
module.exports = model(
  "deleteAccountOtp",
  deleteAccountOtp,
  "DeleteAccountOTP"
);
