const Ride = require("../../models/Ride");

const { ObjectId } = require("mongoose").Types;

const getAllBookedRides = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const { status, email } = req.query;

    console.log("status", status);

    const startIndex =
      (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const fetchSize =
      (req.query.fetchSize && parseInt(req.query.fetchSize)) || 10;

    const projectValues = {
      _id: 1,
      firstName: 1,
      email: 1,
      countryCode: 1,
      phoneNo: 1,
      pickupLocation: {
        name: 1,
      },
      dropLocation: {
        name: 1,
      },
      addStop: 1,
      status: 1,
      chauffeurStatus: 1,
      date: 1,
      time: 1,
      price: 1,
      paymentStatus: 1,
      paymentType: 1,
      totalRideDistance: 1,
      passengers: 1,
      luggage: 1,
      passengerRating: 1,
      vehicleId: 1,
      chauffeurID: 1,
      vehicleType: 1,
      onlineRideStatus: 1,
      vehicleDetails: {
        _id: 1,
        vehicleImage: 1,
        vehicleName: 1,
        vehicleLogo: 1,
        category: 1,
      },

      chauffeurDetails: {
        _id: 1,
        name: 1,
        email: 1,
        avatar_url: 1,
        countryCode: 1,
        phone: 1,
      },
      numberOfHours: 1,
      priceDetails: 1,
      bookingNo: 1,
    };

    const searchCriteria = {};

    if (status) {
      if (status == "Upcoming") {
        searchCriteria["$and"] = [
          // { email },
          { $or: [{ email }, { bookedByEmail: email }] },
          { status: "Pending" },
          {
            $or: [
              { paymentStatus: "Completed" },
              { byAdmin: true },
              { paymentMethod: "Cash" },
              { paymentMethod: "Invoice" },
            ],
          },
          {
            $expr: {
              $gte: [{ $dateFromString: { dateString: "$date" } }, new Date()],
            },
          },
        ];
      } else if (status == "Past") {
        searchCriteria["$and"] = [
          { email },
          {
            paymentStatus: "Completed",
          },
          {
            $expr: {
              $lte: [{ $dateFromString: { dateString: "$date" } }, new Date()],
            },
          },
        ];
      } else if (status == "Cancelled") {
        searchCriteria["$and"] = [
          { email },
          { status: "Cancelled" },
          {
            paymentStatus: "Completed",
          },
        ];
      } else if (status == "Started") {
        searchCriteria["$and"] = [
          { email },
          { status: "Started" },
          {
            paymentStatus: "Completed",
          },
        ];
      }

      let rides;
      rides = await Ride.aggregate([
        {
          $match: searchCriteria,
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
            from: "Chauffeur",
            localField: "chauffeurID",
            foreignField: "_id",
            as: "chauffeurDetails",
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
        {
          $project: projectValues,
        },

        {
          $skip: startIndex,
        },
        {
          $limit: fetchSize,
        },
        {
          $sort: { date: 1 },
        },
      ]);

      res.json({
        message: "Booked rides fetched successfully.",
        data: rides,
      });
    } else {
      const rides = await Ride.aggregate([
        {
          $match: {
            $and: [
              { email },
              { status: "Pending" },
              { paymentStatus: "Completed" },
              {
                date: { $gte: new Date() },
              },
            ],
          },
        },
        {
          $project: projectValues,
        },
      ]);

      res.json({
        message: "Booked rides fetched successfully.",
        data: rides,
      });
    }
  } catch (err) {
    next(err);
    console.log("err", err);
  }
};

module.exports = getAllBookedRides;
