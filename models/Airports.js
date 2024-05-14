const { Schema, model } = require("mongoose");

const Airport = new Schema(
  {
    airportCode: { type: String },
    airportLocation: {
      type: Object,
      required: true,
    },

    airportToll: { type: String },
    airportTimezone: { type: String },
    // numberOfTerminals: { type: String },
  },
  { timestamps: true }
);

module.exports = model("airport", Airport, "Airport");
