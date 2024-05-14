const dayjs = require("dayjs");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message.model");
const { ObjectId } = require("mongoose").Types;

const deletePreviousMessages = async () => {
  console.log("agenda chalya");
  try {
    const getAllConversations = await Conversation.find({ isEnabled: true });

    for (const x of getAllConversations) {
      const message = await Message.findOne({ _id: ObjectId(x.last_message) });
      if (message) {
        const diffInDays = dayjs(message.createdAt).diff(dayjs(), "day");
        console.log(diffInDays);
        if (diffInDays < -2) {
          await Conversation.findOneAndUpdate(
            { _id: ObjectId(x._id) },
            { isEnabled: false },
            { new: true }
          );
        }
      }
    }
  } catch (error) {
    return error;
  }
};
module.exports = deletePreviousMessages;
