const { Schema, model } = require("mongoose");

const Chauffeur = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
    },
    gender: {
      type: String,
      required: true,
      default: "Male",
      enum: ["Male", "Female", "Others"],
    },
    password: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    avatar_url: {
      type: String,
    },
    experience: {
      type: String,
      required: true,
      default: "0-5 years",
      enum: ["0-5 years", "5-10 years", "10+ years"],
    },

    vehicleType: {
      type: String,
      required: true,
      default: "HC Class",
      enum: ["HC Class", "MR Class", "LR Class", "C Class"],
    },
    licenseType: {
      type: String,
      required: true,
      default: "HR Class",
      enum: ["HR Class", "LR Class"],
    },

    isVerified: {
      type: String,
      default: "Pending",
      enum: ["Verified", "Pending", "Rejected", "Deactivated"],
    },

    licenseNo: {
      type: Number,
    },

    licenseExpiry: {
      type: Date,
    },

    drivingDocument: {
      type: String,
    },

    residentialDocument: {
      type: String,
    },

    drivingAuthorityDocument: {
      type: String,
    },
    isDrivingLicenseVerified: {
      type: String,
      default: "Pending",
      enum: ["Verified", "Pending", "Rejected"],
    },
    chauffeurPrice: {
      type: Number,
      required: true,
      default: 40,
    },
    specialChauffeur: {
      type: Boolean,
      default: false,
    },
    isDrivingAuthorityVerified: {
      type: String,
      default: "Pending",
      enum: ["Verified", "Pending", "Rejected"],
    },

    earnings: {
      type: Number,
    },

    isGoogleLogin: {
      type: Boolean,
      default: false,
    },
    isFacebookLogin: {
      type: Boolean,
      default: false,
    },
    googleID: {
      type: Number,
    },

    appleId: {
      type: String,
    },

    activeRide: {
      type: Schema.Types.ObjectId,
      ref: "ride",
    },
    notifToken: {
      type: String,
    },

    location: {
      type: Object,
    },

    isOperator: {
      type: Boolean,
      required: true,
      default: false,
    },

    companyName: {
      type: String,
      default: "BGC",
      required: true,
    },
    isChecklisted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("chauffeur", Chauffeur, "Chauffeur");
