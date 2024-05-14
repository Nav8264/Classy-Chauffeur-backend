const { Schema, model } = require("mongoose");

const User = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    isGoogleLogin: {
      type: Boolean,
      default: false,
    },

    isFacebookLogin: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      required: true,
      default: "Passenger",
      enum: ["Passenger", "Admin", "Chauffeur"],
    },
    password: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    avatar_profile: {
      type: String,
    },

    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("User", User, "User");
