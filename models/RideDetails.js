const { Schema, model } = require("mongoose");

const RideDetails = new Schema(
  {
    rideMode: {
      type: String,
      enum: ["One-Way-Ride", "Round-Trip", "Instant-Ride"],
    },

    rideType: {
      type: String,
      enum: ["Point-to-Point", "Airport-Pickup", "Airport-Drop", "Event"],
    },

    passengers: {
      type: String,
      enum: ["01", "02", "03", "04", "05", "06"],
    },

    addStop: {
      type: String,
    },
    luggage: {
      type: String,
      enum: ["01", "02", "03", "04", "05", "06"],
    },
    luggageCapacityLarge: {
      type: String,
      enum: ["01", "02", "03", "04", "05", "06"],
    },
    luggageCapacitySmall: {
      type: String,
      enum: ["01", "02", "03", "04", "05", "06"],
    },

    childSeat: {
      type: String,
      enum: ["01", "02", "03", "04", "05", "06"],
    },
    paymentType: {
      type: String,
      enum: ["perKm", "perHour"],
    },

    vehicleType: {
      type: String,
      default: "Executive",
      enum: ["Executive", "SUV", "first_class", "Bus", "Van"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("rideDetails", RideDetails, "rideDetails");
