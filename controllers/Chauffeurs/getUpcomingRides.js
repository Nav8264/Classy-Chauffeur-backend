const dayjs = require("dayjs");
const Chauffeur = require("../../models/Chauffeur");
const VehicleModel = require("../../models/Vehicle");
const OffersDays = require("../../models/Offers");
const Ride = require("../../models/Ride");
const { ObjectId } = require("mongoose").Types;
const geolib = require("geolib");

const getUpcomingRides = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const startIndex =
      (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const fetchSize =
      (req.query.fetchSize && parseInt(req.query.fetchSize)) || 10;

    const chauffeur = await Chauffeur.findOne({ _id: ObjectId(userId) });

    // let setChauffeurPrice = {
    //   $set: {
    //     chauffeurPrice: {
    //       $round: ["$chauffeurPrice", 1],
    //     },
    //   },
    // };
    let setChauffeurPrice = {
      $set: {
        chauffeurPrice: {
          $round: [
            {
              $sum: {
                $divide: [
                  {
                    $multiply: [
                      chauffeur.chauffeurPrice || 40,
                      "$priceDetails.flatRate",
                    ],
                  },
                  100,
                ],
              },
            },
            1,
          ],
        },
      },
    };

    let allRides = await Ride.aggregate([
      {
        $match: {
          $and: [
            { chauffeurID: ObjectId(userId) },
            { status: { $in: ["Booked", "Pending", "FarmedOut"] } },
          ],
        },
      },

      {
        $sort: {
          date: 1,
        },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: fetchSize,
      },
      {
        $lookup: {
          from: "vehicle",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicleDetails",
        },
      },
      {
        $unwind: {
          path: "$vehicleDetails",
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
      setChauffeurPrice,
      {
        $project: {
          priceDetails: 0,
        },
      },
    ]);

    console.log("allRides", allRides);
    res.json({
      message: "Successfully loaded Rides",
      success: true,
      data: allRides,
    });
  } catch (err) {
    next(err);
    console.log("err", err);
  }
};

module.exports = getUpcomingRides;
