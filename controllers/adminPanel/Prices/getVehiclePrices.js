const VehiclePrice = require("../../../models/VehiclePrice");
const createError = require("http-errors");

const getVehiclePrices = async (req, res, next) => {
  try {
    const { priceId } = req.query;

    let vehiclePrice;
    let searchCriteria = {};

    if (req.query.keyword) {
      searchCriteria = {
        ...searchCriteria,
        category: { $regex: `^${req.query.keyword}`, $options: "i" },
      };
    }

    if (priceId) {
      vehiclePrice = await VehiclePrice.findOne({ _id: priceId });
    } else {
      vehiclePrice = await VehiclePrice.aggregate([
        { $match: searchCriteria },
        { $sort: { createdAt: -1 } },
      ]);
    }

    const totalCount = await VehiclePrice.countDocuments(searchCriteria);
    res.json({
      message: " Vehicle Prices fetched successfully.",
      success: true,
      totalCount: totalCount,
      data: vehiclePrice,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getVehiclePrices;
