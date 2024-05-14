const VehiclePrice = require("../../../models/VehiclePrice");
const createError = require("http-errors");
const Vehicle = require("../../../models/Vehicle");

const updateVehiclePrices = async (req, res, next) => {
  try {
    const { priceId } = req.query;

    const { category, title, fixedKm, fixedPrice, pricePerKm, pricePerHour } =
      req.body;

    const findCategory = await VehiclePrice.findOne({ _id: priceId });

    if (!findCategory) {
      next(createError.NotFound("Pricing category not found."));
    } else {
      const vehicles = await Vehicle.find({ category });

      if (vehicles.length != 0) {
        for (let x of vehicles) {
          await Vehicle.findOneAndUpdate(
            { _id: x._id },
            {
              title,
              fixedKm: parseInt(fixedKm),
              fixedPrice: parseInt(fixedPrice),
              pricePerKm: parseInt(pricePerKm),
              pricePerHour: parseInt(pricePerHour),
            },
            { new: true }
          );
        }
      }

      await VehiclePrice.findOneAndUpdate(
        { _id: priceId },
        { ...req.body },
        { new: true }
      );

      res.json({
        message: "New Vehicle Price updated successfully.",
        success: true,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = updateVehiclePrices;
