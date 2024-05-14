const { Schema, model } = require("mongoose");

const Conversation = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    // lastMessage: {
    //   type: String,
    //   requried: true,
    // },
    last_message: { type: Schema.Types.ObjectId, ref: "message" },
    isEnabled: { type: Boolean, default: true },
    readBy: [{ type: Schema.Types.ObjectId }],
  },
  { timestamps: true }
);

module.exports = model("Conversation", Conversation, "Conversation");
