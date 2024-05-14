const Ride = require("../../../models/Ride");
const RidePrice = require("../../../models/RidePrices");
const { ObjectId } = require("mongoose").Types;

const deleteRide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findOne({ _id: ObjectId(id) });
    await Ride.findOneAndDelete({ _id: ObjectId(id) });

    if (ride?.allPrices) {
      await RidePrice.findOneAndDelete({ _id: ObjectId(ride?.allPrices) });
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};

module.exports = deleteRide;
