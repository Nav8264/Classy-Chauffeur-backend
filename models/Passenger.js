const { Schema, model } = require("mongoose");

const Passenger = new Schema(
  {
    serviceType: {
      type: String,
      default: "toAirport",
      enum: ["toAirport", "fromAirport", "hourly", "eventTransfer"],
    },
    pickupDate: {
      type: Date,
    },
    pickupTime: {
      type: String,
    },
    pickupLocation: {
      type: Object,
    },
    stops: [
      {
        type: Object,
      },
    ],
    dropOfLocation: {
      type: Object,
    },
    numberOfPassenger: {
      type: Number,
    },
    luggage: {
      small: {
        type: Number,
      },
      large: {
        type: Number,
      },
    },
    childSeats: [
      {
        name: {
          type: String,
          default: "infant",
          enum: ["infant", "toddlerSeat", "boosterSeat"],
        },
        count: {
          type: Number,
        },
      },
    ],
    numberOfHours: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = model("passenger", Passenger, "passenger");
