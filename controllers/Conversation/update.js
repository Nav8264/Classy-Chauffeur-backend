const Conversation = require("../../models/Conversation");
const Message = require("../../models/Message.model");
const { ObjectId } = require("mongoose").Types;

const updateMessage = async (req, res, next) => {
  try {
    const { type, messageId, userId, conversationId, otherUserId } = req.body;

    console.log("req.body", req.body);

    if (type == "message") {
      await Message.findOneAndUpdate(
        { _id: ObjectId(messageId) },
        { readBy: [ObjectId(userId)] },
        { new: true }
      );
    } else if (type == "conversation" && conversationId) {
      const conversation = await Conversation.findOne({
        _id: ObjectId(conversationId),
      });

      conversation.readBy = [...conversation.readBy, ObjectId(userId)];

      await conversation.save();

      // await Conversation.findOneAndUpdate(
      //   {
      //     _id: ObjectId(conversationId),
      //   },
      //   { readBy: [ObjectId(userId)] },
      //   { new: true }
      // );
    }

    res.json({ success: true, message: "Updated successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = updateMessage;
