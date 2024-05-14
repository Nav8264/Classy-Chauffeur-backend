const AdditionalPrice = require("../../../models/AdditionalPrice");

const createError = require("http-errors");

const getAdditionalPrices = async (req, res, next) => {
  try {
    const { priceId } = req.query;
    let searchCriteria = {};

    let additionalPrice;

    if (req.query.keyword) {
      searchCriteria = {
        rateName: { $regex: `^${req.query.keyword}`, $options: "i" },
      };
    }

    if (priceId) {
      additionalPrice = await AdditionalPrice.findOne({ _id: priceId });
    } else {
      additionalPrice = await AdditionalPrice.aggregate([
        { $match: searchCriteria },
        { $sort: { createdAt: -1 } },
      ]);
    }

    const totalCount = await AdditionalPrice.countDocuments();

    res.json({
      message: " Vehicle Prices  fetched successfully.",
      success: true,
      totalCount: totalCount,
      data: additionalPrice,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAdditionalPrices;
