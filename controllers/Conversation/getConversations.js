const Conversation = require("../../models/Conversation");
const { ObjectId } = require("mongoose").Types;

const getConversations = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { type } = req.query;

    const conversations = await Conversation.aggregate([
      {
        $match: { members: { $in: [ObjectId(userId)] } },
      },
      {
        $lookup: {
          from: type,
          localField: "members",
          foreignField: "_id",
          as: "userDetails",
        },
      },

      {
        $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: "message",
          localField: "last_message",
          foreignField: "_id",
          as: "lastMessageDetails",
        },
      },

      {
        $unwind: { path: "$lastMessageDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          readBy: 1,
          userDetails: {
            _id: 1,
            avatar_url: 1,
            email: 1,
            name: 1,
            phone: 1,
            vehicleType: 1
          },
          lastMessageDetails: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.json({
      message: "Conversations fetched successfully.",
      data: conversations,
    });
  } catch (err) {
    next(err);
    console.log("err", err);
  }
};

module.exports = getConversations;
