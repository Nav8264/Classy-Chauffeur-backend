const { Schema, model } = require("mongoose");

const Response = new Schema({
  feedbackId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  adminName: {
    type: String,
    // required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
});

module.exports = model("Response", Response);
