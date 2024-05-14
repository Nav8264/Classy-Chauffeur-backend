const PromoCodes = require("../../../models/PromoCodes");
const { ObjectId } = require("mongoose").Types;

const usePromoCode = async (req, res, next) => {
  try {
    const { code } = req.query;

    const findPromoCode = await PromoCodes.findOne({
      name: code.toString().toUpperCase().trim(),
    });

    if (!findPromoCode) {
      return res.json({ success: false, error: "Invalid promocode" });
    } else {
      const currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Australia/Sydney",
      });

      if (currentDate < findPromoCode.expiryDate) {
        return res.json({
          status: 401,
          success: false,
          error: "Promo Code expired.",
        });
      } else if (findPromoCode.maxRedeems == 0) {
        return res.json({
          status: 403,
          success: false,
          error: "Promo Code not available.",
        });
      } else {
        await PromoCodes.findOneAndUpdate(
          {
            _id: ObjectId(findPromoCode._id),
          },
          {
            maxRedeems: findPromoCode.maxRedeems - 1,
          },
          { new: true }
        );

        res.json({
          success: true,
          message: "Promo Code used successfully.",
          data: findPromoCode,
        });
      }
    }

    // res.json({ success: true, message: "Promo Code used successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = usePromoCode;
