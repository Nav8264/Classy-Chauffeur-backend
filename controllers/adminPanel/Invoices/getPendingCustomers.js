const Customer = require("../../../models/Customer");

const getPendingCustomers = async (req, res, next) => {
  try {
    const data = await Customer.aggregate([
      {
        $lookup: {
          from: "ride",
          localField: "email",
          foreignField: "email",
          as: "rides",
        },
      },
      {
        $match: {
          byAdmin: true,
          // "rides.status": "Pending",
          // "rides.paymentStatus": "Pending",
          // "rides.invoiceSent": false,
        },
      },
      {
        $lookup: {
          from: "ride",
          let: { email: "$email" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$email", "$$email"] },
                    { $eq: ["$invoiceSent", false] },
                    { $eq: ["$status", "Pending"] },
                    { $eq: ["$paymentStatus", "Pending"] },
                  ],
                },
              },
            },
          ],
          as: "rides",
        },
      },
    ]);

    res.json({
      success: true,
      data: data.filter((item) => item?.rides?.length > 0),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = getPendingCustomers;
