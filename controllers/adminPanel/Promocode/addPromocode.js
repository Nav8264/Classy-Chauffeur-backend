const Promocode = require("../../../models/Promocode");

const addPromocode = async (req, res, next) => {
  try {
    const promoCode = new Promocode({
      ...req.body,
    });

    await promoCode.save();

    res.json({
      message: "Promocode added successfully!",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = addPromocode;
