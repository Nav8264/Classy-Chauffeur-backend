const { Schema, model } = require("mongoose");

const ContactForm = new Schema(
  {
    name: {
      type: String,
      requried: true,
    },
    email: {
      type: String,
      requried: true,
    },
    phone: {
      type: Number,
      requried: true,
    },
    message: {
      type: String,
    },
    subject: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("ContactForm", ContactForm, "ContactForm");
