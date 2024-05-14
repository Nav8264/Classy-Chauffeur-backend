const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["new-ride", "rating", "reminder"],
      required: true,
    },
    subject: { type: String },
    message: { type: String, required: true },
    avatar: { type: String },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isRead: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Notification = model("Notification", notificationSchema, "notification");

// make this available to our users in our Node applications
module.exports = Notification;
