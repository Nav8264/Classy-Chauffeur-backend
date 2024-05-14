const Promocode = require("../../../models/Promocode");
const { ObjectId } = require("mongoose").Types;

const deletePromocode = async (req, res, next) => {
  try {
    const { id } = req.query;

    await Promocode.findOneAndDelete({
      _id: ObjectId(id),
    });

    res.json({
      message: "Promocode deleted successfully!",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = deletePromocode;
