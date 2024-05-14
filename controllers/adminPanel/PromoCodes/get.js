const PromoCodes = require("../../../models/PromoCodes");

const getPromoCodes = async (req, res, next) => {
  try {
    const { startIndex, limit, searchText } = req.query;

    let searchCriteria = {};

    if (searchText) {
      searchCriteria = {
        name: { $regex: `^${searchText}`, $options: "i" },
      };
    }

    const data = await PromoCodes.aggregate([
      {
        $facet: {
          data: [
            {
              $match: searchCriteria,
            },
            {
              $skip: parseInt(startIndex) || 0,
            },
            {
              $limit: parseInt(limit) || 10,
            },
          ],
          count: [
            {
              $count: "total",
            },
          ],
        },
      },
    ]);

    res.json({
      success: true,
      message: "Promo Code fetched successfully.",
      data: data[0].data,
      count: data?.[0]?.count?.[0]?.total,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getPromoCodes;
