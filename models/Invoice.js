const { Schema, model } = require("mongoose");

const invoice = new Schema(
  {
    billTo: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    date: { type: Date },
    invoiceNo: { type: Number },
    currency: { type: String, default: "$AUD" },

    pdf: {
      type: Object,
    },

    rides: [
      {
        type: Schema.Types.ObjectId,
        ref: "ride",
      },
    ],

    customerMessage: { type: String },
    invoiceNotes: { type: String },

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Paid", "Cancelled"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Invoice = model("Invoice", invoice, "invoice");

// make this available to our users in our Node applications
module.exports = Invoice;
