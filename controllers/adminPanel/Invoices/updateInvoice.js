const createHttpError = require("http-errors");
const Invoice = require("../../../models/Invoice");
const { ObjectId } = require("mongoose").Types;
const updateInvoice = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.query;

    if (!status) {
      throw createHttpError.BadRequest("Select status");
    }
    await Invoice.findOneAndUpdate(
      {
        _id: ObjectId(id),
      },
      { status: status },
      { new: true }
    );

    res.json({
      message: "Invoice updated successfully!",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = updateInvoice;
