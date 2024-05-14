const PromoCodes = require("../../../models/PromoCodes");

const createPromoCode = async (req, res, next) => {
  try {
    const { name, expiryDate, maxRedeems, percentOff } = req.body;

    const newPromoCode = new PromoCodes({
      name: name.toString().toUpperCase().trim(),
      expiryDate,
      maxRedeems,
      percentOff,
    });

    await newPromoCode.save();

    res.json({ success: true, message: "Promo Code saved successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = createPromoCode;
