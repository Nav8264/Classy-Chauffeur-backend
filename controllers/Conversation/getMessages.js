const Conversation = require("../../models/Conversation");
const Message = require("../../models/Message.model");
const { ObjectId } = require("mongoose").Types;

const getMessages = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const { otherUserId, conversationId, mySelf } = req.query;

    const startIndex =
      (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const fetchSize =
      (req.query.fetchSize && parseInt(req.query.fetchSize)) || 15;

    let conversation;

    if (!conversationId) {
      const checkConvo = await Conversation.findOne({
        $and: [
          {
            members: { $all: [userId, otherUserId] },
          },
          {
            isEnabled: true,
          },
        ],
      });

      if (checkConvo) {
        conversation = checkConvo._id;
      }
    } else {
      const convo = await Conversation.findOne({
        _id: ObjectId(conversationId),
      });
      console.log("convo", convo);
      if (convo?.isEnabled) {
        conversation = conversationId;
      }
    }

    const messages = await Message.aggregate([
      {
        $match: {
          conversation: ObjectId(conversation),
        },
      },

      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: 10,
      },
    ]);

    res.json({
      message: "Fetched all messages",
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getMessages;
