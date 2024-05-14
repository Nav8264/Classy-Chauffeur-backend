const Ride = require("../../../models/Ride");

const getAllRides = async (req, res, next) => {
  const {
    type,
    singleChauffeur,
    newest,
    startDate,
    endDate,
    orderby,
    onlineBookings,
  } = req.query;

  try {
    const startIndex =
      (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const fetchSize =
      (req.query.viewSize && parseInt(req.query.viewSize)) || 10;

    let searchCriteria = {};

    if (singleChauffeur) {
      const { chauffeurID } = req.query;

      // console.log(userId, "allRides");

      const allRides = await Ride.find({
        chauffeurID,
        status: "Pending",

        // date: {
        //   $gte: new Date(),
        // },
      });

      res.status(200).json({
        message: "Success",
        data: allRides,
      });
    } else {
      if (type === "upcoming") {
        searchCriteria["$and"] = [
          {
            status: "Pending",
          },
          {
            date: {
              $gte: new Date(),
              // $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
              // $lte: new Date(new Date().setUTCHours(23, 59, 59, 999)),
            },
          },
        ];
      } else if (type === "pending") {
        searchCriteria["$and"] = [
          {
            status: "Pending",
          },
          {
            date: {
              $lt: new Date(new Date()),
              // $gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
              // $lte: new Date(new Date().setUTCHours(23, 59, 59, 999)),
            },
          },
        ];
      } else if (type === "completed") {
        searchCriteria["$and"] = [
          {
            status: "Completed",
          },
        ];
      } else if (type === "cancelled") {
        searchCriteria["$and"] = [
          {
            status: "Cancelled",
          },
        ];
      } else if (type === "noShow") {
        searchCriteria["$and"] = [
          {
            status: "NoShow",
          },
        ];
      } else if (type === "farmedOut") {
        searchCriteria["$and"] = [
          {
            status: "FarmedOut",
          },
        ];
      }
      if (req.query.keyword || req.query.category) {
        searchCriteria["$or"] = [
          {
            firstName: { $regex: `^${req.query.keyword}`, $options: "i" },
          },
          {
            bookingNo: { $regex: `^BGEM${req.query.keyword}`, $options: "i" },
          },
          {
            bookingNo: { $regex: `${req.query.keyword}`, $options: "i" },
          },
        ];
      }

      if (startDate && startDate !== "Invalid date") {
        const date = new Date(startDate).setUTCHours(0, 0, 0, 0);

        searchCriteria = {
          $and: [
            { ...searchCriteria },
            {
              date: {
                $gte: `${startDate} 00:00:00`,
              },
            },
          ],
        };
      }

      if (endDate && endDate !== "Invalid date") {
        const date = new Date(endDate).setUTCHours(23, 59, 59, 999);

        searchCriteria = {
          $and: [
            { ...searchCriteria },
            {
              date: {
                $lte: `${endDate} 23:59:59`,
              },
            },
          ],
        };
      }

      const allRides = await Ride.aggregate([
        {
          $match: {
            $and: [
              { firstName: { $exists: true } },
              { byAdmin: onlineBookings === "true" ? false : true },
              {
                ...searchCriteria,
              },
            ],
          },
        },
        {
          $lookup: {
            from: "Chauffeur",
            let: { id: "$chauffeurID" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ["$_id", "$$id"] }],
                  },
                },
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
            ],
            as: "ChauffeurDetails",
          },
        },
        {
          $unwind: {
            path: "$ChauffeurDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            date: newest ? 1 : -1,
          },
        },
        {
          $skip: startIndex,
        },
        {
          $limit: fetchSize,
        },
      ]);

      const totalCount = await Ride.aggregate([
        {
          $match: {
            $and: [
              { firstName: { $exists: true } },
              { byAdmin: onlineBookings === "true" ? false : true },
              {
                ...searchCriteria,
              },
            ],
          },
        },
      ]);

      res.json({
        message: "Successfully loaded Rides",
        success: true,
        data: allRides,
        totalCount: totalCount?.length,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = getAllRides;
