const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const payment = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    paymentId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("payment", payment, "payment");


