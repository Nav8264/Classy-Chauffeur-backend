const Conversation = require("../models/Conversation");
const Message = require("../models/Message.model");

const { ObjectId } = require("mongoose").Types;

module.exports = (io) => {
  io.on("connect", (socket) => {
    console.log("socket is connected", socket.id);
    socket.on("join", async (data, callBack) => {
      socket.join(data)
    });

    socket.on("read-message", async (data) => {
      await Message.findOneAndUpdate(
        { _id: data?.message },
        { readBy: [{ user: ObjectId(data?.userId) }] },
        { new: true }
      );
    });

    socket.on("read-conversation", async (data) => {
      // console.log('read-conversation', data )
      await Conversation.findOneAndUpdate(
        {
          _id: data?.id,
          // readBy: { $nin: [ObjectId(data?.userId)] },
        },
        { readBy: [data?.userId, data?.otherUserId] },
        { new: true }
      );
    });

    /// Admin join to get live location of Chauffeur
    socket.on("join-admin", async (data) => {
      console.log("data", data);
      socket.join(`admin-${data?.rideId?.toString()}`);
    });

    /// Admin leaves the live location of Chauffeur
    socket.on("leave-admin", async (data) => {
      console.log("data", data);
      socket.leave(`admin-${data?.rideId?.toString()}`);
    });

    socket.on("my-location", async (data) => {
      socket.to(data?.customerId?.toString()).emit("get-location", {
        ...data,
      });
      socket.to(`admin-${data?.rideId?.toString()}`).emit("location-to-admin", {
        ...data,
      });
      console.log("location- data", data);
    });
  });
};
