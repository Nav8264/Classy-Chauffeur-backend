const Ride = require("../../../models/Ride");
const { ObjectId } = require("mongoose").Types;

const generateReports = async (req, res, next) => {
  try {
    const startIndex =
      (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const fetchSize = (req.query.viewSize && parseInt(req.query.viewSize)) || 0;

    const { type } = req.query;

    let pagination = [];

    /**
     * This is for when download it will not give data in pagination
     */
    if (type != "download") {
      pagination.push(
        {
          $skip: startIndex,
        },
        {
          $limit: fetchSize,
        }
      );
    }

    const {
      paymentStatus,
      vehicleType,
      car,
      driver,
      serviceType,
      airports,
      dateFrom,
      dateTo,

      /** Status */
      arrived,
      cancelled,
      customerInCar,
      done,
      noShow,
      partnerOffer,
      unassigned,
      lateCancel,
    } = req.body;

    let searchCriteria = {};

    searchCriteria["$and"] = [
      paymentStatus ? { paymentStatus } : {},
      vehicleType ? { vehicleType } : {},
      car ? { vehicleId: ObjectId(car) } : {},
      driver ? { chauffeurID: ObjectId(driver) } : {},
      serviceType ? { rideType: serviceType } : {},
      airports ? { airportId: airports } : {},

      {
        date: {
          $gte: new Date(dateFrom).toISOString().slice(0, 19).replace("T", " "),
        },
      },
      {
        date: {
          $lte: new Date(dateTo).toISOString().slice(0, 19).replace("T", " "),
        },
      },

      arrived ? { chauffeurStatus: arrived } : {},
      cancelled ? { status: cancelled } : {},
      customerInCar ? { status: customerInCar } : {},
      done ? { status: done } : {},
      noShow ? { status: noShow } : {},
      partnerOffer ? { status: partnerOffer } : {},
      unassigned ? { chauffeurID: { $exists: false } } : {},
      lateCancel ? { lateCancel: lateCancel } : {},
    ];

    const getReports = await Ride.aggregate([
      {
        $match: searchCriteria,
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

      ...pagination,
    ]);

    const totalCount = await Ride.aggregate([
      {
        $match: searchCriteria,
      },
    ]);
    let totalPrice = 0;
    getReports?.map((val) => {
      totalPrice += Number(val?.price || 0);
    });

    res.json({
      success: true,
      totalCount: totalCount?.length,
      dateFrom,
      dateTo,
      data: getReports,
      totalPrice,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = generateReports;
