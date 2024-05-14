const { Schema, model } = require("mongoose");

const Vehicle = new Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
    },
    plateNumber: {
      type: String,
      required: true,
    },
    vehicleName: {
      type: String,
      required: true,
    },
    chauffeur: {
      type: Schema.Types.ObjectId,
      ref: "Chauffeur",
    },
    category: {
      type: String,
      default: "SEDAN",
      required: true,
      // enum: ["SEDAN", "SED", "SUV", "VAN", "BUS", "STR", "ROSA_BUS"],
    },
    capacity: {
      type: Number,
      required: true,
    },
    fuelType: {
      type: String,
      default: "Petrol",
      required: true,
      enum: ["Petrol", "Diesel", "Electric", "CNG"],
    },

    infant: {
      type: Number,
    },
    toddler: {
      type: Number,
    },
    booster: {
      type: Number,
    },

    fixedKm: {
      type: String,
    },
    fixedPrice: {
      type: String,
    },
    pricePerKm: {
      type: String,
      // required: true,
    },
    pricePerHour: {
      type: String,
      required: true,
    },
    luggageQuantity: {
      type: Number,
    },
    luggageQuantityLarge: {
      type: Number,
      default: 0,
      //  enum: ["01", "02","03","04","05","06"],
    },
    luggageQuantitySmall: {
      type: Number,
      default: 0,
      //  enum: ["01", "02","03","04","05","06"],
    },
    trailerOption: {
      type: Boolean,
    },
    regoNo: {
      type: String,
    },
    insuranceNo: {
      type: String,
    },
    coiNo: {
      type: String,
    },
    vehicleRego: {
      url: { type: String },
      expiryDate: { type: Date },
    },
    vehicleInsurance: {
      url: { type: String },
      expiryDate: { type: Date },
    },
    vehicleCOI: {
      url: { type: String },
      expiryDate: { type: Date },
    },
    vehicleImage: {
      url: { type: String },
    },
    vehicleLogo: {
      url: { type: String },
    },

    vehicleOwner: {
      type: String,
      default: "BGC",
    },
    operator: {
      type: Schema.Types.ObjectId,
      ref: "Chauffeur",
    },
  },
  { timestamps: true }
);
module.exports = model("Vehicle", Vehicle, "vehicle");
