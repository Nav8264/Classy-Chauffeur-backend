const VehiclePrice = require("../../../models/VehiclePrice");

const { ObjectId } = require("mongoose").Types;

const deleteVehiclePrice = async (req, res, next) => {
  try {
    const { id } = req.query;
    await VehiclePrice.findOneAndDelete({ _id: ObjectId(id) });

    res.status(200).json({
      message: "Deleted Price successfully!",
      success: true,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};
module.exports = deleteVehiclePrice;
