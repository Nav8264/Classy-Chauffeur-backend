const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Ratings = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "Customer" },
    chauffeurId: { type: Schema.Types.ObjectId, ref: "Chauffeur" },
    rating: { type: Number },
    feedback: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ratings", Ratings, "ratings");
