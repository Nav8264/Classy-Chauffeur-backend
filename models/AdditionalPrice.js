const { Schema, model } = require("mongoose");

const AdditionalPrice = new Schema(
  {
    rateName: {
      type: String,
      default: "GST",
      required: true,
      enum: ["GST", "ADMIN-FEE", "EXTRA-FEE", "EVENT-FEE", "AIRPORT-TOLL"],
    },
    title: {
      type: String,
    },
    mode: {
      type: String,
      default: "Custom",
      required: true,
      enum: ["Custom", "Always"],
    },
    amount: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = model("AdditionalPrice", AdditionalPrice, "AdditionalPrice");
