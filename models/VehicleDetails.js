const { Schema, model } = require("mongoose");

const Vehicles = new Schema({
  luggageQuantity: {
    type: String,
  },
  luggageQuantityLarge: {
    type: String,
    //  enum: ["01", "02","03","04","05","06"],
  },
  luggageQuantitySmall: {
    type: String,
    //  enum: ["01", "02","03","04","05","06"],
  },
  vehicleRego: {
    url: { type: String },
    expiryDate: { type: String },
  },
  vehicleInsurance: {
    url: { type: String },
    expiryDate: { type: String },
  },
  vehicleCOI: {
    url: { type: String },
    expiryDate: { type: String },
  },
  vehicleImage: {
    url: { type: String },
    type: { type: String },
  },
});

module.exports = model("VehicleDetails", Vehicles, "VehicleDetails");
