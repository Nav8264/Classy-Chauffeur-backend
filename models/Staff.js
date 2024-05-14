const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
const staffUserSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    firstName: { type: Schema.Types.String, required: true },
    lastName: { type: Schema.Types.String, required: true },
    role: {
      type: String,
      default: "Executive",
      enum: ["Admin", "Manager", "Executive"],
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phoneNumber: {
      number: { type: Schema.Types.Number, required: true },
      countryCode: { type: Schema.Types.String, required: true },
    },
    status: {
      type: String,
      default: "awaiting",
      enum: ["awaiting", "active", "inactive"],
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const StaffUser = mongoose.model("StaffUser", staffUserSchema, "StaffUser");

// make this available to our users in our Node applications
module.exports = StaffUser;
