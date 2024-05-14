const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const readByRecipientSchema = new Schema(
  {
    _id: false,
    user: { type: Schema.Types.ObjectId, required: true },
    read_at: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
  }
);

const MessageSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["text", "image", "video", "audio", "post", "document"],
    },
    message: { type: String, required: true },
    postMessage: { type: Schema.Types.ObjectId, ref: "Conversation" },
    sender: { type: Object, required: true },
    receiver: { type: Object, required: true },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      // required: true,
    },
    // read_by: [readByRecipientSchema],
    readBy: [{ type: Schema.Types.ObjectId }],

    deleted_by: [{ type: Schema.Types.ObjectId }],
    // reference_id: { type: String, unique: true },
  },

  { timestamps: true }
);
// the schema is useless so far
// we need to create a model using it
const Message = mongoose.model("Message", MessageSchema, "message");

// make this available to our users in our Node applications
module.exports = Message;
