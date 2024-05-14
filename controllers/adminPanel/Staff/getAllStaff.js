const StaffUser = require("../../../models/Staff");

const getAllStaff = async (req, res, next) => {
  try {
    const { query: { keyword } = { keyword: "" } } = req;
    const searchCriteria = {};
    const startIndex =
      (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
    const viewSize = (req.query.viewSize && parseInt(req.query.viewSize)) || 10;
    if (keyword) {
      searchCriteria["$or"] = [
        { name: { $regex: `^${keyword.trim()}`, $options: "i" } },
        { email: { $regex: `^${keyword.trim()}`, $options: "i" } },
        {
          firstName: { $regex: `^${keyword.trim()}`, $options: "i" },
        },
        { lastName: { $regex: `^${keyword.trim()}`, $options: "i" } },
      ];
    }
    if (req.query.status) {
      searchCriteria.status = req.query.status;
    }
    const data = await StaffUser.aggregate([
      { $match: searchCriteria },
      {
        $facet: {
          data: [
            {
              $sort: {
                created_at: -1,
              },
            },
            {
              $lookup: {
                from: "Admin",
                localField: "userId",
                foreignField: "_id",
                as: "userInfo",
              },
            },
            {
              $lookup: {
                from: "Admin",
                localField: "invitedBy",
                foreignField: "_id",
                as: "createdBy",
              },
            },
            {
              $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true },
            },

            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: [{ $arrayElemAt: ["$userInfo", 0] }, "$$ROOT"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                status: 1,
                role: 1,
                address: 1,
                createdBy: { address: 1, email: 1, name: 1 },
                isActive: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                phoneNumber: {
                  countryCode: 1,
                  number: 1,
                },
                name: {
                  $concat: ["$firstName", " ", "$lastName"],
                },
                created_at: 1,
                updated_at: 1,
              },
            },

            { $skip: startIndex },
            { $limit: parseInt(viewSize) },
          ],
          count: [
            {
              $count: "total",
            },
          ],
        },
      },
    ]);
    return res.status(200).send({
      status: true,
      data: data?.[0]?.data,
      count: data?.[0]?.count?.[0]?.total,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getAllStaff;
