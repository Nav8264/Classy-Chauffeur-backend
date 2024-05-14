const { Schema, model } = require("mongoose");

const priceObject = new Schema({
  fixedKm: {
    type: Number,
  },
  fixedPrice: {
    type: Number,
  },
  pricePerKm: {
    type: Number,
  },
  pricePerHour: {
    type: Number,
  },
});

const VehiclePrice = new Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    fixedKm: {
      type: Number,
    },
    fixedPrice: {
      type: Number,
    },
    pricePerKm: {
      type: Number,
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    statewisePricing: {
      type: Boolean,
      default: false,
    },
    queensland: {
      type: priceObject,
    },
    tasmania: {
      type: priceObject,
    },
    newsouthwales: {
      type: priceObject,
    },
    victoria: {
      type: priceObject,
    },
    westernaustralia: {
      type: priceObject,
    },
    southaustralia: {
      type: priceObject,
    },
    australiancapitalterritory: {
      type: priceObject,
    },
    northernterritory: {
      type: priceObject,
    },
  },
  { timestamps: true }
);
module.exports = model("VehiclePrice", VehiclePrice, "VehiclePrice");
