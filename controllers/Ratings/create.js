const Chauffeur = require("../../models/Chauffeur");
const Ratings = require("../../models/Ratings");
const sendNotifications = require("../../services/notifications/notification");
const { ObjectId } = require("mongoose").Types;

const createRating = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const { rating, feedback, chauffeurId } = req.body;

    if (chauffeurId) {
      const newRating = Ratings({
        rating,
        feedback,
        chauffeurId,
        customerId: userId,
      });

      await newRating.save();

      const chauffeur = await Chauffeur.findOne({ _id: ObjectId(chauffeurId) });

      if (chauffeur?.notifToken) {
        await sendNotifications({
          title: "New rating",
          body: `Your passenger gave you ${rating} star rating.`,

          data: { type: "rating", url: "UserScreens" },
          token: chauffeur?.notifToken?.toString(),

          receiverId: chauffeurId,
          type: "rating",
        });
      }
    }

    res.json({ success: true, message: "Ratings added successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = createRating;
