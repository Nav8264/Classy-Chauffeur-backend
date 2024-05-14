const { Schema, model } = require("mongoose");

const RidePrices = new Schema(
  {
    flatRate: {
      type: Number,
      default: 0,
    },
    childSeatPrice: {
      type: Number,
    },
    trailerPrice: {
      type: Number,
    },
    toll: {
      type: Number,
      default: 0,
    },
    perHour: {
      type: Number,
      default: 0,
    },
    overTime: {
      type: Number,
      default: 0,
    },
    extraStop: {
      type: Number,
      default: 0,
    },
    extraStopCharges: {
      type: Number,
      default: 0,
    },
    driverNotes: {
      type: String,
    },
    waitingTime: {
      type: Number,
      default: 0,
    },
    waitingTimeCharges: {
      type: String,
    },
    adminFee: {
      type: Number,
      default: 0,
    },
    adminFeePerc: {
      type: String,
      default: 0,
    },
    eventCharges: {
      type: Number,
      default: 0,
    },
    eventChargesPerc: {
      type: String,
      default: 0,
    },
    cardCharges: {
      type: Number,
      default: 0,
    },
    stateTax: {
      type: Number,
      default: 0,
    },
    gst: {
      type: Number,
      default: 0,
    },
    gstPerc: {
      type: String,
      default: 0,
    },

    totalDue: {
      type: Number,
      default: 0,
    },

    deposits: {
      type: Number,
      default: 0,
    },

    authorizations: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = model("ridePrices", RidePrices, "ridePrices");
