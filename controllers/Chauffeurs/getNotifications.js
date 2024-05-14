const Notification = require("../../models/Notification");
const { ObjectId } = require("mongoose").Types;

const getNotifications = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const notifications = await Notification.aggregate([
      {
        $match: { receiver: ObjectId(userId) },
      },
      {
        $sort: { created_at: -1 },
      },
    ]);

    res.json({
      message: "Notifications fetched successfully",
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getNotifications;
