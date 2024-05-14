const Chauffeur = require("../../../models/Chauffeur");
const Customer = require("../../../models/Customer");

const { ObjectId } = require("mongoose").Types;

const saveNotificationToken = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { token, type, location } = req.body;

    let userLocation = {};

    if (location) {
      userLocation = { location };
    }

    if (type == "chauffeur") {
      await Chauffeur.findOneAndUpdate(
        { _id: ObjectId(userId) },
        {
          notifToken: token,
          ...userLocation,
        },
        { new: true }
      );
    } else if (type == "customer") {
      await Customer.findOneAndUpdate(
        { _id: ObjectId(userId) },
        {
          notifToken: token,
        },
        { new: true }
      );
    }

    res.json({ message: "Token added Successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = saveNotificationToken;
