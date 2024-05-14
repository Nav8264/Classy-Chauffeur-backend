const { Schema, model } = require("mongoose");

const Admin = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    firstName: { type: Schema.Types.String },
    lastName: { type: Schema.Types.String },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      // type: Schema.Types.Number,
      // required: true,
      number: { type: Schema.Types.Number, required: true },
      countryCode: { type: Schema.Types.String, required: true },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // required: true,
      // enum: ["Admin", "SuperAdmin", "Manager", "Executive"],
    },
    invitedUserType: { type: String, enum: ["staff"] },
    address: {
      address_line_1: {
        type: String,
      },
      address_line_2: {
        type: String,
      },
      country: {
        type: String,
      },
      state: {
        type: String,
      },
      city: {
        type: String,
      },
      postal_code: {
        type: String,
      },
    },
    isActive: {
      type: Schema.Types.Boolean,
      default: true,
    },
    fcmTokens: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Admin", Admin, "Admin");
