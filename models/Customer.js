const { Schema, model } = require("mongoose");

const Customer = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar_url: {
      type: String,
    },
    phone: {
      type: Schema.Types.Number,
      // required: true,
    },
    countryCode: {
      type: String,
      // required: true,
    },
    role: {
      type: String,
      required: true,
      default: "WebCustomer",
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },

    appleId: {
      type: String,
    },

    byAdmin: {
      type: Boolean,
      default: false,
    },
    stripe_customer_id: {
      type: String,
    },

    notifToken: {
      type: String,
    },

    accountNo: {
      type: Object,
    },
    // TODO: use verification false as default when sending mail to verify password
    // isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("Customer", Customer, "Customer");
