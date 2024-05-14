const { Schema, model } = require("mongoose");

const PromocodeSchema = new Schema(
  {
    name: {
      type: String,
    },
    redeemBy: {
      type: Date,
    },

    maxRedemptions: {
      type: Number,
    },
    percentOff: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Promocode = model("PromoCode", PromocodeSchema, "promocode");

// make this available to our users in our Node applications
module.exports = Promocode;
