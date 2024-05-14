const PromoCodes = require("../../../models/PromoCodes");
const { ObjectId } = require("mongoose").Types;

const updatePromoCode = async (req, res, next) => {
  try {
    const { isDelete, id } = req.query;

    if (isDelete) {
      await PromoCodes.findOneAndDelete({ _id: ObjectId(id) });
    } else {
      const { name, expiryDate, maxRedeems, percentOff } = req.body;

      await PromoCodes.findOneAndUpdate(
        { _id: ObjectId(id) },
        {
          name: name.toString().toUpperCase().trim(),
          expiryDate,
          maxRedeems,
          percentOff,
        },
        { new: true }
      );
    }

    res.json({ success: true, message: "Promo Code updated successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = updatePromoCode;
