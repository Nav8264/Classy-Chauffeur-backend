const Customer = require("../../../models/Customer");
const createError = require("http-errors");

const getAllUser = async (req, res, next) => {
  const startIndex =
    (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
  const fetchSize = (req.query.viewSize && parseInt(req.query.viewSize)) || 10;

  const { type, value } = req.query;

  let searchCriteria;

  if (type) {
    if (type == "account") {
      searchCriteria = {
        "accountNo.value": { $regex: `${value.trim()}` },
      };
    } else {
      searchCriteria = {
        name: { $regex: `${value.trim()}` },
      };
    }
  } else {
    searchCriteria = { byAdmin: true };
  }

  try {
    const allUsers = await Customer.aggregate([
      {
        $match: searchCriteria,
      },
      {
        $skip: startIndex,
      },
      {
        $limit: fetchSize,
      },
    ]);
    const totalCount = await Customer.countDocuments(searchCriteria);
    res.json({
      message: "Users fetched successfully!",
      success: true,
      data: allUsers,
      totalCount: totalCount,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = getAllUser;
