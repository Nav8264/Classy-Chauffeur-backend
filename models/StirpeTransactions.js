const { Schema, model } = require("mongoose");

const stripeTransactionSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    amount: {
      type: Number,
    },
    intent_id: {
      type: String,
    },
    ride: {
      type: Schema.Types.ObjectId,
      ref: "ride",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const StripeTransaction = model(
  "StripeTransaction",
  stripeTransactionSchema,
  "stripetransaction"
);

module.exports = StripeTransaction;
