const AdditionalPrice = require("../../../models/AdditionalPrice");

const { ObjectId } = require("mongoose").Types;

const deleteAdditionalPrices = async (req, res, next) => {
  try {
    const { id } = req.query;
    await AdditionalPrice.findOneAndDelete({ _id: ObjectId(id) });

    res.status(200).json({
      message: "Deleted Price successfully!",
      success: true,
    });
  } catch (error) {
    console.log("error: ", error);
    next(error);
  }
};
module.exports = deleteAdditionalPrices;
