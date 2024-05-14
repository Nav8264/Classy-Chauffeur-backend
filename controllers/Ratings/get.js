const Ratings = require("../../models/Ratings");
const { ObjectId } = require("mongoose").Types;

const getRatings = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const { type } = req.query;

    let ratings;

    if (type == "chauffeur") {
      ratings = await Ratings.aggregate([
        {
          $match: {
            chauffeurId: ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "Customer",
            localField: "customerId",
            foreignField: "_id",
            as: "customer",
          },
        },

        {
          $unwind: { path: "$customer", preserveNullAndEmptyArrays: true },
        },

        {
          $project: {
            customer: {
              _id: 0,
              __v: 0,
              notifToken: 0,
              email: 0,
              role: 0,
              byAdmin: 0,
              password: 0,
            },
          },
        },

        {
          $sort: { rating: -1 },
        },
      ]);
    }

    res.json({
      success: true,
      message: "Ratings fetched successfully",
      data: ratings,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getRatings;
