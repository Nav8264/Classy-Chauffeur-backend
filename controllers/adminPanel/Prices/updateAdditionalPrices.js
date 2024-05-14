const AdditionalPrice = require("../../../models/AdditionalPrice");

const createError = require("http-errors");

const updateAdditionalPrices = async (req, res, next) => {
  try {
    const { priceId } = req.query;

    const findAdditionalPrice = await AdditionalPrice.findOne({ _id: priceId });

    if (!findAdditionalPrice) {
      next(createError.NotFound("Pricing category not found."));
    } else {
      await AdditionalPrice.findOneAndUpdate(
        { _id: priceId },
        { ...req.body },
        { new: true }
      );

      // await newAdditionalPrice.save();

      res.json({
        message: "New Additional Price updated successfully.",
        success: true,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = updateAdditionalPrices;
