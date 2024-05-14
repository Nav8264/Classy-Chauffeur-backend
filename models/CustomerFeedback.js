const { Schema, model } = require("mongoose");

const Feedback = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    rateCount: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    responded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("Feedback", Feedback, "Feedback");
