const CustomerFeedback = require("../../../models/CustomerFeedback");

const getCustomerFeedback = async function (req, res, next) {
  try {
    let searchCriteria = {};

    const startIndex =
      (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const viewSize = (req.query.viewSize && parseInt(req.query.viewSize)) || 10;
    console.log("startIndex", startIndex);
    console.log("viewSize", viewSize);
    if (req.query.isActive) {
      if (req.query.isActive === "true") {
        searchCriteria.isActive = true;
      }
      if (req.query.isActive === "false") {
        searchCriteria.isActive = false;
      }
    }

    if (req.query.keyword) {
      searchCriteria["$or"] = [
        {
          customerName: { $regex: `^${req.query.keyword}`, $options: "i" },
        },
        {
          feedback: { $regex: `^${req.query.keyword}`, $options: "i" },
        },
      ];
    }
    const getFeedback = await CustomerFeedback.aggregate([
      {
        $match: { $and: [{ responded: false }, searchCriteria] },
      },

      //Lookup for Created by
      {
        $lookup: {
          from: "Customer",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          __v: 0,
          customer: {
            createdAt: 0,
            updatedAt: 0,
            _id: 0,
            __v: 0,
            role: 0,
            password: 0,
          },
        },
      },

      {
        $skip: startIndex,
      },
      {
        $limit: viewSize,
      },
      // {
      //   count: [
      //     {
      //       $count: "total",
      //     },
      //   ],
      // },
      {
        $sort: { createdAt: 1 },
      },
    ]);
    const totalCount = await CustomerFeedback.aggregate([
      {
        $match: { $and: [{ responded: false }, searchCriteria] },
      },
    ]);

    res.status(200).json({
      data: getFeedback,
      count: totalCount?.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getCustomerFeedback;
