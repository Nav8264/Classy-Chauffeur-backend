const dayjs = require("dayjs");
const Chauffeur = require("../../models/Chauffeur");
const VehicleModel = require("../../models/Vehicle");
const OffersDays = require("../../models/Offers");
const Ride = require("../../models/Ride");
const { ObjectId } = require("mongoose").Types;
const geolib = require("geolib");

const getAllRides = async (req, res, next) => {
  try {
    const { type, lat, long, chauffeurId } = req.query;
    const { _id: userId } = req.user;
    console.log("type", type);
    const startIndex =
      (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const fetchSize =
      (req.query.fetchSize && parseInt(req.query.fetchSize)) || 10;

    const searchCriteria = {};

    const offerDays = await OffersDays.find();

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

    if (type == "offers") {
      const offerDays = await OffersDays.find();
      const showOffers = offerDays?.[0]?.autoAssign;
      if (showOffers) {
        const endDate = new Date(
          Date.now() + (offerDays?.[0]?.days || 2) * 24 * 60 * 60 * 1000
        ).setUTCHours(23, 59, 59, 999);

        console.log("endDate", dayjs(endDate).format("YYYY-MM-DD"));

        searchCriteria["$and"] = [
          { rejectedBy: { $nin: [ObjectId(userId)] } },
          {
            $or: [{ chauffeurID: { $exists: false } }, { chauffeurID: null }],
          },
          {
            chauffeurStatus: "Pending",
          },
          {
            status: { $in: ["Booked", "Pending", "FarmedOut"] },
          },
          {
            $or: [
              {
                paymentStatus: "Completed",
              },
              {
                byAdmin: true,
              },
            ],
          },
          {
            date: {
              $gte: new Date().toISOString().slice(0, 19).replace("T", " "),
            },
          },
          {
            date: {
              $lte: new Date(endDate)
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            },
          },
        ];
      } else {
        res.json({
          message: "Successfully loaded Rides",
          success: true,
          data: [],
        });
        return;
      }
    } else if (type == "signage") {
      searchCriteria["$and"] = [
        { chauffeurID: ObjectId(userId) },

        {
          status: { $in: ["Booked", "Pending", "FarmedOut"] },
        },

        {
          rideType: "Airport-Pickup/Drop",
        },

        {
          date: {
            $gte: new Date().toISOString().slice(0, 19).replace("T", " "),
          },
        },
      ];
    } else if (type === "today") {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      );

      searchCriteria["$and"] = [
        { chauffeurID: ObjectId(userId) },
        { status: { $in: ["Booked", "Pending", "FarmedOut"] } },
        {
          date: {
            $gte: startOfDay.toISOString().slice(0, 19).replace("T", " "),
          },
        },
        {
          date: { $lt: endOfDay.toISOString().slice(0, 19).replace("T", " ") },
        },
      ];
    } else if (type === "upcoming") {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      );
      searchCriteria["$and"] = [
        { chauffeurID: ObjectId(userId) },
        {
          status: { $in: ["Booked", "Pending", "FarmedOut"] },
        },
        {
          date: {
            $gte: startOfDay.toISOString().slice(0, 19).replace("T", " "),
          },
        },
      ];
    } else if (type === "pending") {
      searchCriteria["$and"] = [
        { chauffeurID: ObjectId(userId) },

        {
          status: "Pending",
        },
        {
          date: {
            $lt: new Date().toISOString().slice(0, 19).replace("T", " "),
          },
        },
      ];
    } else if (type === "completed") {
      searchCriteria["$and"] = [
        { chauffeurID: ObjectId(userId) },

        {
          status: "Completed",
        },
      ];
    } else if (type === "cancelled") {
      searchCriteria["$and"] = [
        // { chauffeurID: ObjectId(userId) },

        // {
        //   status: "Cancelled",
        // },
        { rejectedBy: { $in: [userId] } },
      ];
    } else if (type === "cancelledByCustomer") {
      searchCriteria["$and"] = [
        { chauffeurID: ObjectId(userId) },

        {
          status: "CancelledByCustomer",
        },
      ];
    } else if (type === "noShow") {
      searchCriteria["$and"] = [
        { chauffeurID: ObjectId(userId) },

        {
          status: "NoShow",
        },
      ];
    } else if (type === "past") {
      searchCriteria["$and"] = [
        { chauffeurID: ObjectId(userId) },
        {
          date: {
            $lt: new Date().toISOString().slice(0, 19).replace("T", " "),
          },
        },
      ];
    }
    if (req.query.keyword || req.query.category) {
      searchCriteria["$or"] = [
        {
          firstName: { $regex: `^${req.query.keyword}`, $options: "i" },
        },
      ];
    }

    let allRides = await Ride.aggregate([
      {
        $match: {
          ...searchCriteria,
        },
      },
      // {
      //   $lookup: {
      //     from: "Chauffeur",
      //     let: { id: "$chauffeurID" },
      //     pipeline: [
      //       {
      //         $match: {
      //           $expr: {
      //             $and: [{ $eq: ["$_id", "$$id"] }],
      //           },
      //         },
      //       },
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
      {
        $sort: {
          date: type == "past" || type == "pending" ? -1 : 1,
          date: type == "past" || type == "pending" ? -1 : 1,
        },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: fetchSize,
      },
    ]);

    // / ordering rides by distance
    if (type == "offers") {
      const newRides = [];
      for (let x of allRides) {
        // lat=-27.381146&long=152.6635466
        /// here we check if ride is withing 500 kms to the isPointWithinRadius.

        const checkRadius = geolib.isPointWithinRadius(
          {
            latitude: x.pickupLocation?.pickUpCoords?.lat,
            longitude: x.pickupLocation?.pickUpCoords?.lng,
          },
          {
            latitude: lat,
            longitude: long,
          },
          500000
        );
        if (checkRadius) {
          const checkChauffer = await Chauffeur.findOne({
            _id: ObjectId(chauffeurId),
          });
          const checkVehicle = await VehicleModel.findOne({
            _id: ObjectId(checkChauffer?.vehicleId),
          });

          if (checkVehicle?.category && x?.vehicleType) {
            getRideType(checkVehicle?.category, x?.vehicleType, x, newRides);
          }
          // allRides = newRides;
        }
      }
      allRides = newRides;
    }
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

module.exports = getAllRides;

function getRideType(chauffeurCategory, rideCategory, x, newRides) {
  // console.log("chauffeurCategory", chauffeurCategory, rideCategory);
  if (
    (chauffeurCategory === "EXECUTIVE SEDAN" ||
      chauffeurCategory === "LUXURY SUV" ||
      chauffeurCategory === "LUXURY VAN" ||
      chauffeurCategory === "FIRST CLASS" ||
      chauffeurCategory === "BUSINESS CLASS" ||
      chauffeurCategory === "BUSINESS CLASS SUV" ||
      chauffeurCategory === "SUV") &&
    rideCategory === "EXECUTIVE SEDAN"
  ) {
    newRides.push(x);
  } else if (
    chauffeurCategory === "FIRST CLASS" &&
    rideCategory === "FIRST CLASS"
  ) {
    newRides.push(x);
  } else if (
    (chauffeurCategory === "BUSINESS CLASS" ||
      chauffeurCategory === "BUSINESS CLASS SUV" ||
      chauffeurCategory === "FIRST CLASS") &&
    rideCategory === "BUSINESS CLASS"
  ) {
    newRides.push(x);
  } else if (
    (chauffeurCategory === "LUXURY SUV" ||
      chauffeurCategory === "FIRST CLASS" ||
      chauffeurCategory === "BUSINESS CLASS" ||
      chauffeurCategory === "BUSINESS CLASS SUV" ||
      chauffeurCategory === "SUV") &&
    rideCategory === "LUXURY SUV"
  ) {
    newRides.push(x);
  } else if (
    chauffeurCategory === "STRETCH LIMO" &&
    rideCategory === "STRETCH LIMO"
  ) {
    newRides.push(x);
  } else if (
    chauffeurCategory === "LUXURY VAN" &&
    rideCategory === "LUXURY VAN"
  ) {
    newRides.push(x);
  } else if (
    chauffeurCategory === "BUSINESS CLASS SUV" &&
    rideCategory === "BUSINESS CLASS SUV"
  ) {
    newRides.push(x);
  } else if (
    chauffeurCategory === "SPRINTER BUS" &&
    rideCategory === "SPRINTER BUS"
  ) {
    newRides.push(x);
  } else if (
    (chauffeurCategory === "SPRINTER BUS" ||
      chauffeurCategory === "SPRINTER VAN") &&
    rideCategory === "SPRINTER VAN"
  ) {
    newRides.push(x);
  } else if (
    chauffeurCategory === "PEOPLE MOVER" &&
    rideCategory === "PEOPLE MOVER"
  ) {
    newRides.push(x);
  }
}
