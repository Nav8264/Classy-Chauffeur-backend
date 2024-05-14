const VehiclePrice = require("../../../models/VehiclePrice");
const createError = require("http-errors");

const addVehiclePrices = async (req, res, next) => {
  try {
    const { category, title, fixedKm, fixedPrice, pricePerKm, pricePerHour } =
      req.body;

    const findCategory = await VehiclePrice.findOne({ category });

    if (findCategory) {
      next(createError.NotFound("Category already exists."));
    } else {
      const newCategory = new VehiclePrice({
        category,
        title,
        fixedKm: parseInt(fixedKm),
        fixedPrice: parseInt(fixedPrice),
        pricePerKm: parseInt(pricePerKm),
        pricePerHour: parseInt(pricePerHour),
        ...req.body,
      });

      await newCategory.save();

      res.json({
        message: "New Vehicle Price added successfully.",
        success: true,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = addVehiclePrices;
