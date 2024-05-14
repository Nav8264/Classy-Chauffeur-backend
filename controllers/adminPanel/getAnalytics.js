const CustomerFeedback = require("../../models/CustomerFeedback");
const Ride = require("../../models/Ride");
const Vehicle = require("../../models/Vehicle");

const getAnalytics = async (req, res, next) => {
  try {
    let ridesDataFacet;

    let earningDataFacet;

    let vehicleData;

    let gte;
    let groupById;
    let ridesEarningAvgById;
    let avgGroupById;

    if (req.query.time == "week") {
      gte = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      groupById = {
        day: { $dayOfWeek: "$date" },
      };
      ridesEarningAvgById = {
        day: { $week: "$date" },
      };
      avgGroupById = {
        day: { $week: "$createdAt" },
      };
    } else if (req.query.time == "month") {
      gte = new Date(Date.now() - 33 * 24 * 60 * 60 * 1000);
      groupById = {
        day: { $dayOfMonth: "$date" },
      };

      ridesEarningAvgById = {
        day: { $month: "$date" },
      };
      avgGroupById = {
        day: { $month: "$createdAt" },
      };
    } else if (req.query.time == "half-year") {
      gte = new Date(Date.now() - 185 * 24 * 60 * 60 * 1000);
      groupById = {
        month: { $month: "$date" },
        year: { $year: "$date" },
      };

      ridesEarningAvgById = {
        day: { $year: "$date" },
      };
      avgGroupById = {
        day: { $year: "$createdAt" },
      };
    } else if (req.query.time == "full-year") {
      gte = new Date(Date.now() - 370 * 24 * 60 * 60 * 1000);
      groupById = {
        month: { $month: "$date" },
        year: { $year: "$date" },
      };
      ridesEarningAvgById = {
        day: { $year: "$date" },
      };
      avgGroupById = {
        day: { $year: "$createdAt" },
      };
    }

    ridesDataFacet = [
      {
        $match: {
          date: {
            $gte: gte,
            $lte: new Date(),
          },
          price: { $ne: null },
        },
      },
      {
        $group: {
          _id: groupById,
          count: { $sum: 1 },
          date: { $first: "$date" },
          price: { $first: "$price" },
        },
      },
      {
        $project: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          count: 1,
          _id: 0,
          price: 1,
        },
      },

      {
        $sort: { date: 1 },
      },
    ];

    earningDataFacet = [
      {
        $match: {
          date: {
            $gte: gte,
            $lte: new Date(),
          },
          price: { $ne: null },
        },
      },
      {
        $group: {
          _id: ridesEarningAvgById,
          paymentsCount: { $sum: 1 },
          date: { $first: "$date" },
          totalEarnings: { $sum: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          date: 1,
          paymentsCount: 1,
          totalEarnings: 1,
        },
      },

      {
        $sort: { date: -1 },
      },
    ];

    const ride = await Ride.aggregate([
      {
        $facet: {
          ridesData: ridesDataFacet,
          earnings: earningDataFacet,
        },
      },
    ]);

    const vehicles = await Vehicle.aggregate([
      {
        $match: {
          createdAt: {
            $gte: gte,
            $lte: new Date(),
          },
        },
      },
      {
        $group: {
          _id: avgGroupById,
          vehicleCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          vehicleCount: 1,
        },
      },
      {
        $sort: { date: -1 },
      },
    ]);

    const feedbacks = await CustomerFeedback.aggregate([
      {
        $match: {
          createdAt: {
            $gte: gte,
            $lte: new Date(),
          },
        },
      },
      {
        $group: {
          _id: avgGroupById,
          feedbackCount: { $sum: 1 },
          date: { $first: "$createdAt" },
        },
      },
      {
        $project: {
          _id: 0,
          feedbackCount: 1,
          date: 1,
        },
      },
      {
        $sort: { date: -1 },
      },
    ]);

    let allData = [];

    allData?.push({
      rides: ride[0]?.ridesData,
      earnings: ride[0]?.earnings[0],
      vehicles: vehicles[0],
      feedbacks: feedbacks[0],
    });

    res.status(200).json({
      success: true,
      data: allData[0],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAnalytics;
