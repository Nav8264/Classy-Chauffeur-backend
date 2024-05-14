const { ObjectId } = require("mongoose").Types;
const Vehicle = require("../../../models/Vehicle");

const getSingleVehicleDetails = async (req, res, next) => {
  const { vehicleID } = req.query;

  try {
    // const vehicleDetails = await Vehicle.aggregate([
    //   { $match: { _id: ObjectId(vehicleID) } },
    //   {
    //     $lookup: {
    //       from: "VehicleDetails",
    //       localField: "otherDetails",
    //       foreignField: "_id",
    //       as: "fullDetails",
    //     },
    //   },
    //   {
    //     $unwind: { path: "$fullDetails", preserveNullAndEmptyArrays: true },
    //   },
    // ]);

    const vehicleDetails = await Vehicle.findOne({ _id: ObjectId(vehicleID) });

    res.json({
      message: "Fetched vehicle successfully",
      success: true,
      data: vehicleDetails,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getSingleVehicleDetails;
