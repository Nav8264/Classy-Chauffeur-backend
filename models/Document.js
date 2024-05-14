const { Schema, model } = require("mongoose");

const documents = new Schema(
  {
    chauffeurId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    documentNumber: { type: String },
    documentName: { type: String },

    documents: {
      documentName: { type: String },
      url: { type: String },
      status: {
        type: String,
        default: "Pending",
        enum: ["Pending", "Accepted", "Rejected"],
      },
      type: { type: String },
    },

    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Rejected"],
    },
  },
  { timestamps: true }
);

module.exports = model("document", documents, "document");
