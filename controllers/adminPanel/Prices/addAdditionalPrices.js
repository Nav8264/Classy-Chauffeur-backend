const createError = require("http-errors");
const AdditionalPrice = require("../../../models/AdditionalPrice");

const addAdditionalPrices = async (req, res, next) => {
  console.log(req.body);
  try {
    const { rateName, amount } = req.body;

    const findAdditionalPrice = await AdditionalPrice.findOne({ rateName });

    if (findAdditionalPrice) {
      next(createError.NotFound("Category already exists."));
    } else {
      const newAdditionalPrice = new AdditionalPrice({
        ...req.body,
      });

      await newAdditionalPrice.save();

      res.json({
        message: "New Additional Price added successfully.",
        success: true,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = addAdditionalPrices;
