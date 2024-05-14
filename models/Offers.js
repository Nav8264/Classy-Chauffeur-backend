const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Offers = new Schema({
  days: {
    type: Number,
    required: false,
    default: 1,
  },
  autoAssign: {
    type: Boolean,
    required: false,
  },
});

const OffersDays = mongoose.model("offerDays", Offers, "offerDays");

// make this available to our orders in our Node applications
module.exports = OffersDays;
