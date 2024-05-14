const { Schema, model } = require("mongoose");

const bankDetails = new Schema(
  {
    chauffeurId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    bsbCode: { type: String },
    accountNumber: { type: String },
    accountholderName: { type: String },
  },
  { timestamps: true }
);

module.exports = model("bankDetails", bankDetails, "bankDetails");
