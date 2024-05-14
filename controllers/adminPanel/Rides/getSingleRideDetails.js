const { ObjectId } = require("mongoose").Types;
const Ride = require("../../../models/Ride");

const getSingleRideDetails = async (req, res, next) => {
  const { rideID } = req.query;

  console.log(rideID);

  try {
    let rideDetails;
    if (rideID) {
      rideDetails = await Ride.aggregate([
        {
          $match: { _id: ObjectId(rideID) },
        },
        {
          $lookup: {
            from: "Chauffeur",
            localField: "chauffeurID",
            foreignField: "_id",
            as: "chauffeurDetails",
          },
        },
        {
          $unwind: {
            path: "$chauffeurDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "ridePrices",
            localField: "allPrices",
            foreignField: "_id",
            as: "priceDetails",
          },
        },
        {
          $unwind: {
            path: "$priceDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "ride",
            localField: "returnRideId",
            foreignField: "_id",
            as: "returnRide",
          },
        },
        {
          $unwind: {
            path: "$returnRide",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
    }

    res.json({
      message: "yees bro",
      success: true,
      data: rideDetails?.[0],
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = getSingleRideDetails;
