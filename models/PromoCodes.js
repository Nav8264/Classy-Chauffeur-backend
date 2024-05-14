const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PromoCodes = new Schema(
  {
    name: { type: "String" },
    expiryDate: { type: Date },
    maxRedeems: { type: Number },
    percentOff: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PromoCodes", PromoCodes, "PromoCodes");
