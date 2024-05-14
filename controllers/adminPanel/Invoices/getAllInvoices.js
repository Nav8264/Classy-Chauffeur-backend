const Chauffeur = require("../../../models/Chauffeur");
const Invoice = require("../../../models/Invoice");
const { ObjectId } = require("mongoose").Types;

const getAllInvoices = async (req, res, next) => {
  const { type, id } = req.query;

  const startIndex =
    (req.query.startIndex && parseInt(req.query.startIndex)) || 0;
  const fetchSize =
    (req.query.fetchSize && parseInt(req.query.fetchSize)) || 10;

  try {
    let searchCriteria = {};

    if (type) {
      if (type === "Pending") {
        searchCriteria = {
          status: type,
        };
      } else if (type === "Paid") {
        searchCriteria["$or"] = [
          {
            status: "Paid",
          },
          { status: "Cancelled" },
        ];
      }
      let allInvoices = await Invoice.aggregate([
        {
          $match: searchCriteria,
        },
        {
          $lookup: {
            from: "Customer",
            localField: "billTo",
            foreignField: "_id",
            as: "customer",
          },
        },

        {
          $unwind: { path: "$customer", preserveNullAndEmptyArrays: true },
        },
        {
          $skip: startIndex,
        },
        {
          $limit: fetchSize,
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ]);
      const totalCount = await Invoice.countDocuments(searchCriteria);

      console.log("allInvoices :>> ", allInvoices);
      res.status(200).json({
        message: "Got all Invoices successfully.",
        success: true,
        data: allInvoices,
        totalCount: totalCount,
      });
    } else {
      if (id) {
        let singleInvoice = await Invoice.findOne({
          _id: ObjectId(id),
        });

        res.status(200).json({
          message: "Fetched invoice successfully.",
          success: true,
          data: singleInvoice,
        });
      }
    }
  } catch (err) {
    next(err);
  }
};

module.exports = getAllInvoices;
